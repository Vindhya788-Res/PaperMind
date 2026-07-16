import { Settings } from "lucide-react";

import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Configure models, retrieval, appearance, and API keys."
      icon={Settings}
      step="step UI-7"
    />
  );
}
