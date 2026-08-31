import React from 'react';
import { BookOpen, Calculator, Atom, Globe2, Layers } from 'lucide-react';
import { BNCCArea } from '../types';
import { BNCC_AREAS } from '../data/initialData';

interface BNCCFilterTabsProps {
  selectedArea: BNCCArea | 'all';
  onSelectArea: (area: BNCCArea | 'all') => void;
  selectedDiscipline: string | 'all';
  onSelectDiscipline: (discipline: string | 'all') => void;
  countsByArea: Record<string, number>;
  totalCount: number;
}

export const BNCCFilterTabs: React.FC<BNCCFilterTabsProps> = ({
  selectedArea,
  onSelectArea,
  selectedDiscipline,
  onSelectDiscipline,
  countsByArea,
  totalCount,
}) => {
  const getAreaIcon = (areaKey: string) => {
    switch (areaKey) {
      case 'linguagens':
        return <BookOpen className="h-4 w-4" />;
      case 'matematica':
        return <Calculator className="h-4 w-4" />;
      case 'natureza':
        return <Atom className="h-4 w-4" />;
      case 'humanas':
        return <Globe2 className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  const currentAreaDisciplines = selectedArea !== 'all' 
    ? BNCC_AREAS[selectedArea]?.disciplines || [] 
    : [];

  return (
    <div className="mb-8" id="bncc-area-filters">
      {/* Area tabs bar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#00154e]">
            Áreas do Conhecimento (BNCC)
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            • Selecione a área para explorar videoaulas e materiais
          </span>
        </div>
      </div>

      {/* Main Area Pills */}
      <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
        {/* All Areas Button */}
        <button
          type="button"
          id="tab-area-all"
          onClick={() => {
            onSelectArea('all');
            onSelectDiscipline('all');
          }}
          className={`flex items-center justify-between sm:justify-start gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            selectedArea === 'all'
              ? 'bg-aulablue-800 text-white shadow-md'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-aulablue-100 hover:bg-aulablue-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-aulaorange-500" />
            <span>Todas as Áreas</span>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
              selectedArea === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* 4 BNCC Areas */}
        {(Object.keys(BNCC_AREAS) as BNCCArea[]).map((areaKey) => {
          const area = BNCC_AREAS[areaKey];
          const isSelected = selectedArea === areaKey;
          const count = countsByArea[areaKey] || 0;

          return (
            <button
              key={areaKey}
              id={`tab-area-${areaKey}`}
              onClick={() => {
                onSelectArea(areaKey);
                onSelectDiscipline('all');
              }}
              className={`flex items-center justify-between sm:justify-start gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-aulablue-800 text-white shadow-md ring-2 ring-aulaorange-500/50'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-aulaorange-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={isSelected ? 'text-aulaorange-500' : 'text-aulablue-700'}>
                  {getAreaIcon(areaKey)}
                </span>
                <span className="truncate max-w-[140px] md:max-w-none">
                  {area.shortName}
                </span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  isSelected
                    ? 'bg-aulaorange-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Area Description & Discipline Filter Bar */}
      {selectedArea !== 'all' && (
        <div className="mt-3.5 rounded-xl border border-aulablue-100 bg-aulablue-50/70 p-3.5 text-xs text-aulablue-800">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="font-medium text-slate-700">
              <strong className="text-aulablue-800">{BNCC_AREAS[selectedArea].name}: </strong>
              {BNCC_AREAS[selectedArea].description}
            </p>
          </div>

          {/* Discipline Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-aulablue-100/60">
            <span className="text-[11px] font-bold text-slate-500 mr-1">Disciplinas:</span>
            <button
              type="button"
              onClick={() => onSelectDiscipline('all')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedDiscipline === 'all'
                  ? 'bg-aulablue-800 text-white font-bold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-aulaorange-500'
              }`}
            >
              Todas da Área
            </button>
            {currentAreaDisciplines.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => onSelectDiscipline(disc)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  selectedDiscipline === disc
                    ? 'bg-aulaorange-500 text-white font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-aulaorange-500'
                }`}
              >
                {disc}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
