import { useEffect } from "react";

import { joinWorkbook, leaveWorkbook } from "../workbookSocket";

export const useWorkbookSocket = (workbookId: string) => {
  useEffect(() => {
    joinWorkbook(workbookId);

    return () => {
      leaveWorkbook();
    };
  }, [workbookId]);
};
