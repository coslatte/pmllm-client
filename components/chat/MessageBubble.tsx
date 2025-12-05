import { ChatMessage } from "@/lib/types/chat";
import { FiUser, FiMessageSquare } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const bubbleStyles = {
  user:
    "border border-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-[length:220%_220%] animate-gradient-slow text-white shadow-[0_25px_60px_-35px_rgba(67,56,202,0.85)]",
  assistant:
    "border border-border bg-surface-strong text-foreground shadow-[0_35px_90px_-70px_rgba(15,23,42,0.9)]",
};

type MessageBubbleProps = {
  message: ChatMessage;
};

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-xl space-y-2">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
          {isUser ? <FiUser className="h-3 w-3" /> : <FiMessageSquare className="h-3 w-3" />}
          {isUser ? "You" : "pmLLM"}
        </span>
        <div
          className={`rounded-3xl px-5 py-4 text-sm leading-relaxed transition ${
            bubbleStyles[message.role]
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="space-y-4">
              {/* Main message content */}
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-surface prose-pre:border prose-pre:border-border">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Debug information section */}
              {message.debug && (
                <>
                  {/* Separator line */}
                  <div className="border-t border-border/50 pt-3" />

                  {/* Debug header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted uppercase tracking-wide">
                      System Info
                    </span>
                    {message.confidence && (
                      <span className="text-xs font-medium text-primary">
                        Confidence · {message.confidence}
                      </span>
                    )}
                  </div>

                  {/* Debug metrics */}
                  <div className="flex flex-wrap gap-2">
                    {message.debug.vector_hits && message.debug.vector_hits.length > 0 && (
                      <span className="rounded-full border border-border/30 bg-surface/50 px-2 py-1 text-[10px] text-muted">
                        🔍 {message.debug.vector_hits.length} vectors
                      </span>
                    )}
                    {message.debug.graph_context && message.debug.graph_context.length > 0 && (
                      <span className="rounded-full border border-border/30 bg-surface/50 px-2 py-1 text-[10px] text-muted">
                        🕸️ {message.debug.graph_context.length} nodes
                      </span>
                    )}
                    {message.debug.tag_term && (
                      <span className="rounded-full border border-border/30 bg-surface/50 px-2 py-1 text-[10px] text-muted">
                        🏷️ {message.debug.tag_term}
                      </span>
                    )}
                    {message.debug.latency_ms && (
                      <span className="rounded-full border border-border/30 bg-surface/50 px-2 py-1 text-[10px] text-muted">
                        ⚡ {message.debug.latency_ms}ms
                      </span>
                    )}
                  </div>

                  {/* Detailed debug info */}
                  {message.debug.prompt && (
                    <details className="group">
                      <summary className="cursor-pointer text-xs font-medium text-muted hover:text-foreground transition-colors">
                        Technical Details
                      </summary>
                      <div className="mt-2 space-y-2 rounded-lg border border-border/30 bg-surface/30 p-3">
                        <div>
                          <strong className="text-[10px] font-medium text-muted uppercase tracking-wide">Prompt</strong>
                          <pre className="mt-1 whitespace-pre-wrap text-[10px] font-mono text-muted leading-tight">
                            {message.debug.prompt}
                          </pre>
                        </div>
                        {message.debug.context_sections && message.debug.context_sections.length > 0 && (
                          <div>
                            <strong className="text-[10px] font-medium text-muted uppercase tracking-wide">Context Sections</strong>
                            <ul className="mt-1 list-disc list-inside text-[10px] text-muted">
                              {message.debug.context_sections.map((section, index) => (
                                <li key={index}>{section}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {message.debug.vector_hits && message.debug.vector_hits.length > 0 && (
                          <div>
                            <strong className="text-[10px] font-medium text-muted uppercase tracking-wide">Vector Matches</strong>
                            <div className="mt-1 space-y-1">
                              {message.debug.vector_hits.slice(0, 3).map((hit, index) => (
                                <div key={index} className="text-[10px] font-mono text-muted">
                                  {hit.label} ({hit.score.toFixed(3)})
                                </div>
                              ))}
                              {message.debug.vector_hits.length > 3 && (
                                <div className="text-[10px] text-muted">
                                  ... and {message.debug.vector_hits.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {message.debug.graph_context && message.debug.graph_context.length > 0 && (
                          <div>
                            <strong className="text-[10px] font-medium text-muted uppercase tracking-wide">Graph Connections</strong>
                            <div className="mt-1 max-h-16 overflow-y-auto">
                              <ul className="list-disc list-inside text-[10px] text-muted">
                                {message.debug.graph_context.slice(0, 5).map((node, index) => (
                                  <li key={index}>{node}</li>
                                ))}
                                {message.debug.graph_context.length > 5 && (
                                  <li className="text-muted">
                                    ... and {message.debug.graph_context.length - 5} more connections
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span>{message.timestamp}</span>
          {!isUser && !message.debug && message.confidence && (
            <span className="font-medium text-primary">
              Confidence · {message.confidence}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
