-- ==============================
-- purpose:
--  - 마이그레이션에서 공통으로 사용할 스키마, 확장, enum type, trigger helper function 정의
--  - 공통 trigger helper function은 helpers 스키마에 분리
--
-- dependencies:
--  - Supabase 기본 스키마 및 역할(extensions, public, anon, authenticated)
--  - PostgreSQL pgcrypto extension
--
-- ==============================
-- 1. Schema/Extensions
-- ==============================
-- 1-1. Schema: helpers
CREATE SCHEMA IF NOT EXISTS helpers;

REVOKE ALL ON SCHEMA helpers FROM public, anon, authenticated;

-- 1-2. Extension: pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ==============================
-- 2. Type
-- ==============================
-- 2-1. Type: 워크스페이스 멤버십 역할
CREATE TYPE public.workspace_member_role AS ENUM(
	'owner',
	'member'
);

-- 2-2. Type: 워크스페이스 초대 생명주기
CREATE TYPE public.workspace_invitation_status AS ENUM(
	'pending',
	'accepted',
	'revoked'
);

-- 2-3. Type: 프로젝트 기본 컬럼
CREATE TYPE public.default_project_column_kind AS ENUM(
	'todo',
	'in_progress',
	'done'
);

-- ==============================
-- 3. Helper function
-- ==============================
-- 3-1. Trigger helper: INSERT 시 created_at 및 updated_at 생성
CREATE FUNCTION helpers.set_inserted_timestamps()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SET search_path = ''
	AS $$
BEGIN
	NEW.created_at = now();
	NEW.updated_at = NEW.created_at;
	RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION helpers.set_inserted_timestamps() FROM public, anon, authenticated;

-- 3-2. Trigger helper: UPDATE 시 created_at 고정 및 updated_at 갱신
CREATE FUNCTION helpers.set_updated_at()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SET search_path = ''
	AS $$
BEGIN
	NEW.created_at = OLD.created_at;
	NEW.updated_at = now();
	RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION helpers.set_updated_at() FROM public, anon, authenticated;
