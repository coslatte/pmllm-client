import { FormEvent } from "react";
import { FiSend } from "react-icons/fi";

type ChatComposerProps = {
  inputValue: string;
  isResponding: boolean;
  isReady: boolean;
  isBootstrapping: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const ChatComposer = ({
  inputValue,
  isResponding,
  isReady,
  isBootstrapping,
  onInputChange,
  onSubmit,
}: ChatComposerProps) => {
  const isDisabled = !inputValue.trim() || isResponding || !isReady || isBootstrapping;
  const statusLabel = isReady
    ? "Powered by /query · responds with citations and tempo plans."
    : "Conectando con el backend de pmLLM…";

  return (
    <form onSubmit={onSubmit} className="sticky bottom-0 mx-auto w-full">
      <div className="space-y-4 rounded-3xl border border-border bg-surface-strong px-6 py-5 shadow-[0_32px_110px_-60px_rgba(15,23,42,0.55)] backdrop-blur dark:shadow-[0_40px_110px_-70px_rgba(0,0,0,0.9)]">
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
          Prompt
        </label>
        <textarea
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.ctrlKey && event.key === "Enter" && !isDisabled) {
              event.preventDefault();
              onSubmit(event as unknown as FormEvent<HTMLFormElement>);
            }
          }}
          placeholder="Ask for anything music related... (Ctrl + Enter to send)"
          rows={3}
          className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">{statusLabel}</p>
          <button
            type="submit"
            disabled={isDisabled}
            className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-linear-to-r from-primary via-secondary to-accent bg-size-[220%_220%] animate-gradient-slow px-5 py-2 text-sm font-semibold text-white shadow-[0_20px_40px_-25px_rgba(67,56,202,0.8)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiSend className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatComposer;
