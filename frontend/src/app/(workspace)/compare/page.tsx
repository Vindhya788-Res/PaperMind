import { GitCompare } from "lucide-react";

import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function ComparePage() {
  return (
    <PlaceholderPage
      title="Compare papers"
      description="Select multiple papers and generate side-by-side comparison tables."
      icon={GitCompare}
      step="step UI-6"
    />
  );
}
