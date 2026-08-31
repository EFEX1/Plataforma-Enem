import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  BackgroundBlobs 
} from './components/BackgroundBlobs';
import { 
  BNCCFilterTabs 
} from './components/BNCCFilterTabs';
import { 
  VideoCard 
} from './components/VideoCard';
import { 
  VideoPlayerModal 
} from './components/VideoPlayerModal';
import { 
  AddEditVideoModal 
} from './components/AddEditVideoModal';
import { 
  GoogleDriveSyncModal 
} from './components/GoogleDriveSyncModal';
import { 
  ProductionGuideModal 
} from './components/ProductionGuideModal';
import { 
  DesignGuidePage 
} from './components/DesignGuidePage';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  User, 
  VideoLesson, 
  BNCCArea, 
  ProductionAxis,
  UserAccount 
} from './types';
import { 
  INITIAL_VIDEOS, 
  PRECONFIGURED_USERS, 
  BNCC_AREAS 
} from './data/initialData';
import { 
  PlusCircle, 
  FileSpreadsheet, 
  Video, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  AlertCircle,
  Film,
  Users
} from 'lucide-react';

const STORAGE_KEY_VIDEOS = 'aulao_enem_videos_catalog_v2';
const STORAGE_KEY_USER = 'aulao_enem_logged_admin_user';
const STORAGE_KEY_USERS_ACCOUNTS = 'aulao_enem_admin_accounts_v3';

