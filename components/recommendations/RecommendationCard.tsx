import { RecommendedAlbum } from "@/lib/types/recommendations";

type RecommendationCardProps = {
  album: RecommendedAlbum;
};

const RecommendationCard = ({ album }: RecommendationCardProps) => {
  return (
    <article className="flex flex-col justify-between rounded-3xl border border-zinc-100 bg-white/80 p-5 shadow-lg shadow-blue-100/40">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-500">
          {album.recurrenceTag}
        </p>
        <h3 className="text-lg font-semibold text-zinc-900">{album.title}</h3>
        <p className="text-sm text-zinc-500">{album.artist}</p>
        <span className="inline-flex w-fit rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600">
          {album.genre}
        </span>
      </div>
      <p className="mt-4 text-sm text-zinc-500">{album.highlight}</p>
    </article>
  );
};

export default RecommendationCard;
