"use client";

import { ChevronLeft, ChevronRight, Download, List, Maximize, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { TableOfContents } from "@/components/pdf/table-of-contents";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Paper, TocEntry } from "@/types";

export interface PdfViewerHandle {
  goToPage: (page: number) => void;
}

interface PdfViewerProps {
  paper: Paper;
  toc: TocEntry[];
  apiRef?: RefObject<PdfViewerHandle | null>;
}

const MIN_ZOOM = 60;
const MAX_ZOOM = 200;
const ZOOM_STEP = 20;
const BASE_PAGE_WIDTH = 620;

export function PdfViewer({ paper, toc, apiRef }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [showToc, setShowToc] = useState(true);

  const goToPage = useCallback((page: number) => {
    const clamped = Math.min(Math.max(1, page), pageRefs.current.length);
    const target = pageRefs.current[clamped - 1];
    const container = containerRef.current;
    if (!target || !container) return;
    setCurrentPage(clamped);
    container.scrollTo({ top: target.offsetTop - 16, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = { goToPage };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, goToPage]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    let nearest = 1;
    let smallestDistance = Number.POSITIVE_INFINITY;
    pageRefs.current.forEach((page, index) => {
      if (!page) return;
      const distance = Math.abs(page.offsetTop - 16 - scrollTop);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearest = index + 1;
      }
    });
    setCurrentPage(nearest);
  }, []);

  const changeZoom = (delta: number) =>
    setZoom((value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value + delta)));

  const pageWidth = (BASE_PAGE_WIDTH * zoom) / 100;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-11 shrink-0 items-center gap-1 border-b border-border bg-card px-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showToc ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label="Toggle contents"
              aria-pressed={showToc}
              onClick={() => setShowToc((value) => !value)}
            >
              <List />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Contents</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          <ChevronLeft />
        </Button>
        <span className="min-w-20 text-center text-xs tabular-nums text-muted-foreground">
          Page {currentPage} / {paper.pageCount}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Next page"
          disabled={currentPage >= paper.pageCount}
          onClick={() => goToPage(currentPage + 1)}
        >
          <ChevronRight />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Zoom out"
          onClick={() => changeZoom(-ZOOM_STEP)}
        >
          <Minus />
        </Button>
        <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">{zoom}%</span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Zoom in"
          onClick={() => changeZoom(ZOOM_STEP)}
        >
          <Plus />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Reset zoom" onClick={() => setZoom(100)}>
          <Maximize />
        </Button>

        <div className="ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Export">
                <Download />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export (soon)</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {showToc ? (
          <TableOfContents entries={toc} currentPage={currentPage} onSelect={goToPage} />
        ) : null}

        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-auto bg-muted/40 p-4"
        >
          <div className="mx-auto flex flex-col items-center gap-4" style={{ width: pageWidth }}>
            {Array.from({ length: paper.pageCount }).map((_, index) => {
              const isFirst = index === 0;
              return (
                <div
                  key={index}
                  ref={(node) => {
                    pageRefs.current[index] = node;
                  }}
                  className="relative w-full rounded-sm border border-border bg-white text-zinc-800 shadow-sm"
                  style={{ aspectRatio: "1 / 1.414" }}
                >
                  <span className="absolute right-3 top-3 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                    {index + 1}
                  </span>
                  <div className="flex h-full flex-col gap-3 p-8">
                    {isFirst ? (
                      <>
                        <div className="h-4 w-3/4 rounded bg-zinc-800/90" />
                        <div className="h-2.5 w-1/2 rounded bg-zinc-300" />
                        <div className="mt-2 h-2 w-full rounded bg-zinc-200" />
                        <div className="h-2 w-full rounded bg-zinc-200" />
                        <div className="h-2 w-5/6 rounded bg-zinc-200" />
                      </>
                    ) : (
                      <div className="h-3 w-2/5 rounded bg-zinc-700/80" />
                    )}
                    {Array.from({ length: isFirst ? 10 : 16 }).map((_, line) => (
                      <div
                        key={line}
                        className="h-2 rounded bg-zinc-200"
                        style={{ width: `${70 + ((line * 7) % 30)}%` }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
