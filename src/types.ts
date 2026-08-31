export type UserRole = 'admin' | 'user';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  institution?: string;
  avatar?: string;
}

export interface UserAccount {
  user: User;
  passwordHash: string;
}

export type BNCCArea = 'linguagens' | 'matematica' | 'natureza' | 'humanas';

export interface BNCCAreaInfo {
  id: BNCCArea;
  name: string;
  shortName: string;
  disciplines: string[];
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    accent: string;
  };
  description: string;
  competencies: string[];
}

export interface VideoLesson {
  id: string;
  title: string;
  bnccArea: BNCCArea;
  discipline: string;
  professor: string;
  videoUrl: string;
  driveMaterialsUrl?: string;
  durationMinutes: number;
  synopsis: string;
  practicalObjective: string;
  targetCompetencies: string[];
  tags: string[];
  createdAt: string;
  addedBy: string;
  viewsCount: number;
  isFeatured?: boolean;
}

export interface ProductionAxis {
  id: number;
  title: string;
  subtitle: string;
  focus: string;
  iconName: string;
  description: string;
  specs: {
    title: string;
    items: string[];
  }[];
  practicalExample: string;
  recommendation: string;
}

export interface SheetRowData {
  titulo: string;
  area_bncc: string;
  disciplina: string;
  professor: string;
  link_video: string;
  link_drive_materiais?: string;
  duracao_minutos?: string | number;
  sinopse?: string;
  objetivo_pratico?: string;
  competencias?: string;
}
