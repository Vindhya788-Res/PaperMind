import { Sparkles } from "lucide-react";

import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function ProjectsPage() {
  return (
    <PlaceholderPage
      title="Projects"
      description="Group papers, notes, and experiments into research projects."
      icon={Sparkles}
      step="step UI-5"
    />
  );
}
