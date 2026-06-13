export const PATH_SEGMENTS = {
  LOGIN: "login",
  SIGNUP: "signup",
  WORKSPACES: "workspaces",
} as const;

export const PATHS = {
  ROOT: "/",
  LOGIN: `/${PATH_SEGMENTS.LOGIN}`,
  SIGNUP: `/${PATH_SEGMENTS.SIGNUP}`,
  WORKSPACES: `/${PATH_SEGMENTS.WORKSPACES}`,
  WORKSPACE: (workspaceId: string) => `/${PATH_SEGMENTS.WORKSPACES}/${workspaceId}`,
  PROJECT: (workspaceId: string, projectId: string) =>
    `/${PATH_SEGMENTS.WORKSPACES}/${workspaceId}/${projectId}`,
} as const;
