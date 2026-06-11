-- =========================
-- purpose:
-- - Auth 사용자와 1:1로 연결되는 프로필 테이블 및 불변식 정의
-- - 회원가입시 프로필 row를 자동 생성하고, 사용자 이름 변경은 RPC로 제한
--
-- dependencies:
-- - auth.users 테이블
-- - helpers.set_inserted_timestamps() 함수
-- - helpers.set_updated_at() 함수
--
-- =========================
-- 1. Table: 프로필
-- =========================
CREATE TABLE public.profiles(
	id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
	email text NOT NULL UNIQUE,
	display_name text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	-- 1-1. CHECK: 이메일
	CONSTRAINT profiles_email_not_blank CHECK (btrim(email) <> ''),
	CONSTRAINT profiles_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
	CONSTRAINT profiles_email_normalized CHECK (email = lower(btrim(email))),
	CONSTRAINT profiles_email_max_length CHECK (char_length(email) <= 320),
	-- 1-2. CHECK: 사용자 이름
	CONSTRAINT profiles_display_name_trimmed CHECK (display_name = btrim(display_name)),
	CONSTRAINT profiles_display_name_not_blank CHECK (btrim(display_name) <> ''),
	CONSTRAINT profiles_display_name_max_length CHECK (char_length(display_name) <= 30),
	-- 1-3. CHECK: 타임스탬프
	CONSTRAINT profiles_updated_at_after_created_at CHECK (updated_at >= created_at)
);

-- =========================
-- 2. Helper function
-- =========================
-- 2-1. Helper: Auth 메타데이터 기반 사용자 이름 정규화
CREATE FUNCTION helpers.normalize_display_name(display_name text, fallback_email text)
	RETURNS text
	LANGUAGE sql
	IMMUTABLE
	SET search_path = ''
	AS $$
SELECT
	btrim(
		LEFT(
			coalesce(
				nullif(btrim(display_name), ''),
				nullif(split_part(lower(btrim(fallback_email)), '@', 1), ''),
				'User'
			),
			30
		)
	);
$$;

REVOKE ALL ON FUNCTION helpers.normalize_display_name(text, text) FROM public, anon, authenticated;

-- 2-2. Trigger helper: 프로필 핵심 불변식 보강
CREATE FUNCTION helpers.enforce_profile_invariants()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SET search_path = ''
	AS $$
BEGIN
	NEW.email = lower(btrim(NEW.email));
	NEW.display_name = btrim(NEW.display_name);
	IF TG_OP = 'UPDATE' THEN
		NEW.id = OLD.id;
		NEW.email = OLD.email;
	END IF;
	RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION helpers.enforce_profile_invariants() FROM public, anon, authenticated;

-- 2-3. Trigger helper: Auth 사용자 생성 시 프로필 자동 생성
CREATE FUNCTION helpers.create_profile_for_new_auth_user()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SECURITY DEFINER
	SET search_path = ''
	AS $$
DECLARE
	normalized_email text;
	normalized_display_name text;
BEGIN
	normalized_email = lower(btrim(NEW.email));
	IF normalized_email IS NULL OR normalized_email = '' THEN
		RAISE EXCEPTION 'PROFILE_EMAIL_REQUIRED'
	END IF;
	normalized_display_name := helpers.normalize_display_name(
		coalesce(
			nullif(btrim(NEW.raw_user_meta_data ->> 'display_name'), ''),
			nullif(btrim(NEW.raw_user_meta_data ->> 'name'), ''),
			nullif(btrim(NEW.raw_user_meta_data ->> 'full_name'), ''),
			nullif(btrim(NEW.raw_user_meta_data ->> 'user_name'), '')
		),
		normalized_email);
	INSERT INTO public.profiles(id, email, display_name)
		VALUES (NEW.id, normalized_email, normalized_display_name);
	RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION helpers.create_profile_for_new_auth_user() FROM public, anon, authenticated;

-- =========================
-- 3. Trigger
-- =========================
-- 3-1. Trigger: 프로필 INSERT/UPDATE 시 불변식 유지 및 타임스탬프 자동 갱신
CREATE TRIGGER profiles_apply_invariants
	BEFORE INSERT OR UPDATE ON public.profiles
	FOR EACH ROW
	EXECUTE FUNCTION helpers.enforce_profile_invariants();

CREATE TRIGGER profiles_set_inserted_timestamps
	BEFORE INSERT ON public.profiles
	FOR EACH ROW
	EXECUTE FUNCTION helpers.set_inserted_timestamps();

CREATE TRIGGER profiles_set_updated_at
	BEFORE UPDATE ON public.profiles
	FOR EACH ROW
	EXECUTE FUNCTION helpers.set_updated_at();

-- 3-2. Trigger: Auth 사용자 생성 후 프로필 row 자동 생성
CREATE TRIGGER auth_users_create_profile
	AFTER INSERT ON auth.users
	FOR EACH ROW
	EXECUTE FUNCTION helpers.create_profile_for_new_auth_user();

-- =========================
-- 4. RLS
-- =========================
-- 4-1. enable RLS: 프로필 row 접근 제어 및 테이블 권한 설정
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;

GRANT SELECT ON TABLE public.profiles TO authenticated;

-- 4-2. RLS policy: 사용자는 자신의 프로필만 조회 가능
CREATE POLICY select_self_profiles ON public.profiles
	FOR SELECT TO authenticated
	USING (
		id = (
			SELECT auth.uid()
		)
	);

-- =========================
-- 5. RPC
-- =========================
-- 5-1. RPC: 사용자 이름 변경
CREATE FUNCTION public.update_profile_display_name(display_name text)
	RETURNS public.profiles
	LANGUAGE plpgsql
	SECURITY DEFINER
	SET search_path = ''
	AS $$
DECLARE
	updated_profile public.profiles%ROWTYPE;
	normalized_display_name text;
BEGIN
	IF auth.uid() IS NULL THEN
		RAISE EXCEPTION 'AUTH_REQUIRED';
	END IF;
	normalized_display_name := nullif(btrim(display_name), '');
	IF normalized_display_name IS NULL THEN
		RAISE EXCEPTION 'PROFILE_DISPLAY_NAME_REQUIRED';
	END IF;
	IF char_length(normalized_display_name) > 30 THEN
		RAISE EXCEPTION 'PROFILE_DISPLAY_NAME_TOO_LONG';
	END IF;
	UPDATE
		public.profiles AS p
	SET
		display_name = normalized_display_name
	WHERE
		p.id = auth.uid()
	RETURNING
		p.*
	INTO
		updated_profile;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'PROFILE_NOT_FOUND';
	END IF;
	RETURN updated_profile;
END;
$$;

REVOKE ALL ON FUNCTION public.update_profile_display_name(text) FROM public, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.update_profile_display_name(text) TO authenticated;
