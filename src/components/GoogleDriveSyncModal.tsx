import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  FolderOpen, 
  Database,
  ArrowRight,
  Users,
  ShieldCheck,
  Key,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Video
} from 'lucide-react';
import { VideoLesson, User, UserAccount } from '../types';
import { 
  exportVideosToCsv, 
  downloadCsvFile, 
  parseGoogleSheetCsv,
  parseUsersFromGoogleSheetCsv,
  exportUsersToCsv 
} from '../utils/helpers';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoLesson[];
  onUpdateVideos: (newVideos: VideoLesson[]) => void;
  userAccounts: UserAccount[];
  onUpdateUserAccounts: (newAccounts: UserAccount[]) => void;
  currentUser: User | null;
  initialTab?: 'videos' | 'users';
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  videos,
  onUpdateVideos,
  userAccounts,
  onUpdateUserAccounts,
  currentUser,
  initialTab = 'videos',
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'users'>(initialTab);
  const [sheetUrl, setSheetUrl] = useState('');
  const [usersSheetUrl, setUsersSheetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error' | 'idle'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedUserTemplate, setCopiedUserTemplate] = useState(false);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('merge');
  const [showPasswords, setShowPasswords] = useState(false);

  // Quick manual add user inside modal
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin';

  // Sample CSV template strings
  const templateCsv = `Título,Área BNCC,Disciplina,Professor,Link do Vídeo (YouTube/Drive),Link Materiais Drive (PDF/Slides),Duração (min),Sinopse,Objetivo Prático
Redação ENEM: Proposta de Intervenção Nota 1000,linguagens,Redação,Prof.ª Helena Viana,https://www.youtube.com/watch?v=dQw4w9WgXcQ,https://drive.google.com/drive/folders/enem-redacao,28,Estrutura dos 5 elementos da intervenção social,Dominar a Competência 5
Funções e Gráficos no ENEM,matematica,Álgebra,Prof. Carlos Eduardo,https://www.youtube.com/watch?v=kXYiU_JCYtU,https://drive.google.com/drive/folders/enem-matematica,34,Interpretação gráfica de funções de 1º e 2º grau,Desenvolver raciocínio algébrico ágil
Ecologia e Ciclos Biogeoquímicos,natureza,Biologia,Prof.ª Beatriz Alcantara,https://www.youtube.com/watch?v=ysz5S6PUM-U,https://drive.google.com/drive/folders/enem-natureza,42,Cadeias alimentares e impactos ambientais,Garantir acertos em questões ambientais
Brasil República e Cidadania,humanas,História,Prof. Rodrigo Mendes,https://www.youtube.com/watch?v=L_LUpnjgPso,https://drive.google.com/drive/folders/enem-humanas,39,Processos históricos da República brasileira,Interpretar fontes e charges do ENEM`;

  const templateUsersCsv = `Nome,email,senha,nivel,instituicao
Luiz Alessandro da Silva,luizalessandro@sed.sc.gov.br,A1b2C3,admin,Secretaria de Estado da Educação de SC (SED/SC)
Mariana Duarte,aluno@enem.com.br,aluno123,user,Vestibulando ENEM 2026`;

  // === VIDEOS CSV EXPORT & SYNC ===
  const handleExportCsv = () => {
    const csvContent = exportVideosToCsv(videos);
    downloadCsvFile(csvContent, `aulao_enem_catalogo_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(templateCsv);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleSyncFromSheetUrl = async () => {
    if (!sheetUrl.trim()) {
      setSyncStatus({
        type: 'error',
        message: 'Por favor, insira a URL da planilha Google publicada como CSV ou link do Google Sheets.',
      });
      return;
    }

    setIsLoading(true);
    setSyncStatus({ type: 'idle', message: '' });

    try {
      let fetchUrl = sheetUrl.trim();
      const docMatch = fetchUrl.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/i);
      if (docMatch && !fetchUrl.includes('output=csv') && !fetchUrl.includes('export?format=csv')) {
        const docId = docMatch[1];
        fetchUrl = `https://docs.google.com/spreadsheets/d/${docId}/export?format=csv`;
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`Erro ao acessar planilha (${response.status}). Certifique-se de que a planilha está pública ou "Publicada na Web" como CSV.`);
      }

      const csvData = await response.text();

      // Check if this CSV looks like a user sheet rather than video sheet
      const lower = csvData.toLowerCase();
      if ((lower.includes('email') || lower.includes('senha')) && !lower.includes('disciplina') && !lower.includes('bncc')) {
        // Auto parse as users
        const parsedUsers = parseUsersFromGoogleSheetCsv(csvData);
        if (parsedUsers.length > 0) {
          onUpdateUserAccounts(parsedUsers);
          setSyncStatus({
            type: 'success',
            message: `Detectada planilha de Usuários! ${parsedUsers.length} logins e senhas atualizados com sucesso no sistema.`,
          });
          setActiveTab('users');
          return;
        }
      }

      const parsedVideos = parseGoogleSheetCsv(csvData, currentUser?.name || 'Sincronização Google Sheets');
      if (parsedVideos.length === 0) {
        throw new Error('Nenhuma linha válida de videoaula encontrada no arquivo.');
      }

      if (importMode === 'replace') {
        onUpdateVideos(parsedVideos);
      } else {
        const existingMap = new Map(videos.map((v) => [v.title.toLowerCase(), v]));
        parsedVideos.forEach((v) => {
          existingMap.set(v.title.toLowerCase(), v);
        });
        onUpdateVideos(Array.from(existingMap.values()));
      }

      setSyncStatus({
        type: 'success',
        message: `Sucesso! ${parsedVideos.length} videoaulas sincronizadas diretamente da sua Planilha do Google Drive.`,
      });
    } catch (err: any) {
      setSyncStatus({
        type: 'error',
        message: err.message || 'Falha ao buscar dados da planilha. Verifique a URL e as permissões de compartilhamento.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = parseGoogleSheetCsv(text, currentUser?.name || 'Upload CSV');
        if (parsed.length === 0) {
          setSyncStatus({ type: 'error', message: 'Nenhuma videoaula válida encontrada no arquivo CSV.' });
          return;
        }

        if (importMode === 'replace') {
          onUpdateVideos(parsed);
        } else {
          const map = new Map(videos.map((v) => [v.title.toLowerCase(), v]));
          parsed.forEach((v) => map.set(v.title.toLowerCase(), v));
          onUpdateVideos(Array.from(map.values()));
        }

        setSyncStatus({
          type: 'success',
          message: `Arquivo importado com sucesso! ${parsed.length} videoaulas processadas.`,
        });
      } catch (err) {
        setSyncStatus({ type: 'error', message: 'Erro ao processar arquivo CSV.' });
      }
    };
    reader.readAsText(file);
  };

  // === USERS / LOGINS CSV EXPORT & SYNC ===
  const handleExportUsersCsv = () => {
    const csvContent = exportUsersToCsv(userAccounts);
    downloadCsvFile(csvContent, `aulao_enem_logins_usuarios_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleCopyUserTemplate = () => {
    navigator.clipboard.writeText(templateUsersCsv);
    setCopiedUserTemplate(true);
    setTimeout(() => setCopiedUserTemplate(false), 2500);
  };

  const handleSyncUsersFromSheetUrl = async () => {
    if (!usersSheetUrl.trim()) {
      setSyncStatus({
        type: 'error',
        message: 'Por favor, insira a URL da planilha Google com os logins (Nome, email, senha).',
      });
      return;
    }

    setIsLoading(true);
    setSyncStatus({ type: 'idle', message: '' });

    try {
      let fetchUrl = usersSheetUrl.trim();
      const docMatch = fetchUrl.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/i);
      if (docMatch && !fetchUrl.includes('output=csv') && !fetchUrl.includes('export?format=csv')) {
        const docId = docMatch[1];
        fetchUrl = `https://docs.google.com/spreadsheets/d/${docId}/export?format=csv`;
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`Erro ao acessar planilha (${response.status}). Certifique-se de que a planilha está com permissão de leitura pública ou publicada na Web como CSV.`);
      }

      const csvData = await response.text();
      const parsedUsers = parseUsersFromGoogleSheetCsv(csvData);

      if (parsedUsers.length === 0) {
        throw new Error('Nenhum login válido encontrado na planilha. Verifique se existem as colunas: Nome, email, senha.');
      }

      if (importMode === 'replace') {
        onUpdateUserAccounts(parsedUsers);
      } else {
        const existingMap = new Map(userAccounts.map((u) => [u.user.email.toLowerCase(), u]));
        parsedUsers.forEach((u) => {
          existingMap.set(u.user.email.toLowerCase(), u);
        });
        onUpdateUserAccounts(Array.from(existingMap.values()));
      }

      setSyncStatus({
        type: 'success',
        message: `Sucesso! ${parsedUsers.length} logins e senhas atualizados diretamente da sua Planilha do Google Drive.`,
      });
    } catch (err: any) {
      setSyncStatus({
        type: 'error',
        message: err.message || 'Falha ao sincronizar logins. Verifique a URL e as permissões de acesso.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsersFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = parseUsersFromGoogleSheetCsv(text);
        if (parsed.length === 0) {
          setSyncStatus({ type: 'error', message: 'Nenhum usuário/login válido encontrado no CSV.' });
          return;
        }

        if (importMode === 'replace') {
          onUpdateUserAccounts(parsed);
        } else {
          const map = new Map(userAccounts.map((u) => [u.user.email.toLowerCase(), u]));
          parsed.forEach((u) => map.set(u.user.email.toLowerCase(), u));
          onUpdateUserAccounts(Array.from(map.values()));
        }

        setSyncStatus({
          type: 'success',
          message: `Arquivo de logins processado! ${parsed.length} contas de acesso cadastradas/atualizadas.`,
        });
      } catch (err) {
        setSyncStatus({ type: 'error', message: 'Erro ao processar arquivo de logins.' });
      }
    };
    reader.readAsText(file);
  };

  const handleAddSingleUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim() || !newUserName.trim()) return;

    const newAccount: UserAccount = {
      user: {
        name: newUserName.trim(),
        email: newUserEmail.trim().toLowerCase(),
        role: newUserRole,
        institution: 'Secretaria de Estado da Educação (SED/SC)',
      },
      passwordHash: newUserPass.trim() || '123456',
    };

    const exists = userAccounts.some((u) => u.user.email.toLowerCase() === newAccount.user.email);
    if (exists) {
      onUpdateUserAccounts(userAccounts.map((u) => u.user.email.toLowerCase() === newAccount.user.email ? newAccount : u));
      setSyncStatus({ type: 'success', message: `Conta ${newAccount.user.email} atualizada com sucesso!` });
    } else {
      onUpdateUserAccounts([...userAccounts, newAccount]);
      setSyncStatus({ type: 'success', message: `Novo usuário ${newAccount.user.name} adicionado!` });
    }

    setNewUserName('');
    setNewUserEmail('');
    setNewUserPass('');
  };

  const handleDeleteUser = (email: string) => {
    if (userAccounts.length <= 1) {
      alert('Não é possível remover todos os usuários. O sistema precisa de pelo menos uma conta de administrador.');
      return;
    }
    onUpdateUserAccounts(userAccounts.filter((u) => u.user.email.toLowerCase() !== email.toLowerCase()));
    setSyncStatus({ type: 'success', message: `Usuário ${email} removido do catálogo de logins.` });
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

      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-white/20 p-2 text-white">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Servidor em Nuvem: Google Drive & Planilhas
              </h2>
              <p className="text-xs text-emerald-200">
                Sincronização em tempo real de Videoaulas e Logins / Senhas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/10 p-1.5 text-emerald-100 hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 pt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('videos');
              setSyncStatus({ type: 'idle', message: '' });
            }}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'videos'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video className="h-4 w-4 text-aulaorange-500" />
            <span>1. Grade de Videoaulas ({videos.length})</span>
          </button>

          <button
            type="button"
            id="tab-sync-users"
            onClick={() => {
              setActiveTab('users');
              setSyncStatus({ type: 'idle', message: '' });
            }}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="h-4 w-4 text-emerald-600" />
            <span>2. Logins & Usuários da Planilha ({userAccounts.length})</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">

          {/* Status feedback */}
          {syncStatus.message && (
            <div
              className={`flex items-start gap-2.5 rounded-xl p-3.5 text-xs font-bold ${
                syncStatus.type === 'success'
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border border-red-200 bg-red-50 text-red-800'
              }`}
            >
              {syncStatus.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              )}
              <span className="leading-relaxed">{syncStatus.message}</span>
            </div>
          )}

          {/* TAB 1: VIDEOS SYNC */}
          {activeTab === 'videos' && (
            <>
              {/* Intro explanation banner */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-900 mb-1">
                  <Database className="h-4 w-4 text-emerald-700" />
                  <span>Como funciona a sincronização do catálogo</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  O site utiliza planilhas do Google Drive como base de dados. Os administradores podem alimentar títulos, links de vídeos (YouTube ou Drive), materiais complementares em PDF e áreas BNCC diretamente na planilha, permitindo atualização instantânea sem necessidade de novo deploy.
                </p>
              </div>

              {/* Admin Live Sync Section */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-extrabold text-aulablue-800 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-aulaorange-500" />
                    <span>Sincronizar Videoaulas via URL da Planilha Google</span>
                  </h3>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Automático
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-3">
                  Insira o link da sua planilha do Google de videoaulas (com permissão de leitura pública ou publicada na web em <em>Arquivo &gt; Compartilhar &gt; Publicar na Web &gt; CSV</em>):
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/SEU_ID/edit..."
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                  />

                  <button
                    type="button"
                    id="btn-sync-google-sheets"
                    onClick={handleSyncFromSheetUrl}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isLoading ? 'Sincronizando...' : 'Sincronizar Aulas'}</span>
                  </button>
                </div>

                {/* Import Mode: Replace vs Merge */}
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <span className="font-semibold text-slate-500">Modo:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="text-emerald-600"
                    />
                    <span className="text-slate-700">Mesclar com existentes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-emerald-600"
                    />
                    <span className="text-slate-700">Substituir catálogo</span>
                  </label>
                </div>
              </div>

              {/* Export & Local File Operations */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                
                {/* Export current state */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-aulablue-800 mb-1">
                      <Download className="h-4 w-4 text-aulablue-800" />
                      <span>Exportar Dados (.CSV)</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Baixe o catálogo formatado com as {videos.length} videoaulas para abrir no Excel ou Google Sheets.
                    </p>
                  </div>

                  <button
                    type="button"
                    id="btn-export-csv"
                    onClick={handleExportCsv}
                    className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-aulablue-100 bg-white px-3.5 py-2 text-xs font-bold text-aulablue-800 shadow-xs hover:border-aulaorange-500 hover:text-aulaorange-600"
                  >
                    <Download className="h-3.5 w-3.5 text-aulaorange-500" />
                    <span>Baixar Planilha de Aulas CSV</span>
                  </button>
                </div>

                {/* Import from local file */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-aulablue-800 mb-1">
                      <Upload className="h-4 w-4 text-emerald-700" />
                      <span>Importar Arquivo CSV</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Carregue um arquivo .CSV exportado do seu Google Drive para carregar a base de videoaulas.
                    </p>
                  </div>

                  <label className="mt-3 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:border-emerald-600 hover:text-emerald-700">
                    <Upload className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Selecionar CSV de Aulas</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

              </div>

              {/* Template & Instructions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-aulablue-800">
                    Estrutura de Colunas para Videoaulas
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className="inline-flex items-center gap-1 text-xs font-bold text-aulaorange-600 hover:text-aulaorange-700"
                  >
                    {copiedTemplate ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedTemplate ? 'Copiado!' : 'Copiar Modelo'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-mono text-[11px] text-slate-700">
                  <code>Título, Área BNCC, Disciplina, Professor, Link do Vídeo, Link Materiais Drive, Duração, Sinopse, Objetivo Prático</code>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: USERS & LOGINS SYNC */}
          {activeTab === 'users' && (
            <>
              {/* Intro banner */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-aulablue-800 mb-1">
                  <ShieldCheck className="h-4 w-4 text-aulaorange-500" />
                  <span>Atualização Dinâmica de Logins e Senhas pela Planilha</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  Quando você altera a planilha de usuários no Google Drive (adicionando, alterando nomes, e-mails ou senhas), basta clicar em <strong>Sincronizar Logins da Planilha</strong> ou carregar o arquivo CSV. O sistema atualiza imediatamente as credenciais permitidas para autenticação.
                </p>
              </div>

              {/* URL Sync Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-extrabold text-aulablue-800 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-aulaorange-500" />
                    <span>Sincronizar Logins via URL da Planilha Google</span>
                  </h3>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Tempo Real
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-3">
                  Insira o link da planilha Google com os logins (colunas: <code>Nome, email, senha</code>):
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    id="input-users-sheet-url"
                    value={usersSheetUrl}
                    onChange={(e) => setUsersSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/SEU_ID/edit..."
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                  />

                  <button
                    type="button"
                    id="btn-sync-users-sheet"
                    onClick={handleSyncUsersFromSheetUrl}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-aulablue-800 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-aulablue-700 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isLoading ? 'Sincronizando...' : 'Sincronizar Logins'}</span>
                  </button>
                </div>
              </div>

              {/* Import / Export Users */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-aulablue-800 mb-1">
                      <Download className="h-4 w-4 text-aulablue-800" />
                      <span>Exportar Logins (.CSV)</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Baixe o arquivo com as {userAccounts.length} contas cadastradas com Nome, E-mail, Senha e Nível de Acesso.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportUsersCsv}
                    className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-aulablue-100 bg-white px-3.5 py-2 text-xs font-bold text-aulablue-800 shadow-xs hover:border-aulaorange-500 hover:text-aulaorange-600"
                  >
                    <Download className="h-3.5 w-3.5 text-aulaorange-500" />
                    <span>Baixar Planilha de Logins</span>
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-aulablue-800 mb-1">
                      <Upload className="h-4 w-4 text-emerald-700" />
                      <span>Importar CSV de Logins</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Envie um arquivo CSV com as colunas <code>Nome,email,senha</code> para atualizar todos os logins de uma vez.
                    </p>
                  </div>

                  <label className="mt-3 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:border-emerald-600 hover:text-emerald-700">
                    <Upload className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Selecionar CSV de Logins</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleUsersFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Template for Users */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-aulablue-800">
                    Estrutura da Planilha de Logins
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUserTemplate}
                    className="inline-flex items-center gap-1 text-xs font-bold text-aulaorange-600 hover:text-aulaorange-700"
                  >
                    {copiedUserTemplate ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedUserTemplate ? 'Copiado!' : 'Copiar Modelo de Logins'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-mono text-[11px] text-slate-700">
                  <code>Nome,email,senha</code>
                  <div className="text-slate-500 mt-1">
                    Exemplo: <code>Luiz Alessandro da Silva,luizalessandro@sed.sc.gov.br,A1b2C3</code>
                  </div>
                </div>
              </div>

              {/* Live Users Table */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-aulablue-800 uppercase tracking-wider">
                      Logins Autorizados Carregados ({userAccounts.length})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Usuários ativos que podem realizar login no sistema
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                  >
                    {showPasswords ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span>{showPasswords ? 'Ocultar Senhas' : 'Ver Senhas'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="px-3 py-2">Nome</th>
                        <th className="px-3 py-2">E-mail</th>
                        <th className="px-3 py-2">Senha</th>
                        <th className="px-3 py-2">Nível</th>
                        <th className="px-3 py-2 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {userAccounts.map((acc, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2.5 font-bold text-slate-800">
                            {acc.user.name}
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 font-mono text-[11px]">
                            {acc.user.email}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[11px] text-slate-700">
                            {showPasswords ? (
                              <span className="bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200 font-bold">{acc.passwordHash}</span>
                            ) : (
                              '••••••••'
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                              acc.user.role === 'admin' 
                                ? 'bg-aulaorange-100 text-aulaorange-800 border border-aulaorange-200' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {acc.user.role === 'admin' ? 'Administrador' : 'Estudante'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(acc.user.email)}
                              className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                              title="Remover login"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Quick Add Form */}
                <form onSubmit={handleAddSingleUser} className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Nome completo"
                    className="flex-1 min-w-[120px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white"
                  />
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="email@dominio.com"
                    className="flex-1 min-w-[140px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white"
                  />
                  <input
                    type="text"
                    value={newUserPass}
                    onChange={(e) => setNewUserPass(e.target.value)}
                    placeholder="Senha"
                    className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white"
                  />
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'user')}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-bold text-slate-700"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">Aluno</option>
                  </select>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Adicionar</span>
                  </button>
                </form>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3">
          <div className="text-[11px] text-slate-500">
            * Conectado ao Google Drive com persistência automática
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-aulablue-800 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-aulablue-700"
          >
            Concluir & Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