export default function App() {
  // Dynamic user accounts (synced with Google Sheets / CSV)
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    try {
      const savedAccounts = localStorage.getItem(STORAGE_KEY_USERS_ACCOUNTS);
      if (savedAccounts) {
        const parsed = JSON.parse(savedAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return PRECONFIGURED_USERS;
  });

  // Current user (defaults to null; login required for admin features)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Video catalog state with local persistence
  const [videos, setVideos] = useState<VideoLesson[]>(() => {
    try {
      const savedVideos = localStorage.getItem(STORAGE_KEY_VIDEOS);
      if (savedVideos) return JSON.parse(savedVideos);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_VIDEOS;
  });

  // View Routing: 'catalog' or 'guide' (dedicated page for Design & Production Guide)
  const [currentView, setCurrentView] = useState<'catalog' | 'guide'>('catalog');

  // Filters
  const [selectedArea, setSelectedArea] = useState<BNCCArea | 'all'>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activePlayerVideo, setActivePlayerVideo] = useState<VideoLesson | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoLesson | null>(null);
  const [isDriveSyncOpen, setIsDriveSyncOpen] = useState(false);
  const [driveSyncInitialTab, setDriveSyncInitialTab] = useState<'videos' | 'users'>('videos');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedAxis, setSelectedAxis] = useState<ProductionAxis | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(videos));
    } catch (e) {
      console.error(e);
    }
  }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS_ACCOUNTS, JSON.stringify(userAccounts));
    } catch (e) {
      console.error(e);
    }
  }, [userAccounts]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Handle Video addition & editing
  const handleSaveVideo = (savedVideo: VideoLesson) => {
    if (editingVideo) {
      setVideos((prev) => prev.map((v) => (v.id === savedVideo.id ? savedVideo : v)));
      showToast(`Videoaula "${savedVideo.title}" atualizada com sucesso!`);
    } else {
      setVideos((prev) => [savedVideo, ...prev]);
      showToast(`Nova videoaula "${savedVideo.title}" inserida com sucesso no repositório!`);
    }
    setEditingVideo(null);
  };

  // Handle Video deletion
  const handleDeleteVideo = (videoId: string) => {
    const target = videos.find((v) => v.id === videoId);
    if (!target) return;

    if (window.confirm(`Tem certeza que deseja remover a videoaula "${target.title}"?`)) {
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      showToast(`Videoaula removida.`);
    }
  };

  // Handle Batch Sync from Drive
  const handleUpdateVideosFromDrive = (newVideos: VideoLesson[]) => {
    setVideos(newVideos);
    showToast(`Catálogo sincronizado com a Planilha Google (${newVideos.length} videoaulas).`);
  };

  // Handle Batch Sync of Logins from Drive/Sheets
  const handleUpdateUserAccountsFromDrive = (newAccounts: UserAccount[]) => {
    setUserAccounts(newAccounts);
    if (currentUser) {
      const match = newAccounts.find((a) => a.user.email.toLowerCase() === currentUser.email.toLowerCase());
      if (match) {
        setCurrentUser(match.user);
      }
    }
    showToast(`Logins e senhas atualizados com a Planilha (${newAccounts.length} contas autorizadas).`);
  };

  // Count videos per area
  const countsByArea = useMemo(() => {
    const counts: Record<string, number> = {
      linguagens: 0,
      matematica: 0,
      natureza: 0,
      humanas: 0,
    };
    videos.forEach((v) => {
      if (counts[v.bnccArea] !== undefined) {
        counts[v.bnccArea]++;
      }
    });
    return counts;
  }, [videos]);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      // Area filter
      if (selectedArea !== 'all' && video.bnccArea !== selectedArea) {
        return false;
      }

      // Discipline filter
      if (selectedDiscipline !== 'all' && video.discipline !== selectedDiscipline) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = video.title.toLowerCase().includes(q);
        const matchesProf = video.professor.toLowerCase().includes(q);
        const matchesDisc = video.discipline.toLowerCase().includes(q);
        const matchesSynopsis = (video.synopsis || '').toLowerCase().includes(q);
        const matchesTags = (video.tags || []).some((t) => t.toLowerCase().includes(q));
        const matchesObjective = (video.practicalObjective || '').toLowerCase().includes(q);

        if (!matchesTitle && !matchesProf && !matchesDisc && !matchesSynopsis && !matchesTags && !matchesObjective) {
          return false;
        }
      }

      return true;
    });
  }, [videos, selectedArea, selectedDiscipline, searchQuery]);

  if (currentView === 'guide') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="topo">
        {/* Background Blur Spheres */}
        <BackgroundBlobs />

        {/* Dedicated Full Page Design & Production Guide */}
        <DesignGuidePage onBackToCatalog={() => setCurrentView('catalog')} />

        {/* Toast alert message */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-aulablue-800 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-aulaorange-500/50 animate-bounce">
            <CheckCircle2 className="h-4 w-4 text-aulaorange-500" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modals still available if opened */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={currentUser}
          userAccounts={userAccounts}
          onLogin={(user) => {
            setCurrentUser(user);
            showToast(`Conectado como Administrador (${user.name}).`);
          }}
          onLogout={() => {
            setCurrentUser(null);
            showToast('Desconectado.');
          }}
          onOpenDriveSyncUsers={() => {
            setDriveSyncInitialTab('users');
            setIsDriveSyncOpen(true);
          }}
        />

        <GoogleDriveSyncModal
          isOpen={isDriveSyncOpen}
          onClose={() => setIsDriveSyncOpen(false)}
          videos={videos}
          onUpdateVideos={handleUpdateVideosFromDrive}
          userAccounts={userAccounts}
          onUpdateUserAccounts={handleUpdateUserAccountsFromDrive}
          currentUser={currentUser}
          initialTab={driveSyncInitialTab}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="topo">
      
      {/* Background Blur Spheres */}
      <BackgroundBlobs />

      {/* Sticky Header */}
      <Header
        currentUser={currentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenAddVideo={() => {
          if (currentUser?.role === 'admin') {
            setEditingVideo(null);
            setIsAddModalOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        onOpenDriveSync={() => {
          setDriveSyncInitialTab('videos');
          setIsDriveSyncOpen(true);
        }}
        onOpenGuide={() => setCurrentView('guide')}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Sessão encerrada.');
        }}
        videoCount={videos.length}
      />

      {/* Toast alert message */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-aulablue-800 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-aulaorange-500/50 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-aulaorange-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Admin Bar Notification Banner */}
        {currentUser?.role === 'admin' ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-aulaorange-200 bg-aulaorange-50/80 px-4 py-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-aulaorange-500 p-1.5 text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-aulablue-800">Modo Administrador Ativo: </span>
                <span className="text-slate-700">Logado como <strong>{currentUser.name}</strong> ({currentUser.email}). Você tem permissão para cadastrar links de videoaulas e sincronizar com o Google Drive.</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingVideo(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-aulablue-800 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-aulablue-700"
              >
                <PlusCircle className="h-3.5 w-3.5 text-aulaorange-500" />
                <span>+ Inserir Videoaula</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDriveSyncInitialTab('videos');
                  setIsDriveSyncOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                <span>Sincronizar Aulas</span>
              </button>

              <button
                type="button"
                id="btn-sync-users-admin-bar"
                onClick={() => {
                  setDriveSyncInitialTab('users');
                  setIsDriveSyncOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-300 bg-white px-3 py-1.5 text-xs font-bold text-aulablue-800 hover:bg-blue-50"
              >
                <Users className="h-3.5 w-3.5 text-aulaorange-500" />
                <span>Sincronizar Logins</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-aulablue-100 bg-aulablue-50/70 px-4 py-2.5 text-xs text-aulablue-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-aulaorange-500" />
              <span>
                Visualizando como <strong>{currentUser?.name || 'Visitante'}</strong>. Acesse todas as videoaulas e materiais de apoio do ENEM.
              </span>
            </div>
            <button
              type="button"
              id="btn-login-admin-banner"
              onClick={() => setIsAuthModalOpen(true)}
              className="font-bold text-aulaorange-600 hover:text-aulaorange-700 hover:underline"
            >
              Entrar como Administrador &rarr;
            </button>
          </div>
        )}

        {/* Section: BNCC Area Separation & Filters */}
        <BNCCFilterTabs
          selectedArea={selectedArea}
          onSelectArea={setSelectedArea}
          selectedDiscipline={selectedDiscipline}
          onSelectDiscipline={setSelectedDiscipline}
          countsByArea={countsByArea}
          totalCount={videos.length}
        />

        {/* Section 3: Video Lessons Grid */}
        <section id="catalogo-videoaulas" className="mb-12">
          
          {/* Grid Header Info */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-aulablue-800 sm:text-2xl">
                {selectedArea === 'all' 
                  ? 'Grade Geral de Videoaulas' 
                  : BNCC_AREAS[selectedArea]?.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Exibindo {filteredVideos.length} {filteredVideos.length === 1 ? 'aula disponível' : 'aulas disponíveis'} 
                {searchQuery ? ` para a busca "${searchQuery}"` : ''}
              </p>
            </div>

            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => {
                  setEditingVideo(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-aulablue-800 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-aulablue-700 hover:-translate-y-0.5 transition-all"
              >
                <PlusCircle className="h-4 w-4 text-aulaorange-500" />
                <span>Inserir Videoaula</span>
              </button>
            )}
          </div>

          {/* Video Cards Grid (Responsive 1 col mobile, 2 sm, 3 lg) */}
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  currentUser={currentUser}
                  onPlay={(v) => setActivePlayerVideo(v)}
                  onEdit={(v) => {
                    setEditingVideo(v);
                    setIsAddModalOpen(true);
                  }}
                  onDelete={handleDeleteVideo}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
              <Film className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-base font-extrabold text-aulablue-800">
                Nenhuma videoaula encontrada
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Tente ajustar os filtros de busca ou selecione outra área do conhecimento da BNCC.
              </p>
              
              <div className="mt-4 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArea('all');
                    setSelectedDiscipline('all');
                    setSearchQuery('');
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Limpar Todos os Filtros
                </button>

                {currentUser?.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVideo(null);
                      setIsAddModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-aulablue-800 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-aulablue-700"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-aulaorange-500" />
                    <span>Cadastrar Primeira Aula Nesta Área</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="mt-8 py-4 text-center text-sm text-white bg-aulablue-800">
        <p>© 2025 Luiz Alessandro Tecnologia Educacional. Todos os direitos reservados.</p>
        <p>Desenvolvido por Luiz Alessandro da Silva.</p>
      </footer>

      {/* Modals */}
      {/* 1. Video Player Modal */}
      <VideoPlayerModal
        video={activePlayerVideo}
        onClose={() => setActivePlayerVideo(null)}
      />

      {/* 2. Add / Edit Video Modal (Admin) */}
      <AddEditVideoModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingVideo(null);
        }}
        onSave={handleSaveVideo}
        editingVideo={editingVideo}
        currentUser={currentUser}
      />

      {/* 3. Google Drive / Sheets Sync Modal */}
      <GoogleDriveSyncModal
        isOpen={isDriveSyncOpen}
        onClose={() => setIsDriveSyncOpen(false)}
        videos={videos}
        onUpdateVideos={handleUpdateVideosFromDrive}
        userAccounts={userAccounts}
        onUpdateUserAccounts={handleUpdateUserAccountsFromDrive}
        currentUser={currentUser}
        initialTab={driveSyncInitialTab}
      />

      {/* 4. Production Design Guide & Axes Modal */}
      <ProductionGuideModal
        isOpen={isGuideModalOpen || !!selectedAxis}
        onClose={() => {
          setIsGuideModalOpen(false);
          setSelectedAxis(null);
        }}
        selectedAxis={selectedAxis}
        onSelectAxis={setSelectedAxis}
      />

      {/* 5. Authentication & Access Level Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        userAccounts={userAccounts}
        onLogin={(user) => {
          setCurrentUser(user);
          showToast(`Conectado como Administrador (${user.name}).`);
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Desconectado.');
        }}
        onOpenDriveSyncUsers={() => {
          setDriveSyncInitialTab('users');
          setIsDriveSyncOpen(true);
        }}
      />

    </div>
  );
}
