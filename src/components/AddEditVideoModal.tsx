import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  Save, 
  Video, 
  FolderDown, 
  Clock, 
  User as UserIcon, 
  Target, 
  BookOpen, 
  Layers, 
  AlertCircle, 
  Sparkles,
  Link as LinkIcon 
} from 'lucide-react';
import { BNCCArea, VideoLesson, User } from '../types';
import { BNCC_AREAS } from '../data/initialData';
import { getEmbedVideoUrl } from '../utils/helpers';

interface AddEditVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (video: VideoLesson) => void;
  editingVideo: VideoLesson | null;
  currentUser: User | null;
}

export const AddEditVideoModal: React.FC<AddEditVideoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingVideo,
  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [bnccArea, setBnccArea] = useState<BNCCArea>('linguagens');
  const [discipline, setDiscipline] = useState('');
  const [professor, setProfessor] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [driveMaterialsUrl, setDriveMaterialsUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [synopsis, setSynopsis] = useState('');
  const [practicalObjective, setPracticalObjective] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title);
      setBnccArea(editingVideo.bnccArea);
      setDiscipline(editingVideo.discipline);
      setProfessor(editingVideo.professor);
      setVideoUrl(editingVideo.videoUrl);
      setDriveMaterialsUrl(editingVideo.driveMaterialsUrl || '');
      setDurationMinutes(editingVideo.durationMinutes || 25);
      setSynopsis(editingVideo.synopsis || '');
      setPracticalObjective(editingVideo.practicalObjective || '');
      setTagsInput(editingVideo.tags?.join(', ') || '');
      setIsFeatured(!!editingVideo.isFeatured);
    } else {
      setTitle('');
      setBnccArea('linguagens');
      setDiscipline('Língua Portuguesa');
      setProfessor(currentUser?.name || 'Prof. SED/SC');
      setVideoUrl('');
      setDriveMaterialsUrl('');
      setDurationMinutes(25);
      setSynopsis('');
      setPracticalObjective('');
      setTagsInput('ENEM, Aulão, BNCC');
      setIsFeatured(false);
    }
    setErrorMessage('');
  }, [editingVideo, isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Por favor, informe o título da videoaula.');
      return;
    }
    if (!videoUrl.trim()) {
      setErrorMessage('Por favor, informe o link do vídeo (YouTube ou Google Drive).');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const videoData: VideoLesson = {
      id: editingVideo ? editingVideo.id : `vid-${Date.now()}`,
      title: title.trim(),
      bnccArea,
      discipline: discipline.trim() || 'Geral ENEM',
      professor: professor.trim() || (currentUser?.name || 'Professor SED/SC'),
      videoUrl: videoUrl.trim(),
      driveMaterialsUrl: driveMaterialsUrl.trim() || undefined,
      durationMinutes: Number(durationMinutes) || 25,
      synopsis: synopsis.trim() || 'Videoaula preparatória para os Aulões do ENEM.',
      practicalObjective: practicalObjective.trim() || 'Compreensão de habilidades da BNCC para o ENEM.',
      targetCompetencies: [BNCC_AREAS[bnccArea]?.competencies[0] || 'Competência BNCC'],
      tags: tags.length > 0 ? tags : ['ENEM', BNCC_AREAS[bnccArea].shortName],
      createdAt: editingVideo ? editingVideo.createdAt : new Date().toISOString().split('T')[0],
      addedBy: currentUser?.name || 'Administrador',
      viewsCount: editingVideo ? editingVideo.viewsCount : 0,
      isFeatured,
    };

    onSave(videoData);
    onClose();
  };

  const previewInfo = getEmbedVideoUrl(videoUrl);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      {/* Dark overlay backdrop */}
      <div 
        className="fixed inset-0 bg-[#00071c]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-aulablue-800 px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-aulaorange-500" />
            <div>
              <h2 className="text-base font-extrabold text-white">
                {editingVideo ? 'Editar Videoaula' : 'Inserir Nova Videoaula (Admin)'}
              </h2>
              <p className="text-xs text-slate-300">
                Cadastro por Área do Conhecimento BNCC e Materiais no Drive
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/10 p-1.5 text-slate-300 hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Area BNCC Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-aulablue-800 mb-1.5">
              1. Área do Conhecimento (BNCC) *
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(BNCC_AREAS) as BNCCArea[]).map((areaKey) => {
                const area = BNCC_AREAS[areaKey];
                const isSelected = bnccArea === areaKey;
                return (
                  <button
                    key={areaKey}
                    type="button"
                    onClick={() => {
                      setBnccArea(areaKey);
                      if (area.disciplines.length > 0 && !editingVideo) {
                        setDiscipline(area.disciplines[0]);
                      }
                    }}
                    className={`rounded-xl p-2.5 text-left text-xs font-bold transition-all border ${
                      isSelected
                        ? 'border-aulaorange-500 bg-aulablue-800 text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-aulablue-100 hover:bg-white'
                    }`}
                  >
                    <div className="text-[10px] text-aulaorange-400 uppercase tracking-wider">
                      Área BNCC
                    </div>
                    <div className="truncate font-black">{area.shortName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title and Discipline */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-aulablue-800 mb-1">
                2. Título da Videoaula *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Redação Nota 1000: Proposta de Intervenção"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-aulaorange-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-aulaorange-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-aulablue-800 mb-1">
                Disciplina / Matéria
              </label>
              <input
                type="text"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                placeholder="Ex: Redação, Biologia..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-aulaorange-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-aulaorange-500/20"
              />
            </div>
          </div>

          {/* Professor and Duration */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-aulablue-800 mb-1">
                Professor(a) / Docente
              </label>
              <input
                type="text"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                placeholder="Ex: Prof.ª Dra. Helena Viana"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-aulaorange-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-aulablue-800 mb-1">
                Duração (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-aulaorange-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Video URL (YouTube or Google Drive link) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-aulablue-800 mb-1">
              Link da Videoaula (YouTube ou Google Drive) *
            </label>
            <div className="relative">
              <LinkIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... ou https://drive.google.com/file/d/.../view"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm text-slate-800 placeholder-slate-400 focus:border-aulaorange-500 focus:bg-white focus:outline-hidden"
                required
              />
            </div>
            {videoUrl && (
              <p className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Formato detectado: {previewInfo.type.toUpperCase()} ({previewInfo.isEmbeddable ? 'Incorporação suportada' : 'Link direto'})
              </p>
            )}
          </div>

          {/* Google Drive Materials URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-aulablue-800 mb-1">
              Link de Slides e Materiais no Google Drive (Opcional)
            </label>
            <div className="relative">
              <FolderDown className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-aulaorange-500" />
              <input
                type="url"
                value={driveMaterialsUrl}
                onChange={(e) => setDriveMaterialsUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/... ou link de PDF"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm text-slate-800 placeholder-slate-400 focus:border-aulaorange-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Practical Objective */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-aulablue-800 mb-1">
              Objetivo Prático da Aula
            </label>
            <input
              type="text"
              value={practicalObjective}
              onChange={(e) => setPracticalObjective(e.target.value)}
              placeholder="Ex: Capacitar o estudante a aplicar a Competência 5 na redação..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-aulaorange-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-aulablue-800 mb-1">
              Sinopse / Conteúdo Resumido
            </label>
            <textarea
              rows={2}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Breve descrição dos tópicos abordados e exercícios resolvidos..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-aulaorange-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Tags and Featured toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="w-full sm:w-2/3">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Tags (separadas por vírgula):
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ENEM, Redação, Nota 1000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-aulaorange-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer self-start sm:self-center mt-2 sm:mt-0">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-aulaorange-500 focus:ring-aulaorange-500"
              />
              <span className="text-xs font-bold text-slate-700">Destaque na Capa</span>
            </label>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-aulablue-800 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-aulablue-700 hover:shadow-lg"
            >
              <Save className="h-4 w-4 text-aulaorange-500" />
              <span>{editingVideo ? 'Salvar Alterações' : 'Cadastrar Videoaula'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
