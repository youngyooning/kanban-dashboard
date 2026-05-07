type RequiredEnvName = "VITE_SUPABASE_URL" | "VITE_SUPABASE_PUBLISHABLE_KEY";

function readEnv(name: RequiredEnvName) {
  const value = import.meta.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`[ENV] Missing required environment variable: ${name}. Check .env.local file.`);
  }

  return value.trim();
}

function readUrlEnv(name: "VITE_SUPABASE_URL") {
  const value = readEnv(name);

  try {
    return new URL(value).toString();
  } catch {
    throw new Error(`[ENV] Invalid URL for ${name}. Expected a valid absolute URL.`);
  }
}

export const env = {
  supabaseUrl: readUrlEnv("VITE_SUPABASE_URL"),
  supabasePublishableKey: readEnv("VITE_SUPABASE_PUBLISHABLE_KEY"),
} as const;
