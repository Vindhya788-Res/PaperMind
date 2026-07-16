import type { LucideIcon } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  step: string;
}

/** Temporary page for routes whose full UI arrives in a later milestone. */
export function PlaceholderPage({ title, description, icon, step }: PlaceholderPageProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={icon}
        title={`${title} is coming in ${step}`}
        description="The workspace shell is ready. This page will be built in an upcoming redesign step."
      />
    </div>
  );
}
