import { BNCCArea, VideoLesson } from '../types';

/**
 * Extracts embeddable video URL for YouTube, Google Drive, Vimeo, etc.
 */
export function getEmbedVideoUrl(url: string): { embedUrl: string; isEmbeddable: boolean; type: 'youtube' | 'drive' | 'vimeo' | 'direct' | 'unknown' } {
  if (!url) return { embedUrl: '', isEmbeddable: false, type: 'unknown' };

  const trimmed = url.trim();

  // YouTube formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      isEmbeddable: true,
      type: 'youtube',
    };
  }

  // Google Drive video links:
  // - https://drive.google.com/file/d/FILE_ID/view
  // - https://drive.google.com/file/d/FILE_ID/preview
  // - https://drive.google.com/open?id=FILE_ID
  const driveMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+))/i);
  if (driveMatch) {
    const fileId = driveMatch[1] || driveMatch[2];
    return {
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      isEmbeddable: true,
      type: 'drive',
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`,
      isEmbeddable: true,
      type: 'vimeo',
    };
  }

  // Direct video file (mp4, webm)
  if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) {
    return {
      embedUrl: trimmed,
      isEmbeddable: true,
      type: 'direct',
    };
  }

  return {
    embedUrl: trimmed,
    isEmbeddable: false,
    type: 'unknown',
  };
}

/**
 * Gets a video thumbnail URL if possible
 */
export function getVideoThumbnail(url: string, bnccArea: BNCCArea): string {
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  // Fallback themed abstract educational banners by area
  const areaThumbnails: Record<BNCCArea, string> = {
    linguagens: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    matematica: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    natureza: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    humanas: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800',
  };

  return areaThumbnails[bnccArea] || areaThumbnails.linguagens;
}

/**
 * Normalizes BNCC area strings from CSV or inputs
 */
export function normalizeBnccArea(input: string): BNCCArea {
  const clean = (input || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (clean.includes('mat') || clean.includes('calculo') || clean.includes('algebra')) return 'matematica';
  if (clean.includes('nat') || clean.includes('bio') || clean.includes('fis') || clean.includes('quim')) return 'natureza';
  if (clean.includes('hum') || clean.includes('hist') || clean.includes('geo') || clean.includes('filo') || clean.includes('socio')) return 'humanas';
  return 'linguagens';
}

/**
 * Parses CSV text from Google Sheets or CSV files into VideoLesson objects
 */
export function parseGoogleSheetCsv(csvText: string, defaultAuthor: string = 'Sincronização Drive/Planilha'): VideoLesson[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const delimiter = lines[0].includes(';') ? ';' : ',';
  // Parse header
  const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
  const getIndex = (possibleNames: string[]) => {
    return headers.findIndex(h => possibleNames.some(name => h.includes(name)));
  };

  const titleIdx = getIndex(['titulo', 'title', 'tema', 'nome da aula', 'nome']);
  const areaIdx = getIndex(['area do conhecimento', 'area', 'bncc', 'conhecimento']);
  const disciplineIdx = getIndex(['componente curricular', 'componente', 'disciplina', 'materia', 'subject']);
  const professorIdx = getIndex(['professor', 'prof', 'docente', 'autor']);
  const videoUrlIdx = getIndex(['link do youtube', 'link', 'video', 'youtube', 'url']);
  const driveUrlIdx = getIndex(['drive', 'material', 'slide', 'pdf']);
  const durationIdx = getIndex(['duracao', 'tempo', 'minutos', 'duration']);
  const synopsisIdx = getIndex(['sinopse', 'descricao', 'resumo']);
  const objectiveIdx = getIndex(['objetivo', 'meta', 'competencia']);

  const videos: VideoLesson[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const cells = parseCsvRow(rawLine, delimiter);
    if (!cells || cells.length === 0) continue;

    const title = (titleIdx >= 0 ? cells[titleIdx] : cells[0]) || `Videoaula ${i}`;
    const rawArea = areaIdx >= 0 ? cells[areaIdx] : cells[1] || 'linguagens';
    const bnccArea = normalizeBnccArea(rawArea);
    const discipline = (disciplineIdx >= 0 ? cells[disciplineIdx] : cells[2]) || 'Geral ENEM';
    const professor = (professorIdx >= 0 ? cells[professorIdx] : cells[3]) || 'Professores Aulão ENEM';
    const videoUrl = (videoUrlIdx >= 0 ? cells[videoUrlIdx] : cells[4]) || '';
    const driveMaterialsUrl = driveUrlIdx >= 0 ? cells[driveUrlIdx] : cells[5] || '';
    const durationMinutes = parseInt((durationIdx >= 0 ? cells[durationIdx] : cells[6]) || '45', 10) || 45;
    const synopsis = (synopsisIdx >= 0 ? cells[synopsisIdx] : cells[7]) || 'Videoaula preparatória para o Aulão ENEM com foco em resolução de questões.';
    const practicalObjective = (objectiveIdx >= 0 ? cells[objectiveIdx] : cells[8]) || 'Compreensão de habilidades centrais da matriz de referência do ENEM.';

    if (title.trim() && (videoUrl.trim() || discipline.trim())) {
      videos.push({
        id: `sheet-${Date.now()}-${i}`,
        title: title.trim(),
        bnccArea,
        discipline: discipline.trim(),
        professor: professor.trim(),
        videoUrl: videoUrl.trim(),
        driveMaterialsUrl: driveMaterialsUrl.trim(),
        durationMinutes,
        synopsis: synopsis.trim(),
        practicalObjective: practicalObjective.trim(),
        targetCompetencies: ['Competência BNCC ENEM'],
        tags: [discipline.trim(), 'ENEM', 'Aulão'],
        createdAt: new Date().toISOString().split('T')[0],
        addedBy: defaultAuthor,
        viewsCount: Math.floor(Math.random() * 400) + 50,
      });
    }
  }

  return videos;
}

function parseCsvRow(text: string, customDelimiter?: string): string[] {
  const delimiter = customDelimiter || (text.includes(';') ? ';' : ',');
  const p: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === delimiter && !inQuotes) {
      p.push(cur.trim().replace(/^["']|["']$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  p.push(cur.trim().replace(/^["']|["']$/g, ''));
  return p;
}

/**
 * Exports videos to CSV formatted string
 */
export function exportVideosToCsv(videos: VideoLesson[]): string {
  const headers = ['Título', 'Área BNCC', 'Disciplina', 'Professor', 'Link do Vídeo (YouTube/Drive)', 'Link Materiais Drive (PDF/Slides)', 'Duração (min)', 'Sinopse', 'Objetivo Prático'];
  
  const rows = videos.map(v => [
    `"${(v.title || '').replace(/"/g, '""')}"`,
    `"${v.bnccArea}"`,
    `"${(v.discipline || '').replace(/"/g, '""')}"`,
    `"${(v.professor || '').replace(/"/g, '""')}"`,
    `"${(v.videoUrl || '').replace(/"/g, '""')}"`,
    `"${(v.driveMaterialsUrl || '').replace(/"/g, '""')}"`,
    v.durationMinutes || 25,
    `"${(v.synopsis || '').replace(/"/g, '""')}"`,
    `"${(v.practicalObjective || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Parses User Logins from Google Sheet CSV or plain CSV
 * Supported formats:
 * 1. Nome,email,senha
 * 2. Nome,email,senha,nivel,instituicao
 */
export function parseUsersFromGoogleSheetCsv(csvText: string): { user: { name: string; email: string; role: 'admin' | 'user'; institution?: string }; passwordHash: string }[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
  const getIndex = (possibleNames: string[]) => {
    return headers.findIndex(h => possibleNames.some(name => h.includes(name)));
  };

  const nameIdx = getIndex(['nome', 'name', 'usuario', 'user']);
  const emailIdx = getIndex(['email', 'e-mail', 'mail', 'login']);
  const passIdx = getIndex(['senha', 'password', 'pass', 'chave']);
  const roleIdx = getIndex(['nivel', 'role', 'tipo', 'cargo', 'perfil', 'funcao']);
  const instIdx = getIndex(['instituicao', 'orgao', 'escola', 'institution', 'sed']);

  const accounts: { user: { name: string; email: string; role: 'admin' | 'user'; institution?: string }; passwordHash: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const cells = parseCsvRow(rawLine);
    if (!cells || cells.length < 2) continue;

    const name = (nameIdx >= 0 ? cells[nameIdx] : cells[0]) || `Usuário ${i}`;
    const email = (emailIdx >= 0 ? cells[emailIdx] : cells[1]) || '';
    const password = (passIdx >= 0 ? cells[passIdx] : cells[2]) || '123456';
    const rawRole = (roleIdx >= 0 ? cells[roleIdx] : cells[3] || '').toLowerCase();
    const institution = (instIdx >= 0 ? cells[instIdx] : cells[4]) || 'Secretaria de Estado da Educação (SED/SC)';

    if (!email || !email.includes('@')) continue;

    // Detect role (admin if explicitly 'admin', 'gestor', 'coordenador', or if SED/SC email)
    const isAdmin = rawRole.includes('admin') || 
                    rawRole.includes('gestor') || 
                    rawRole.includes('coord') || 
                    email.toLowerCase().includes('sed.sc.gov.br') ||
                    email.toLowerCase().includes('luizalessandro') ||
                    email.toLowerCase().includes('efexgestor');

    accounts.push({
      user: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: isAdmin ? 'admin' : 'user',
        institution: institution.trim(),
      },
      passwordHash: password.trim(),
    });
  }

  return accounts;
}

/**
 * Exports users to CSV
 */
export function exportUsersToCsv(accounts: { user: { name: string; email: string; role: 'admin' | 'user'; institution?: string }; passwordHash: string }[]): string {
  const headers = ['Nome', 'email', 'senha', 'nivel', 'instituicao'];
  const rows = accounts.map(a => [
    `"${(a.user.name || '').replace(/"/g, '""')}"`,
    `"${a.user.email || ''}"`,
    `"${(a.passwordHash || '').replace(/"/g, '""')}"`,
    `"${a.user.role || 'user'}"`,
    `"${(a.user.institution || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Downloads a text file in browser
 */
export function downloadCsvFile(content: string, filename: string = 'aulao_enem_videoaulas.csv') {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
