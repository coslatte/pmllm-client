import { FormEvent } from "react";
import { FiSend } from "react-icons/fi";

type ChatComposerProps = {
  inputValue: string;
  isResponding: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const ChatComposer = ({ inputValue, isResponding, onInputChange, onSubmit }: ChatComposerProps) => {
  return (
    <form onSubmit={onSubmit} className="sticky bottom-0 mx-auto w-full max-w-5xl px-6 pb-8">
      <div className="rounded-3xl border border-zinc-200 bg-white/90 px-6 py-4 shadow-2xl shadow-indigo-100/60 backdrop-blur dark:border-indigo-800/40 dark:bg-indigo-950/70 dark:shadow-black/40">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Prompt
        </label>
        <textarea
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Ask for blends, new releases, or graph connections…"
          rows={3}
          className="w-full resize-none bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
        />
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-zinc-400">
            Powered by /ask · responds with citations and tempo plans.
          </p>
          <button
            type="submit"
            disabled={!inputValue.trim() || isResponding}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
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
