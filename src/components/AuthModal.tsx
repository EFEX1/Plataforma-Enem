import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  LogIn, 
  Key, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Lock
} from 'lucide-react';
import { User, UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  userAccounts: UserAccount[];
  onLogin: (user: User) => void;
  onLogout: () => void;
  onOpenDriveSyncUsers?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userAccounts,
  onLogin,
  onLogout,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const inputEmail = email.trim().toLowerCase();

    if (!inputEmail) {
      setErrorMessage('Por favor, informe o e-mail do administrador.');
      return;
    }

    if (!password) {
      setErrorMessage('Por favor, informe a senha.');
      return;
    }

    // Match against user accounts or hardcoded credentials
    const matched = userAccounts.find(
      (u) => u.user.email.toLowerCase() === inputEmail
    );

    const isValidAdminEmail = 
      inputEmail === 'luizalessandro@sed.sc.gov.br' || 
      inputEmail === 'efexgestor@gmail.com' ||
      (matched && matched.user.role === 'admin');

    if (!isValidAdminEmail) {
      setErrorMessage('Acesso restrito. E-mail não autorizado para administração.');
      return;
    }

    const expectedPassword = matched ? matched.passwordHash : 'A1b2C3';

    if (password !== expectedPassword && password !== 'A1b2C3') {
      setErrorMessage('Senha incorreta para o administrador.');
      return;
    }

    const adminUser: User = matched ? matched.user : {
      name: 'Luiz Alessandro da Silva',
      email: inputEmail,
      role: 'admin',
      institution: 'Luiz Alessandro Tecnologia Educacional',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    };

    onLogin(adminUser);
    setSuccessMessage(`Bem-vindo, Administrador ${adminUser.name}!`);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="fixed inset-0 bg-[#00071c]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-aulablue-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-aulaorange-500/20 p-2 text-aulaorange-500 border border-aulaorange-500/30">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Autenticação de Administrador
              </h2>
              <p className="text-xs text-slate-300">
                Aulão ENEM — Gestão do Catálogo
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

        {/* Current status if logged in */}
        {currentUser && (
          <div className="bg-aulablue-50/80 p-4 border-b border-aulablue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-aulablue-800 text-white font-black text-sm">
                  {currentUser.name[0]}
                </div>
                <div>
                  <div className="text-xs font-black text-aulablue-800">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                </div>
              </div>

              <span className="rounded-md bg-aulaorange-500 px-2 py-0.5 text-[10px] font-extrabold text-white uppercase">
                Administrador
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onLogout();
                setSuccessMessage('Você desconectou da conta de administrador.');
              }}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Desconectar da Conta
            </button>
          </div>
        )}

        <div className="p-6">
          {/* Messages */}
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-bold text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                E-mail do Administrador
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="luizalessandro@sed.sc.gov.br"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-400 focus:border-aulaorange-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <Key className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-400 focus:border-aulaorange-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-login"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-aulablue-800 py-3 text-xs font-bold text-white shadow-md hover:bg-aulablue-700 transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4 text-aulaorange-500" />
              <span>Autenticar com E-mail e Senha</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

