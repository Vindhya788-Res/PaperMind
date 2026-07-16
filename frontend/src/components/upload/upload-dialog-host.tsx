"use client";

import { useUiStore } from "@/stores/ui-store";
import { UploadDialog } from "./upload-dialog";

/** Mounts the global upload dialog and binds it to the shared UI store. */
export function UploadDialogHost() {
  const open = useUiStore((state) => state.uploadOpen);
  const setUploadOpen = useUiStore((state) => state.setUploadOpen);

  return <UploadDialog open={open} onOpenChange={setUploadOpen} />;
}
