import { RecommendedAlbum } from "@/lib/types/recommendations";

type RecommendationCardProps = {
  album: RecommendedAlbum;
};

const RecommendationCard = ({ album }: RecommendationCardProps) => {
  return (
    <article className="flex flex-col justify-between rounded-3xl border border-zinc-100 bg-white/80 p-5 shadow-lg shadow-indigo-100/50 backdrop-blur dark:border-indigo-800/40 dark:bg-indigo-950/60 dark:shadow-black/30">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
          {album.recurrenceTag}
        </p>
        <h3 className="text-lg font-semibold text-zinc-900">{album.title}</h3>
        <p className="text-sm text-zinc-500">{album.artist}</p>
        <span className="inline-flex w-fit rounded-full border border-zinc-200 bg-zinc-50/90 px-3 py-1 text-xs font-semibold text-zinc-600 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400">
          {album.genre}
        </span>
      </div>
      <p className="mt-4 text-sm text-zinc-500">{album.highlight}</p>
    </article>
  );
};

export default RecommendationCard;
