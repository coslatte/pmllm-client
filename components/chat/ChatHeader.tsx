import { FiPlus } from "react-icons/fi";

const ChatHeader = () => {
  return (
    <header className="border-b border-zinc-100 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            pmLLM Studio · Gemma 3
          </p>
          <h1 className="text-2xl font-semibold text-zinc-950">
            Music Intelligence Workspace
          </h1>
          <p className="text-sm text-zinc-500">
            Chat, curate, and navigate music knowledge in one clean space.
          </p>
        </div>
        <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-blue-200 hover:text-blue-600 sm:mt-0">
          <FiPlus className="h-4 w-4" />
          New Thread
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
