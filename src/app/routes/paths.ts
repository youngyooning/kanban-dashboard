export const PATH_SEGMENTS = {
  WORKSPACES: "workspaces",
} as const;

export const PATHS = {
  ROOT: "/",
  WORKSPACES: `/${PATH_SEGMENTS.WORKSPACES}`,
  WORKSPACE: (workspaceId: string) => `/${PATH_SEGMENTS.WORKSPACES}/${workspaceId}`,
  PROJECT: (workspaceId: string, projectId: string) =>
    `/${PATH_SEGMENTS.WORKSPACES}/${workspaceId}/${projectId}`,
} as const;
