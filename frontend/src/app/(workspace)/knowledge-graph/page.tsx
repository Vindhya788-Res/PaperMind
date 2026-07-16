import { Network } from "lucide-react";

import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function KnowledgeGraphPage() {
  return (
    <PlaceholderPage
      title="Knowledge Graph"
      description="Explore relationships between papers, authors, and concepts."
      icon={Network}
      step="a later phase"
    />
  );
}
