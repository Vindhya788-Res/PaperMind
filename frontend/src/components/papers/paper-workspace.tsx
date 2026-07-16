"use client";

import { Highlighter } from "lucide-react";
import { useRef } from "react";

import { ChatPanel } from "@/components/chat/chat-panel";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { NoteEditor } from "@/components/notes/note-editor";
import { CitationCard } from "@/components/papers/citation-card";
import { PdfViewer, type PdfViewerHandle } from "@/components/pdf/pdf-viewer";
import { SummaryPanel } from "@/components/summary/summary-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePaperDetail } from "@/lib/hooks/use-paper-detail";

const RIGHT_TABS = [
  { value: "summary", label: "Summary" },
  { value: "notes", label: "Notes" },
  { value: "chat", label: "Chat" },
  { value: "citations", label: "Citations" },
  { value: "highlights", label: "Highlights" },
];

export function PaperWorkspace({ paperId }: { paperId: string }) {
  const { data, isLoading, isError, refetch } = usePaperDetail(paperId);
  const viewerRef = useRef<PdfViewerHandle | null>(null);

  const jumpToPage = (page: number) => viewerRef.current?.goToPage(page);

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex h-full min-h-0">
        <div className="flex-1 bg-muted/40 p-6">
          <Skeleton className="mx-auto h-full max-w-xl" />
        </div>
        <div className="hidden w-[400px] shrink-0 flex-col gap-3 border-l border-border p-4 lg:flex">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <PdfViewer paper={data.paper} toc={data.toc} apiRef={viewerRef} />

      <div className="flex min-h-0 w-full shrink-0 flex-col border-t border-border lg:w-[400px] lg:border-l lg:border-t-0">
        <Tabs defaultValue="summary" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-border p-2">
            <TabsList className="w-full justify-start overflow-x-auto">
              {RIGHT_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="p-4">
              <TabsContent value="summary">
                <SummaryPanel summary={data.summary} />
              </TabsContent>

              <TabsContent value="notes">
                <NoteEditor />
              </TabsContent>

              <TabsContent value="chat">
                <div className="flex h-[28rem]">
                  <ChatPanel
                    suggestedQuestions={data.suggestedQuestions}
                    onJumpToSource={jumpToPage}
                  />
                </div>
              </TabsContent>

              <TabsContent value="citations">
                <div className="flex flex-col gap-2">
                  {data.citations.map((citation) => (
                    <CitationCard
                      key={citation.id}
                      citation={citation}
                      onJumpToSource={jumpToPage}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="highlights">
                <EmptyState
                  icon={Highlighter}
                  title="No highlights yet"
                  description="Select text in the document to create highlights. Highlighting arrives with the annotation feature."
                  className="border-0 py-10"
                />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
