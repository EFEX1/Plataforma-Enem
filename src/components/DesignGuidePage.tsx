import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Monitor, 
  Mic, 
  ClipboardList, 
  X, 
  Sparkles, 
  Zap, 
  BookOpen, 
  Video, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AxisDetail {
  numero: string;
  id: number;
  titulo: string;
  objetivo: string;
  diretrizes: {
    sub: string;
    desc: string;
  }[];
  exemplo: {
    cenario: string;
    conteudo: string | React.ReactNode;
  };
}

const DADOS_EIXOS: Record<number, AxisDetail> = {
  1: {
    id: 1,
    numero: "EIXO 01",
    titulo: "Linguagem e Engajamento (Como Falar)",
    objetivo: "Capacitar o professor a reter a atenção da Geração Z nos primeiros segundos de vídeo utilizando técnicas de storytelling, tom de voz dinâmico e analogias práticas alinhadas à matriz do ENEM.",
    diretrizes: [
      {
        sub: "Hook de Abertura (Primeiros 30 Segundos)",
        desc: "Elimine saudações genéricas como 'Olá, alunos, tudo bem?'. Comece direto com um problema real ou uma pergunta instigante ligada ao cotidiano para gerar curiosidade imediata antes de apresentar o tema acadêmico."
      },
      {
        sub: "Tom de Voz Conversacional e Analogias Modernas",
        desc: "Adote uma postura empática, fluida e informal, sem perder o rigor científico. Substitua jargões excessivos por analogias cotidianas ou referências pop que facilitem a assimilação de conceitos abstratos."
      },
      {
        sub: "Pontuação de Ritmo e Mudança de Estado",
        desc: "Varie a entonação a cada 45 segundos para quebrar a monotonia auditiva. Use pausas dramáticas para enfatizar conteúdos recorrentes na prova e altere o ritmo de fala ao transitar entre a teoria e a resolução de exercícios."
      }
    ],
    exemplo: {
      cenario: "Abertura de aula de Física (Termodinâmica)",
      conteudo: "“Você já parou para pensar por que a sua garrafa de água 'sua' por fora quando você a tira da geladeira em um dia quente de verão? Não é vazamento. Esse fenômeno simples cai todo ano no ENEM com o nome de Condensação e explica desde a formação de nuvens até o funcionamento do ar-condicionado. Nos próximos 10 minutos, você vai aprender a acertar qualquer questão desse tema sem memorizar fórmula nenhuma.”"
    }
  },
  2: {
    id: 2,
    numero: "EIXO 02",
    titulo: "Formato do Vídeo (A Estrutura)",
    objetivo: "Estruturar a arquitetura técnica da videoaula com enquadramentos adequados, duração otimizada e cortes dinâmicos que combatam a fadiga cognitiva do vestibulando.",
    diretrizes: [
      {
        sub: "Duração e Microlearning (Blocos de 10 a 15 Minutos)",
        desc: "Divida tópicos extensos em módulos curtos focados em uma única habilidade da matriz do ENEM. Vídeos longos de 50 minutos reduzem dramaticamente a retenção; opte por sequências de pílulas teóricas seguidas de aplicação prática."
      },
      {
        sub: "Especificações de Enquadramento e Proporção",
        desc: "Grave em formato horizontal 16:9 (resolução mínima 1080p a 30fps) para aulas completas no YouTube. Para trechos curtos de revisão (dicas rápidas de Reels/TikTok), utilize o formato vertical 9:16 com enquadramento fechado do peito para cima."
      },
      {
        sub: "Ritmo de Corte e Edição Dinâmica",
        desc: "Aplique o recurso de jump cut (cortar pequenos respiros e pausas na edição) para manter o ritmo acelerado. Insira elementos visuais na tela (como grifos, palavras-chave e esquemas) a cada 15 a 30 segundos para manter o aluno focado visualmente."
      }
    ],
    exemplo: {
      cenario: "Estrutura de bloco para aula de Biologia (Ecologia)",
      conteudo: (
        <div className="space-y-1.5 text-xs sm:text-sm">
          <p>• <strong className="text-aulablue-900 font-bold">Minutos 00:00 - 00:30:</strong> Hook prático com problema ambiental atual.</p>
          <p>• <strong className="text-aulablue-900 font-bold">Minutos 00:30 - 04:00:</strong> Teoria enxuta (Conceito de Relações Ecológicas) com texto de apoio surgindo na tela lateral.</p>
          <p>• <strong className="text-aulablue-900 font-bold">Minutos 04:00 - 08:00:</strong> Exemplo prático de uma questão real do ENEM sem enrolação.</p>
          <p>• <strong className="text-aulablue-900 font-bold">Minutos 08:00 - 10:00:</strong> Recapitulando os 3 pontos mais cobrados (Call to Action para o próximo bloco do curso).</p>
        </div>
      )
    }
  },
  3: {
    id: 3,
    numero: "EIXO 03",
    titulo: "Materiais e Equipamentos (O Que Usar)",
    objetivo: "Guiar o professor na montagem de um kit de gravação funcional e acessível, priorizando a nitidez do áudio e da imagem sem necessidade de altos investimentos.",
    diretrizes: [
      {
        sub: "Opção A - Gravação Móvel (Smartphone)",
        desc: "Utilize a câmera traseira do celular configurada manualmente para 1080p a 30fps ou 60fps (evite a câmera frontal devido à menor resolução). Posicione a câmera na altura dos olhos usando um tripé simples de mesa."
      },
      {
        sub: "Opção B - Estúdio Semiprofissional Básico",
        desc: "Utilize uma webcam HD (mínimo 1080p) ou câmera DSLR acoplada a um computador. Combine com uma luminária tipo Softbox posicionada a 45 graus do rosto para eliminar sombras duras no fundo do cenário."
      },
      {
        sub: "Captação de Áudio e Softwares Acessíveis",
        desc: "O áudio representa 60% da qualidade percebida pelo aluno; utilize obrigatoriamente um microfone de lapela com conexão P2/P3 ou USB ligado ao smartphone/PC. Para gravação de tela e câmera simultâneas, utilize softwares gratuitos como o OBS Studio ou o OBS Lite."
      }
    ],
    exemplo: {
      cenario: "Checklist de configuração do Kit Portátil (Opção A)",
      conteudo: (
        <div className="space-y-2 text-xs sm:text-sm">
          <p>1. <strong className="text-aulablue-900 font-bold">Smartphone:</strong> Câmera traseira limpa com pano de microfibra, modo avião ativado e fixado no tripé.</p>
          <p>2. <strong className="text-aulablue-900 font-bold">Áudio:</strong> Microfone de lapela preso à gola da camisa (a 15 cm da boca) gravando pelo aplicativo nativo de voz.</p>
          <p>3. <strong className="text-aulablue-900 font-bold">Iluminação:</strong> Ring light posicionado logo atrás do celular, apontado diretamente para o rosto, combinado com a luz natural de uma janela lateral.</p>
        </div>
      )
    }
  },
  4: {
    id: 4,
    numero: "EIXO 04",
    titulo: "Passo a Passo da Gravação (Como Executar)",
    objetivo: "Fornecer um roteiro cronológico claro para que o professor organize sua rotina desde o planejamento do texto até a finalização do material bruto.",
    diretrizes: [
      {
        sub: "Fase 1: Pré-Gravação (Roteirização em Duas Colunas)",
        desc: "Crie um roteiro prático dividindo a página em duas colunas: 'O que eu falo' (texto do professor) e 'O que o aluno vê' (imagens, fórmulas, tópicos na tela). Treine a leitura rápida do roteiro antes de ligar a câmera para garantir fluidez."
      },
      {
        sub: "Fase 2: Durante a Gravação (Linguagem Corporal e Cenário Neutralizado)",
        desc: "Mantenha o olhar fixo na lente da câmera (e não no visor). Grave em um fundo neutro e limpo, sem elementos de distração. É expressamente proibido o uso de logotipos institucionais, marcas de universidades ou símbolos governamentais no cenário ou nos slides de apoio."
      },
      {
        sub: "Fase 3: Pós-Gravação (Revisão e Exportação)",
        desc: "Faça uma revisão do vídeo focado na clareza da mensagem. Elimine erros de fala longos e exporte o arquivo final no formato MP4 (codec H.264), mantendo a proporção de tela escolhida sem barras pretas laterais."
      }
    ],
    exemplo: {
      cenario: "Roteiro em Duas Colunas para aula de Química (Funções Orgânicas)",
      conteudo: (
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <thead className="bg-aulablue-800 text-white font-bold">
              <tr>
                <th className="p-2.5 text-left w-1/2">O que o aluno vê (Visual)</th>
                <th className="p-2.5 text-left w-1/2">O que eu falo (Áudio)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr className="hover:bg-slate-50 transition">
                <td className="p-2.5 text-slate-600 font-medium">Imagem de uma garrafa de perfume + Fórmula do Álcool</td>
                <td className="p-2.5 text-slate-800">“O álcool que está no seu perfume é a mesma função orgânica que cai na prova de Química do ENEM.”</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-2.5 text-slate-600 font-medium">Destaque na hidroxila (<span className="text-aulaorange-600 font-bold">-OH</span>) piscando em destaque</td>
                <td className="p-2.5 text-slate-800">“Repare bem nessa estrutura: a presença do grupo hidroxila ligado a um carbono saturado é o que define o Álcool.”</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-2.5 text-slate-600 font-medium">Texto: &apos;Atenção: Não confunda com Fenol!&apos;</td>
                <td className="p-2.5 text-slate-800">“Cuidado! Se essa hidroxila estiver ligada direto no anel aromático, vira Fenol. Não caia nessa pegadinha!”</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
  }
};

interface DesignGuidePageProps {
  onBackToCatalog: () => void;
}

export const DesignGuidePage: React.FC<DesignGuidePageProps> = ({ onBackToCatalog }) => {
  const [selectedAxisId, setSelectedAxisId] = useState<number | null>(null);

  // Close modal with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedAxisId !== null) {
        setSelectedAxisId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAxisId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedAxisId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedAxisId]);

  const activeAxis = selectedAxisId ? DADOS_EIXOS[selectedAxisId] : null;

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-sans antialiased selection:bg-aulaorange-500 selection:text-white">
      
      {/* Cabeçalho Principal com Identidade Visual */}
      <header className="w-full bg-white border-b-2 border-slate-100 py-4 sm:py-5 px-4 sm:px-8 sticky top-0 z-20 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logotipo e Título */}
          <div className="flex items-center gap-4 text-center md:text-left flex-col sm:flex-row">
            <button 
              type="button"
              onClick={onBackToCatalog}
              className="p-1 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition group"
              title="Voltar ao Catálogo de Videoaulas"
            >
              <img 
                src="https://i.ibb.co/gFmSJ5gT/logo-aul-o-enem.jpg" 
                alt="Logo Aulão ENEM" 
                className="h-16 sm:h-20 w-auto object-contain rounded-xl transition-transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-aulaorange-100 text-aulaorange-700 text-xs font-bold mb-1.5 border border-aulaorange-200">
                <span className="w-2 h-2 rounded-full bg-aulaorange-500 animate-pulse"></span>
                Metodologia de Gravação de Aulas
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-aulablue-800 tracking-tight leading-tight">
                Produção de Videoaulas para <span className="text-aulaorange-500">Aulões ENEM</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Guia Prático e Interativo de Direção e Design Instrucional</p>
            </div>
          </div>

          {/* Action buttons & Badge */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="btn-voltar-ao-catalogo-top"
              onClick={onBackToCatalog}
              className="inline-flex items-center gap-2 rounded-xl border border-aulablue-200 bg-aulablue-50 px-4 py-2.5 text-xs font-bold text-aulablue-900 shadow-xs transition-all hover:bg-aulablue-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Catálogo de Videoaulas</span>
            </button>

            {/* Badge Informativa */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-aulablue-800 bg-aulablue-50 p-3 rounded-2xl border border-aulablue-100 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-aulablue-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Zap className="w-4 h-4 text-aulaorange-400" />
              </div>
              <div>
                <strong className="block text-aulablue-900 font-bold">Foco Geração Z</strong>
                <span className="text-slate-600">Alta retenção e dinamismo visual</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Área Principal / Fluxograma Interativo */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 relative overflow-hidden">
          
          {/* Detalhes de Fundo com as Novas Cores */}
          <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-aulaorange-100/50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-72 h-72 bg-aulablue-100/50 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="text-center mb-8 sm:mb-12">
              <span className="px-3 py-1 rounded-full text-xs uppercase tracking-widest bg-aulablue-50 text-aulablue-800 font-extrabold border border-aulablue-100">
                Fluxo Estratégico Linear
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-aulablue-800 mt-2">
                Os 4 Eixos da Videoaula Perfeita
              </h2>
              <p className="text-slate-500 text-sm max-w-lg mx-auto mt-1">
                Clique em qualquer bloco abaixo para desbloquear o manual prático e os roteiros de exemplo.
              </p>
            </div>

            {/* Grid dos 4 Eixos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 relative">
              
              {/* Linha Conectora de Fluxo (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-12 right-12 h-1 bg-gradient-to-r from-aulablue-800 via-aulaorange-500 to-aulablue-800 -translate-y-8 z-0 opacity-30 rounded-full"></div>

              {/* CARD 1: Linguagem e Engajamento */}
              <button 
                type="button"
                id="btn-eixo-1"
                onClick={() => setSelectedAxisId(1)} 
                className="group relative z-10 text-left bg-white hover:bg-slate-50/80 p-6 rounded-2xl border-2 border-slate-200 hover:border-aulaorange-500 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center text-center cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-aulaorange-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-aulablue-50 text-aulablue-800 group-hover:bg-aulablue-800 group-hover:text-white flex items-center justify-center transition-all duration-300 mb-4 shadow-xs border border-aulablue-100 group-hover:border-transparent">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <span className="text-xs font-black text-aulaorange-600 uppercase tracking-wider mb-1">Eixo 01</span>
                <h3 className="font-bold text-aulablue-800 group-hover:text-aulaorange-600 text-lg transition-colors">Linguagem e Engajamento</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">Storytelling, hook de 30s e conexão imediata com o cotidiano.</p>
                <div className="mt-4 inline-flex items-center text-xs font-bold text-aulaorange-600 group-hover:translate-x-1 transition-transform">
                  Acessar Diretrizes &rarr;
                </div>
              </button>

              {/* CARD 2: Formato do Vídeo */}
              <button 
                type="button"
                id="btn-eixo-2"
                onClick={() => setSelectedAxisId(2)} 
                className="group relative z-10 text-left bg-white hover:bg-slate-50/80 p-6 rounded-2xl border-2 border-slate-200 hover:border-aulaorange-500 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center text-center cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-aulaorange-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-aulablue-50 text-aulablue-800 group-hover:bg-aulablue-800 group-hover:text-white flex items-center justify-center transition-all duration-300 mb-4 shadow-xs border border-aulablue-100 group-hover:border-transparent">
                  <Monitor className="w-8 h-8" />
                </div>
                <span className="text-xs font-black text-aulaorange-600 uppercase tracking-wider mb-1">Eixo 02</span>
                <h3 className="font-bold text-aulablue-800 group-hover:text-aulaorange-600 text-lg transition-colors">Formato do Vídeo</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">Proporção 16:9, ritmo de corte e microlearning (10 a 15 min).</p>
                <div className="mt-4 inline-flex items-center text-xs font-bold text-aulaorange-600 group-hover:translate-x-1 transition-transform">
                  Acessar Diretrizes &rarr;
                </div>
              </button>

              {/* CARD 3: Materiais e Equipamentos */}
              <button 
                type="button"
                id="btn-eixo-3"
                onClick={() => setSelectedAxisId(3)} 
                className="group relative z-10 text-left bg-white hover:bg-slate-50/80 p-6 rounded-2xl border-2 border-slate-200 hover:border-aulaorange-500 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center text-center cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-aulaorange-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-aulablue-50 text-aulablue-800 group-hover:bg-aulablue-800 group-hover:text-white flex items-center justify-center transition-all duration-300 mb-4 shadow-xs border border-aulablue-100 group-hover:border-transparent">
                  <Mic className="w-8 h-8" />
                </div>
                <span className="text-xs font-black text-aulaorange-600 uppercase tracking-wider mb-1">Eixo 03</span>
                <h3 className="font-bold text-aulablue-800 group-hover:text-aulaorange-600 text-lg transition-colors">Materiais e Equipamentos</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">Kits de smartphone e estúdio, foco em áudio e softwares livres.</p>
                <div className="mt-4 inline-flex items-center text-xs font-bold text-aulaorange-600 group-hover:translate-x-1 transition-transform">
                  Acessar Diretrizes &rarr;
                </div>
              </button>

              {/* CARD 4: Passo a Passo da Gravação */}
              <button 
                type="button"
                id="btn-eixo-4"
                onClick={() => setSelectedAxisId(4)} 
                className="group relative z-10 text-left bg-white hover:bg-slate-50/80 p-6 rounded-2xl border-2 border-slate-200 hover:border-aulaorange-500 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center text-center cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-aulaorange-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-aulablue-50 text-aulablue-800 group-hover:bg-aulablue-800 group-hover:text-white flex items-center justify-center transition-all duration-300 mb-4 shadow-xs border border-aulablue-100 group-hover:border-transparent">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <span className="text-xs font-black text-aulaorange-600 uppercase tracking-wider mb-1">Eixo 04</span>
                <h3 className="font-bold text-aulablue-800 group-hover:text-aulaorange-600 text-lg transition-colors">Passo a Passo da Gravação</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">Roteiro em duas colunas, postura de estúdio e exportação MP4.</p>
                <div className="mt-4 inline-flex items-center text-xs font-bold text-aulaorange-600 group-hover:translate-x-1 transition-transform">
                  Acessar Diretrizes &rarr;
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* Rodapé Oficial */}
      </main>

      <footer className="mt-8 py-4 text-center text-sm text-white bg-aulablue-800">
        <p>© 2025 Luiz Alessandro Tecnologia Educacional. Todos os direitos reservados.</p>
        <p>Desenvolvido por Luiz Alessandro da Silva.</p>
      </footer>

      {/* Modal / Janela Popup Interativa */}
      {activeAxis && (
        <div 
          id="modalOverlay" 
          className="fixed inset-0 bg-aulablue-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 transition-opacity duration-200" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedAxisId(null);
            }
          }}
        >
          <div 
            id="modalContent" 
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden transform scale-100 transition-transform duration-200"
          >
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-aulablue-800 to-aulablue-900 text-white">
              <div className="flex items-center gap-3">
                <span id="modalBadge" className="px-2.5 py-0.5 rounded-full text-xs font-black bg-aulaorange-500 text-white shadow-xs">
                  {activeAxis.numero}
                </span>
                <h3 id="modalTitulo" className="text-base sm:text-lg font-bold text-white">
                  {activeAxis.titulo}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedAxisId(null)} 
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition" 
                aria-label="Fechar Janela"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Conteúdo Rolável) */}
            <div id="modalBody" className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
              
              {/* Objetivo Prático */}
              <div className="bg-aulablue-50 border-l-4 border-aulablue-800 p-4 rounded-r-xl">
                <h4 className="text-xs font-black text-aulablue-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-aulaorange-500" />
                  Objetivo Prático do Bloco
                </h4>
                <p className="text-aulablue-950 font-semibold text-xs sm:text-sm leading-relaxed">
                  {activeAxis.objetivo}
                </p>
              </div>

              {/* Diretrizes Técnicas */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                  Diretrizes e Recomendações Técnicas
                </h4>
                <ul className="space-y-2.5">
                  {activeAxis.diretrizes.map((item, idx) => (
                    <li key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 hover:border-aulaorange-300 transition">
                      <strong className="text-aulablue-800 block mb-1 font-bold text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-aulaorange-500 inline-block"></span>
                        {item.sub}
                      </strong>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exemplo Prático */}
              <div className="bg-aulaorange-50/70 border border-aulaorange-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-aulaorange-800 text-xs font-black uppercase tracking-wider mb-2">
                  <Zap className="w-4 h-4 text-aulaorange-600" />
                  Exemplo Prático (&quot;Como Fazer&quot;): {activeAxis.exemplo.cenario}
                </div>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-white p-3.5 rounded-xl border border-aulaorange-100 shadow-xs">
                  {activeAxis.exemplo.conteudo}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
              <span className="font-medium text-aulablue-800">Aulões ENEM • Diretrizes Docentes</span>
              <button 
                type="button"
                onClick={() => setSelectedAxisId(null)} 
                className="px-5 py-2 bg-aulablue-800 hover:bg-aulaorange-500 text-white rounded-xl font-bold transition-all shadow-xs"
              >
                Entendido, Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
