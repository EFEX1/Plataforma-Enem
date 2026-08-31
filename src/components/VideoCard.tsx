import React from 'react';
import { 
  Play, 
  FolderDown, 
  Clock, 
  User as UserIcon, 
  Target, 
  Edit3, 
  Trash2, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { VideoLesson, User } from '../types';
import { BNCC_AREAS } from '../data/initialData';
import { getVideoThumbnail } from '../utils/helpers';

interface VideoCardProps {
  video: VideoLesson;
  currentUser: User | null;
  onPlay: (video: VideoLesson) => void;
  onEdit: (video: VideoLesson) => void;
  onDelete: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  currentUser,
  onPlay,
  onEdit,
  onDelete,
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const areaInfo = BNCC_AREAS[video.bnccArea] || BNCC_AREAS.linguagens;
  const thumbnail = getVideoThumbnail(video.videoUrl, video.bnccArea);

  return (
    <div
      id={`video-card-${video.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-aulaorange-500 hover:shadow-2xl"
    >
      <div>
        {/* Thumbnail and Overlay */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          <img
            src={thumbnail}
            alt={video.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-aulablue-950/80 via-transparent to-black/20" />

          {/* Area Badge top-left */}
          <div className="absolute top-3 left-3 z-10">
            <span 
              className="inline-flex items-center gap-1 rounded-md border border-aulablue-100/30 bg-aulablue-900/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-xs"
            >
              {areaInfo.shortName}
            </span>
          </div>

          {/* Duration Badge top-right */}
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-xs">
              <Clock className="h-3 w-3 text-aulaorange-500" />
              {video.durationMinutes} min
            </span>
          </div>

          {/* Central Play Button on hover */}
          <button
            type="button"
            id={`btn-play-overlay-${video.id}`}
            onClick={() => onPlay(video)}
            className="absolute inset-0 flex items-center justify-center transition-all group-hover:bg-aulablue-900/30"
            aria-label={`Assistir ${video.title}`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aulaorange-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-aulaorange-600">
              <Play className="h-5 w-5 fill-white pl-0.5" />
            </div>
          </button>

          {/* Discipline pill bottom-left on thumbnail */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            <span className="rounded bg-white/90 px-2 py-0.5 text-[11px] font-extrabold text-aulablue-800 backdrop-blur-xs">
              {video.discipline}
            </span>

            {video.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded bg-aulaorange-500 px-2 py-0.5 text-[10px] font-black text-white">
                <Sparkles className="h-2.5 w-2.5" /> Destaque
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Professor */}
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <UserIcon className="h-3.5 w-3.5 text-aulaorange-500" />
            <span className="truncate">{video.professor}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onPlay(video)}
            className="cursor-pointer text-base font-black leading-snug text-aulablue-800 transition-colors group-hover:text-aulablue-700 hover:underline"
            title={video.title}
          >
            {video.title}
          </h3>

          {/* Synopsis */}
          <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
            {video.synopsis}
          </p>

          {/* Practical Objective Box (Caixa de objetivo prático) */}
          {video.practicalObjective && (
            <div className="mt-3.5 rounded-xl border border-aulablue-100 bg-aulablue-50 p-2.5 text-xs text-aulablue-800">
              <div className="flex items-start gap-1.5">
                <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-aulaorange-500" />
                <div>
                  <span className="font-bold text-[11px] uppercase tracking-wider text-aulablue-700">Objetivo Prático: </span>
                  <span className="text-[12px] text-slate-700">{video.practicalObjective}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {video.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-4 pt-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Main CTA: Assistir Aula */}
          <button
            type="button"
            id={`btn-watch-${video.id}`}
            onClick={() => onPlay(video)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-aulablue-800 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-aulablue-700 hover:shadow-md"
          >
            <Play className="h-3.5 w-3.5 fill-white text-white" />
            <span>Assistir Aula</span>
          </button>

          {/* Drive Materials Button */}
          {video.driveMaterialsUrl && (
            <a
              href={video.driveMaterialsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-aulaorange-200 bg-aulaorange-50 px-3 py-2 text-xs font-bold text-aulaorange-700 transition-all hover:bg-aulaorange-500 hover:text-white"
              title="Acessar slides e materiais de apoio no Google Drive"
            >
              <FolderDown className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Drive</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Admin Controls (Edit / Delete) */}
        {isAdmin && (
          <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-400">
              Admin:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                id={`btn-edit-${video.id}`}
                onClick={() => onEdit(video)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-200 hover:text-aulablue-800"
                title="Editar videoaula"
              >
                <Edit3 className="h-3 w-3" />
                <span>Editar</span>
              </button>

              <button
                type="button"
                id={`btn-delete-${video.id}`}
                onClick={() => onDelete(video.id)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50"
                title="Excluir videoaula"
              >
                <Trash2 className="h-3 w-3" />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
