"use client";

import { FileText, Info, Notebook, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUiStore, type RightPanelTab } from "@/stores/ui-store";

const TABS: Array<{ value: RightPanelTab; label: string }> = [
  { value: "metadata", label: "Info" },
  { value: "related", label: "Related" },
  { value: "summary", label: "Summary" },
  { value: "notes", label: "Notes" },
];

export function RightSidebar() {
  const open = useUiStore((state) => state.rightSidebarOpen);
  const tab = useUiStore((state) => state.rightPanelTab);
  const setTab = useUiStore((state) => state.setRightPanelTab);

  if (!open) return null;

  return (
    <aside className="hidden w-80 shrink-0 flex-col border-l border-border bg-card xl:flex">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as RightPanelTab)}
        className="flex h-full flex-col"
      >
        <div className="border-b border-border p-3">
          <TabsList className="grid w-full grid-cols-4">
            {TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value} className="text-xs">
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="metadata">
              <ContextPlaceholder
                icon={Info}
                title="No document selected"
                description="Open a paper to see its metadata and document statistics here."
              />
            </TabsContent>
            <TabsContent value="related">
              <ContextPlaceholder
                icon={Sparkles}
                title="Related papers"
                description="Related work surfaces here once a paper is open."
              />
            </TabsContent>
            <TabsContent value="summary">
              <ContextPlaceholder
                icon={FileText}
                title="Summary"
                description="AI-generated summaries appear here for the active document."
              />
            </TabsContent>
            <TabsContent value="notes">
              <ContextPlaceholder
                icon={Notebook}
                title="Notes"
                description="Your notes for the active paper will live here."
              />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}

function ContextPlaceholder({
  icon,
  title,
  description,
}: {
  icon: typeof Info;
  title: string;
  description: string;
}) {
  return (
    <EmptyState icon={icon} title={title} description={description} className="border-0 py-10" />
  );
}
