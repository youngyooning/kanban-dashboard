import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/app/layouts/RootLayout";
import { WorkspaceLayout } from "@/app/layouts/WorkspaceLayout";
import { PATH_SEGMENTS } from "@/app/routes/paths";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProjectPage } from "@/pages/ProjectPage";
import { SignupPage } from "@/pages/SignupPage";
import { WorkspacePage } from "@/pages/WorkspacePage";
import { WorkspacesPage } from "@/pages/WorkspacesPage";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: PATH_SEGMENTS.LOGIN,
        Component: LoginPage,
      },
      {
        path: PATH_SEGMENTS.SIGNUP,
        Component: SignupPage,
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
