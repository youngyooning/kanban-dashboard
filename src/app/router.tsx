import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/app/layouts/RootLayout";
import { WorkspaceLayout } from "@/app/layouts/WorkspaceLayout";
import { LandingPage } from "@/pages/LandingPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProjectPage } from "@/pages/ProjectPage";
import { WorkspacePage } from "@/pages/WorkspacePage";
import { WorkspacesPage } from "@/pages/WorkspacesPage";
import { PATH_SEGMENTS } from "@/shared/paths";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: PATH_SEGMENTS.WORKSPACES,
        children: [
          {
            index: true,
            Component: WorkspacesPage,
          },
          {
            path: ":workspaceId",
            Component: WorkspaceLayout,
            children: [
              {
                index: true,
                Component: WorkspacePage,
              },
              {
                path: ":projectId",
                Component: ProjectPage,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);
