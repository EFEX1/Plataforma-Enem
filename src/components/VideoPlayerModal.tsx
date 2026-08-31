import React, { useState } from 'react';
import { 
  X, 
  Play, 
  FolderDown, 
  ExternalLink, 
  Clock, 
  User as UserIcon, 
  Target, 
  Lightbulb, 
  Share2, 
  Check, 
  Maximize2 
} from 'lucide-react';
import { VideoLesson } from '../types';
import { BNCC_AREAS } from '../data/initialData';
import { getEmbedVideoUrl } from '../utils/helpers';

interface VideoPlayerModalProps {
  video: VideoLesson | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!video) return null;

  const areaInfo = BNCC_AREAS[video.bnccArea] || BNCC_AREAS.linguagens;
  const { embedUrl, isEmbeddable, type } = getEmbedVideoUrl(video.videoUrl);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(video.videoUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      id="video-player-modal-container"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop: Dark overlay (#00071c) with backdrop-blur-sm */}
      <div 
        className="fixed inset-0 bg-[#00071c]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card with Scale Animation & Rounded-2xl */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl transition-all duration-300 transform scale-100 border border-slate-200">
        
        {/* Modal Header with Dark Gradient (#000e33 to #00154e) */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-gradient-to-r from-[#000e33] to-[#00154e] px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-bold text-aulaorange-200">
              {areaInfo.shortName}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {video.discipline}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-copy-video-link"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
              title="Copiar link"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              type="button"
              id="btn-close-video-modal"
              onClick={onClose}
              className="rounded-lg bg-white/10 p-1.5 text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video w-full bg-black">
          {isEmbeddable ? (
            type === 'direct' ? (
              <video 
                src={embedUrl} 
                controls 
                autoPlay 
                className="h-full w-full object-contain"
              />
            ) : (
              <iframe
                src={embedUrl}
                title={video.title}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-white">
              <Play className="mb-3 h-12 w-12 text-aulaorange-500" />
              <p className="font-bold">Link externo da videoaula</p>
              <p className="mt-1 text-xs text-slate-400 max-w-md">{video.videoUrl}</p>
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-aulaorange-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-colors hover:bg-aulaorange-600"
              >
                <span>Abrir Vídeo na Plataforma Oficial</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>

        {/* Video Details Content */}
        <div className="p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-1.5">
                <span className="flex items-center gap-1">
                  <UserIcon className="h-3.5 w-3.5 text-aulaorange-500" />
                  {video.professor}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {video.durationMinutes} minutos
                </span>
              </div>

              <h2 className="text-xl font-black text-aulablue-800 sm:text-2xl">
                {video.title}
              </h2>
            </div>

            {/* Drive materials action */}
            {video.driveMaterialsUrl && (
              <a
                href={video.driveMaterialsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-aulaorange-200 bg-aulaorange-50 px-4 py-2.5 text-xs font-bold text-aulaorange-700 shadow-xs transition-all hover:bg-aulaorange-500 hover:text-white shrink-0"
              >
                <FolderDown className="h-4 w-4" />
                <span>Slides & Exercícios no Drive</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {/* Synopsis */}
          <div className="mt-4 text-sm leading-relaxed text-slate-700">
            <p>{video.synopsis}</p>
          </div>

          {/* Pedagogy Specs Cards Grid: Practical Objective (#f2f5fd) and Example (#fffaf2) */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            {/* Practical Objective Box (#f2f5fd aulablue-50) */}
            <div className="rounded-xl border border-aulablue-100 bg-[#f2f5fd] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-aulablue-800 mb-1.5">
                <Target className="h-4 w-4 text-aulaorange-500" />
                <span>Objetivo Prático da Aula</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                {video.practicalObjective || 'Desenvolvimento das habilidades essenciais da matriz de referência do ENEM.'}
              </p>
            </div>

            {/* Examples & Recommendations Box (#fffaf2 aulaorange-50) */}
            <div className="rounded-xl border border-aulaorange-200 bg-[#fffaf2] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-aulaorange-700 mb-1.5">
                <Lightbulb className="h-4 w-4 text-aulaorange-500" />
                <span>Recomendações para o Aulão</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                Resolver as questões propostas no material complementar antes da revisão do gabarito comentado pelo professor.
              </p>
            </div>

          </div>

          {/* Competencies & Tags */}
          {video.targetCompetencies && video.targetCompetencies.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 mr-2">
                Competências BNCC/ENEM:
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {video.targetCompetencies.map((comp, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-aulablue-100 bg-aulablue-50 px-2.5 py-1 text-xs font-bold text-aulablue-800"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
