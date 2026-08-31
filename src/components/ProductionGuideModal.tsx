import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Palette, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Type, 
  Monitor, 
  Copy, 
  Check 
} from 'lucide-react';
import { ProductionAxis } from '../types';
import { PRODUCTION_AXES } from '../data/initialData';

interface ProductionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAxis: ProductionAxis | null;
  onSelectAxis: (axis: ProductionAxis | null) => void;
}

export const ProductionGuideModal: React.FC<ProductionGuideModalProps> = ({
  isOpen,
  onClose,
  selectedAxis,
  onSelectAxis,
}) => {
  const [activeTab, setActiveTab] = useState<'palette' | 'axes' | 'typography' | 'ui'>('palette');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!isOpen && !selectedAxis) return null;

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleClose = () => {
    onClose();
    onSelectAxis(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="fixed inset-0 bg-[#00071c]/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">
        
        {/* Header with gradient #000e33 to #00154e */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-gradient-to-r from-[#000e33] to-[#00154e] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-aulaorange-500 p-2 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                Guia de Design & Paleta de Cores — Videoaulas ENEM
              </h2>
              <p className="text-xs text-aulaorange-200">
                Especificação Técnica Visual, Códigos Hexadecimais & Padrões UI/UX
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg bg-white/10 p-1.5 text-slate-300 hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 bg-slate-50/80 px-6 pt-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('palette');
                onSelectAxis(null);
              }}
              className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'palette' && !selectedAxis
                  ? 'border-aulaorange-500 bg-white text-aulablue-800 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-aulablue-800'
              }`}
            >
              <Palette className="h-4 w-4 text-aulaorange-500" />
              <span>1. Paleta de Cores & Hex</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('axes');
                if (!selectedAxis) onSelectAxis(PRODUCTION_AXES[0]);
              }}
              className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'axes' || selectedAxis
                  ? 'border-aulaorange-500 bg-white text-aulablue-800 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-aulablue-800'
              }`}
            >
              <Layers className="h-4 w-4 text-aulaorange-500" />
              <span>2. 4 Eixos de Produção</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('typography');
                onSelectAxis(null);
              }}
              className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'typography' && !selectedAxis
                  ? 'border-aulaorange-500 bg-white text-aulablue-800 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-aulablue-800'
              }`}
            >
              <Type className="h-4 w-4 text-aulaorange-500" />
              <span>3. Tipografia & Hierarquia</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('ui');
                onSelectAxis(null);
              }}
              className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'ui' && !selectedAxis
                  ? 'border-aulaorange-500 bg-white text-aulablue-800 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-aulablue-800'
              }`}
            >
              <Monitor className="h-4 w-4 text-aulaorange-500" />
              <span>4. Efeitos UI/UX</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Palette */}
        {activeTab === 'palette' && !selectedAxis && (
          <div className="p-6 space-y-6">
            
            {/* Primary Colors */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-aulablue-800 mb-3 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-aulaorange-500" />
                Cores Primárias (Marca Oficial)
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Azul Institucional */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#00154e] shadow-md" />
                      <div>
                        <div className="text-sm font-black text-aulablue-800">Azul Institucional</div>
                        <div className="text-xs font-mono font-bold text-slate-500">aulablue-800</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard('#00154e')}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {copiedHex === '#00154e' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>#00154e</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Função:</strong> Cor estrutural de maior hierarquia. Títulos principais, botões primários e cabeçalhos. Transmite autoridade, segurança e rigor pedagógico.
                  </p>
                </div>

                {/* Laranja Energético */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#ed9524] shadow-md" />
                      <div>
                        <div className="text-sm font-black text-aulablue-800">Laranja Energético</div>
                        <div className="text-xs font-mono font-bold text-aulaorange-600">aulaorange-500</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard('#ed9524')}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {copiedHex === '#ed9524' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>#ed9524</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Função:</strong> Cor de contraste e dinamismo (Geração Z). Badges de atenção, bordas interativas no hover e CTAs. Transmite entusiasmo e criatividade.
                  </p>
                </div>
              </div>
            </div>

            {/* Shades Scale */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-aulablue-800 mb-3">
                Escala de Tons e Suporte
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Blue Scale */}
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="text-xs font-extrabold text-aulablue-800">Escala de Azuis (aulablue)</div>
                  {[
                    { shade: '50', hex: '#f2f5fd', desc: 'Fundo suave de cards e caixas de objetivo prático' },
                    { shade: '100', hex: '#e1e8fa', desc: 'Bordas sutis e fundo de ícones' },
                    { shade: '700', hex: '#0c2d82', desc: 'Texto de apoio e links' },
                    { shade: '800', hex: '#00154e', desc: 'Azul Principal' },
                    { shade: '900', hex: '#000e33', desc: 'Gradiente de fundo do cabeçalho' },
                    { shade: '950', hex: '#00071c', desc: 'Máscara escura do modal (overlay)' },
                  ].map((item) => (
                    <div key={item.shade} className="flex items-center justify-between rounded-xl bg-white p-2 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-md border border-black/10" style={{ backgroundColor: item.hex }} />
                        <span className="font-bold text-slate-800">{item.shade} ({item.hex})</span>
                      </div>
                      <span className="text-[11px] text-slate-500 max-w-[200px] truncate text-right">{item.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Orange Scale */}
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="text-xs font-extrabold text-aulablue-800">Escala de Laranjas (aulaorange)</div>
                  {[
                    { shade: '50', hex: '#fffaf2', desc: 'Fundo de caixas de exemplos práticos' },
                    { shade: '200', hex: '#ffe4be', desc: 'Bordas de destaque' },
                    { shade: '500', hex: '#ed9524', desc: 'Laranja Principal' },
                    { shade: '600', hex: '#db7a13', desc: 'Hover de botões e texto em destaque' },
                    { shade: '700', hex: '#b6590d', desc: 'Texto sobre fundo claro de aviso' },
                  ].map((item) => (
                    <div key={item.shade} className="flex items-center justify-between rounded-xl bg-white p-2 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-md border border-black/10" style={{ backgroundColor: item.hex }} />
                        <span className="font-bold text-slate-800">{item.shade} ({item.hex})</span>
                      </div>
                      <span className="text-[11px] text-slate-500 max-w-[200px] truncate text-right">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: 4 Production Axes */}
        {(activeTab === 'axes' || selectedAxis) && (
          <div className="p-6 space-y-6">
            
            {/* Axes Selector Bar */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRODUCTION_AXES.map((axis) => {
                const isCurrent = (selectedAxis?.id || PRODUCTION_AXES[0].id) === axis.id;
                return (
                  <button
                    key={axis.id}
                    type="button"
                    onClick={() => onSelectAxis(axis)}
                    className={`rounded-xl p-3 text-left transition-all border ${
                      isCurrent
                        ? 'border-aulaorange-500 bg-aulablue-800 text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-aulaorange-400">Eixo 0{axis.id}</span>
                    <div className="text-xs font-black truncate">{axis.title.split(': ')[1]}</div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Axis View */}
            {(() => {
              const current = selectedAxis || PRODUCTION_AXES[0];
              return (
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="rounded-md bg-aulaorange-500 px-2.5 py-0.5 text-xs font-extrabold text-white">
                        {current.focus}
                      </span>
                      <h3 className="mt-1 text-lg font-black text-aulablue-800">{current.title}</h3>
                      <p className="text-xs font-semibold text-aulaorange-600">{current.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-700">
                    {current.description}
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                    {current.specs.map((spec, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-xs font-black text-aulablue-800 mb-2">{spec.title}</div>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {spec.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Practical Example Box (#fffaf2) */}
                  <div className="rounded-xl border border-aulaorange-200 bg-[#fffaf2] p-4 text-xs">
                    <span className="font-extrabold text-aulaorange-700 uppercase tracking-wider block mb-1">
                      Exemplo Prático na Videoaula:
                    </span>
                    <p className="text-slate-700">{current.practicalExample}</p>
                  </div>

                  {/* Recommendation Box (#f2f5fd) */}
                  <div className="rounded-xl border border-aulablue-100 bg-[#f2f5fd] p-4 text-xs">
                    <span className="font-extrabold text-aulablue-800 uppercase tracking-wider block mb-1">
                      Recomendação da Equipe Pedagógica:
                    </span>
                    <p className="text-slate-700">{current.recommendation}</p>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* Tab 3: Typography */}
        {activeTab === 'typography' && !selectedAxis && (
          <div className="p-6 space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Título Principal (H1)</span>
                <div className="text-2xl sm:text-3xl font-black text-aulablue-800 mt-1">
                  Produção de <span className="text-aulaorange-500">Videoaulas ENEM</span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">font-black (900), 30px (3xl), #00154e + palavra-chave #ed9524</div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subtítulo de Eixos e Áreas (H2/H3)</span>
                <div className="text-lg font-extrabold text-aulablue-800 mt-1">
                  Linguagens, Códigos e suas Tecnologias
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">font-extrabold (800), text-lg / 2xl</div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Badges e Tags</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="rounded-md border border-aulaorange-200 bg-aulaorange-50 px-2.5 py-1 text-xs font-bold text-aulaorange-700">
                    Geração Z
                  </span>
                  <span className="rounded-md border border-aulablue-100 bg-aulablue-50 px-2.5 py-1 text-xs font-bold text-aulablue-800">
                    BNCC Oficial
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">font-bold (700), text-xs (12px), fundo colorido e bordas suaves</div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Corpo de Texto</span>
                <p className="text-sm font-normal leading-relaxed text-slate-600 mt-1">
                  O corpo de texto utiliza tamanho sm (14px) e entrelinha ampliada (leading-relaxed) para maximizar o conforto de leitura em telas desktop e mobile.
                </p>
                <div className="text-xs text-slate-500 font-mono mt-1">font-normal / font-medium, text-sm, leading-relaxed</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: UI/UX Effects */}
        {activeTab === 'ui' && !selectedAxis && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-black text-aulablue-800 mb-1">Efeito Blur de Fundo</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Esferas orgânicas com desfoque de 48px (blur-3xl) nas cores azul (#00154e) e laranja (#ed9524) suave localizadas atrás do container para dar profundidade estética.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-black text-aulablue-800 mb-1">Cabeçalho Fixo (Sticky Header)</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Permanece no topo com efeito de vidro fosco (backdrop-blur-md bg-white/95), garantindo acesso rápido à busca, níveis de acesso e ações.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-black text-aulablue-800 mb-1">Microinterações nos Cards</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Elevação do card ao passar o mouse (transform -translate-y-1.5), transição dinâmica de borda e ícones para Laranja (#ed9524).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-black text-aulablue-800 mb-1">Animação dos Modais</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Aparecimento suave com alteração de escala (scale-95 para scale-100), desfoque do fundo escurecido (backdrop-blur-sm) e máscara (#00071c).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl bg-aulablue-800 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-aulablue-700"
          >
            Concluir Leitura
          </button>
        </div>

      </div>
    </div>
  );
};
