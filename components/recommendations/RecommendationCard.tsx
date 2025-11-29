import { RecommendedAlbum } from "@/lib/types/recommendations";

type RecommendationCardProps = {
  album: RecommendedAlbum;
};

const RecommendationCard = ({ album }: RecommendationCardProps) => {
  return (
    <article className="flex flex-col justify-between rounded-3xl border border-border bg-surface-strong p-5 shadow-[0_32px_90px_-60px_rgba(15,23,42,0.55)]">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
          {album.recurrenceTag}
        </p>
        <h3 className="text-lg font-semibold text-foreground">{album.title}</h3>
        <p className="text-sm text-muted">{album.artist}</p>
        <span className="inline-flex w-fit rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted">
          {album.genre}
        </span>
      </div>
      <p className="mt-4 text-sm text-muted">{album.highlight}</p>
    </article>
  );
};

export default RecommendationCard;
