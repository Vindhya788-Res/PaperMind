import type { ReactNode } from "react";

import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { UploadDialogHost } from "@/components/upload/upload-dialog-host";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <LeftSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
          <RightSidebar />
        </div>
      </div>
      <UploadDialogHost />
    </div>
  );
}
