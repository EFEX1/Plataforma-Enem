import React from 'react';
import { 
  BookOpen, 
  Camera, 
  Sparkles, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { ProductionAxis } from '../types';
import { PRODUCTION_AXES } from '../data/initialData';

interface ProductionGuideSectionProps {
  onSelectAxis: (axis: ProductionAxis) => void;
  onOpenFullGuide: () => void;
}

export const ProductionGuideSection: React.FC<ProductionGuideSectionProps> = ({
  onSelectAxis,
  onOpenFullGuide,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="h-6 w-6 transition-colors group-hover:text-aulaorange-500" />;
      case 'Camera':
        return <Camera className="h-6 w-6 transition-colors group-hover:text-aulaorange-500" />;
      case 'Sparkles':
        return <Sparkles className="h-6 w-6 transition-colors group-hover:text-aulaorange-500" />;
      case 'Share2':
        return <Share2 className="h-6 w-6 transition-colors group-hover:text-aulaorange-500" />;
      default:
        return <BookOpen className="h-6 w-6 transition-colors group-hover:text-aulaorange-500" />;
    }
  };

  return (
    <section id="guia-producao-eixos" className="relative mb-12">
      {/* Section Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-aulablue-100 bg-aulablue-50 px-3 py-1 text-xs font-bold text-aulablue-800">
            <span className="h-2 w-2 rounded-full bg-aulaorange-500 animate-pulse" />
            Metodologia & Produção Audiovisual
          </div>
          <h2 className="text-2xl font-black text-aulablue-800 sm:text-3xl">
            4 Eixos de Produção de <span className="text-aulaorange-500">Videoaulas ENEM</span>
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
            Fluxo linear estruturado para professores e editores, combinando rigor acadêmico com o dinamismo visual da Geração Z.
          </p>
        </div>

        <button
          type="button"
          id="btn-ver-especificacoes-completas"
          onClick={onOpenFullGuide}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-aulablue-100 bg-white px-3.5 py-2 text-xs font-bold text-aulablue-800 shadow-xs transition-all hover:border-aulaorange-500 hover:text-aulaorange-600 hover:-translate-y-0.5 md:self-auto"
        >
          <span>Ver Especificações Técnicas</span>
          <ExternalLink className="h-3.5 w-3.5 text-aulaorange-500" />
        </button>
      </div>

      {/* Grid of 4 Axes with Connection Line */}
      <div className="relative">
        
        {/* Desktop Connection line connecting the 4 axis cards */}
        <div 
          className="pointer-events-none absolute top-1/2 left-4 right-4 hidden -translate-y-6 lg:block"
          aria-hidden="true"
        >
          <div className="h-0.5 w-full bg-gradient-to-r from-aulablue-100 via-aulaorange-200 to-aulablue-100" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTION_AXES.map((axis, index) => (
            <div
              key={axis.id}
              id={`axis-card-${axis.id}`}
              onClick={() => onSelectAxis(axis)}
              className="group relative cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-aulaorange-500 hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Axis Number */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-aulablue-800 text-xs font-black text-white transition-colors group-hover:bg-aulaorange-500">
                    0{axis.id}
                  </span>

                  <span className="rounded-md border border-aulaorange-200 bg-aulaorange-50 px-2 py-0.5 text-[11px] font-bold text-aulaorange-700">
                    {axis.focus.split(' ')[0]}
                  </span>
                </div>

                {/* Icon Container */}
                <div className="mb-3.5 inline-flex rounded-xl bg-aulablue-50 p-3 text-aulablue-800 transition-colors group-hover:bg-aulaorange-50 group-hover:text-aulaorange-500">
                  {getIcon(axis.iconName)}
                </div>

                {/* Titles */}
                <h3 className="text-base font-extrabold text-aulablue-800 group-hover:text-aulablue-700 transition-colors">
                  {axis.title.replace(`Eixo ${axis.id}: `, '')}
                </h3>
                <p className="mt-0.5 text-xs font-semibold text-aulaorange-600">
                  {axis.subtitle}
                </p>

                {/* Description */}
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600 line-clamp-3">
                  {axis.description}
                </p>
              </div>

              {/* Bottom Quick Spec */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-aulablue-800 group-hover:text-aulaorange-600 transition-colors">
                <span className="inline-flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Ver detalhes
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
