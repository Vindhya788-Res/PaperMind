"use client";

import { MessageSquareText, SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatSource {
  label: string;
  page: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  confidence?: "High" | "Medium" | "Low";
}

interface ChatPanelProps {
  suggestedQuestions: string[];
  onJumpToSource?: (page: number) => void;
}

export function ChatPanel({ suggestedQuestions, onJumpToSource }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messageCounter = useRef(0);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const turn = ++messageCounter.current;
    const userMessage: ChatMessage = {
      id: `u-${turn}`,
      role: "user",
      content: trimmed,
    };
    const assistantMessage: ChatMessage = {
      id: `a-${turn}`,
      role: "assistant",
      content:
        "This is a placeholder answer. Once the retrieval backend is connected, responses will be grounded in the paper with inline citations.",
      sources: [
        { label: "[1]", page: 2 },
        { label: "[2]", page: 5 },
      ],
      confidence: "Medium",
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput("");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquareText className="size-4" /> Ask questions about this paper.
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Suggested
              </span>
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => send(question)}
                  className="rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} onJumpToSource={onJumpToSource} />
            ))}
          </div>
        )}
      </div>

      <form
        className="mt-3 flex items-center gap-2 border-t border-border pt-3"
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about this paper…"
          aria-label="Ask about this paper"
        />
        <Button type="submit" size="icon" aria-label="Send" disabled={!input.trim()}>
          <SendHorizontal />
        </Button>
      </form>
    </div>
  );
}

function MessageBubble({
  message,
  onJumpToSource,
}: {
  message: ChatMessage;
  onJumpToSource?: (page: number) => void;
}) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
          isUser ? "bg-primary text-primary-foreground" : "border border-border bg-card",
        )}
      >
        <p>{message.content}</p>
        {!isUser && message.sources ? (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-border pt-2">
            {message.confidence ? (
              <Badge variant="secondary" className="text-[10px]">
                {message.confidence} confidence
              </Badge>
            ) : null}
            {message.sources.map((source) => (
              <button
                key={source.label}
                type="button"
                onClick={() => onJumpToSource?.(source.page)}
                className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-primary transition-colors hover:bg-accent"
              >
                {source.label} p.{source.page}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
