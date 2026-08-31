import React from 'react';
import { 
  PlusCircle, 
  FileSpreadsheet, 
  BookOpen, 
  Search, 
  ShieldCheck, 
  User as UserIcon, 
  LogIn, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddVideo: () => void;
  onOpenDriveSync: () => void;
  onOpenGuide: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  videoCount: number;
  currentView?: 'catalog' | 'guide';
  onNavigate?: (view: 'catalog' | 'guide') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  searchQuery,
  onSearchChange,
  onOpenAddVideo,
  onOpenDriveSync,
  onOpenGuide,
  onOpenAuth,
  onLogout,
  videoCount,
  currentView = 'catalog',
  onNavigate,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header 
      id="main-app-header" 
      className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        
        {/* Left: Logo & Title Brand */}
        <div className="flex items-center gap-3.5">
          <button 
            type="button"
            onClick={() => onNavigate ? onNavigate('catalog') : undefined}
            id="brand-logo-link"
            className="flex items-center gap-3 transition-transform hover:opacity-95 text-left"
            title="Aulão ENEM - Catálogo Principal"
          >
            <img 
              src="https://i.ibb.co/gFmSJ5gT/logo-aul-o-enem.jpg" 
              alt="logo aulão enem" 
              border="0" 
              referrerPolicy="no-referrer" 
              className="h-10 w-auto rounded-lg object-contain shadow-xs sm:h-12"
              id="header-brand-logo-img"
            />
            <div className="hidden flex-col sm:flex">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Produção & Repositório
              </span>
              <span className="text-base font-black text-[#00154e]">
                Aulões <span className="text-[#ed9524]">ENEM</span>
              </span>
            </div>
          </button>

          {/* Navigation Pills */}
          <div className="hidden items-center gap-1.5 md:flex pl-2">
            <button
              type="button"
              onClick={() => onNavigate?.('catalog')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                currentView === 'catalog'
                  ? 'bg-aulablue-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Catálogo ({videoCount})
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('guide')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                currentView === 'guide'
                  ? 'bg-aulaorange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Guia de Design
            </button>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1 sm:max-w-md lg:max-w-lg">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por tema, disciplina, professor ou competência..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-aulaorange-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-aulaorange-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions & User Role */}
        <div className="order-2 flex items-center gap-2 sm:order-3">
          {/* Production Guide Button */}
          <button
            type="button"
            id="btn-open-production-guide"
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 rounded-xl border border-aulablue-100 bg-white px-3 py-2 text-xs font-bold text-aulablue-800 shadow-xs transition-all hover:border-aulaorange-500 hover:text-aulaorange-600 hover:-translate-y-0.5"
            title="Guia de Design e Produção de Videoaulas"
          >
            <BookOpen className="h-3.5 w-3.5 text-aulaorange-500" />
            <span className="hidden md:inline">Guia de Design</span>
          </button>

          {/* Google Drive / Sheet Sync Button - Only visible for Admins */}
          {isAdmin && (
            <button
              type="button"
              id="btn-open-drive-sync"
              onClick={onOpenDriveSync}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-emerald-500 hover:text-emerald-700 hover:-translate-y-0.5"
              title="Sincronizar com Google Drive e Planilha"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span className="hidden lg:inline">Planilha / Drive</span>
            </button>
          )}

          {/* Add Video Button - Only visible for Admins */}
          {isAdmin && (
            <button
              type="button"
              id="btn-add-video-admin"
              onClick={onOpenAddVideo}
              className="inline-flex items-center gap-1.5 rounded-xl bg-aulablue-800 px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-aulablue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="h-4 w-4 text-aulaorange-500" />
              <span>Inserir Vídeo</span>
            </button>
          )}

          {/* User Account / Role Badge */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-1">
              <button
                type="button"
                id="btn-user-profile"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 rounded-xl border border-aulaorange-200 bg-aulaorange-50 px-2.5 py-1.5 text-xs font-bold text-aulaorange-700 transition-all hover:shadow-xs"
                title={`Logado como: ${currentUser.name} (Administrador)`}
              >
                <ShieldCheck className="h-4 w-4 text-aulaorange-500" />
                <span className="hidden max-w-[120px] truncate xl:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="rounded-md bg-aulaorange-500 px-1.5 py-0.2 text-[10px] uppercase tracking-wide text-white font-extrabold">
                  Admin
                </span>
              </button>

              <button
                type="button"
                id="btn-logout"
                onClick={onLogout}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                title="Desconectar da conta de Administrador"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="btn-login-prompt"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-all hover:border-aulablue-800 hover:text-aulablue-800"
              title="Acesso exclusivo para o Administrador"
            >
              <ShieldCheck className="h-4 w-4 text-aulaorange-500" />
              <span>Acesso Admin</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
