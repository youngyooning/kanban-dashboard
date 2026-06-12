import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { subscribeAuthSessionChange } from "../api/auth-api";
import { authQueryKeys } from "../api/auth-queries";

export function useAuthSessionSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    return subscribeAuthSessionChange((_event, nextUser) => {
      queryClient.setQueryData(authQueryKeys.sessionUser(), nextUser);
    });
  }, [queryClient]);
}
