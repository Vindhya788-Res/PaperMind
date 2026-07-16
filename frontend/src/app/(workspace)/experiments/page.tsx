import { FlaskConical } from "lucide-react";

import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function ExperimentsPage() {
  return (
    <PlaceholderPage
      title="Experiments"
      description="Track retrieval and RAG experiments with their configs and metrics."
      icon={FlaskConical}
      step="step UI-6"
    />
  );
}
