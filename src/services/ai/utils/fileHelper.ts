import fs from 'fs';
import path from 'path';

const KNOWLEDGE_ROOT = path.join(process.cwd(), 'src', 'services', 'ai', 'knowledge');

const SUBFOLDERS = [
  'destinations',
  'hotels',
  'culinary',
  'culture',
  'history',
  'festival',
  'transportation',
  'faq',
  'travel_tips',
  'news',
  'emergency',
  'pdfs' // directory for uploaded/extracted PDFs
];

export function ensureKnowledgeStructure() {
  if (!fs.existsSync(KNOWLEDGE_ROOT)) {
    fs.mkdirSync(KNOWLEDGE_ROOT, { recursive: true });
  }
  for (const sub of SUBFOLDERS) {
    const p = path.join(KNOWLEDGE_ROOT, sub);
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
  }

  // Auto-sync dataset items from /src/data into KNOWLEDGE_ROOT
  try {
    const dataDir = path.join(process.cwd(), 'src', 'data');
    const syncMapping = [
      { file: 'destinations.json', folder: 'destinations', idField: 'id', titleField: 'name' },
      { file: 'hotels.json', folder: 'hotels', idField: 'id', titleField: 'name' },
      { file: 'culinary.json', folder: 'culinary', idField: 'id', titleField: 'name' },
      { file: 'cultures.json', folder: 'culture', idField: 'id', titleField: 'title' },
      { file: 'history.json', folder: 'history', idField: 'id', titleField: 'title' },
      { file: 'festival.json', folder: 'festival', idField: 'id', titleField: 'name' }
    ];

    for (const mapping of syncMapping) {
      const dataFilePath = path.join(dataDir, mapping.file);
      if (fs.existsSync(dataFilePath)) {
        const raw = fs.readFileSync(dataFilePath, 'utf-8');
        const items = JSON.parse(raw);
        if (Array.isArray(items)) {
          for (const item of items) {
            if (!item[mapping.idField]) continue;
            const sanitizedId = item[mapping.idField].replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
            const destFilePath = path.join(KNOWLEDGE_ROOT, mapping.folder, `${sanitizedId}.json`);
            
            // Only write if it does not already exist
            if (!fs.existsSync(destFilePath)) {
              fs.writeFileSync(destFilePath, JSON.stringify(item, null, 2), 'utf-8');
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('[KNOWLEDGE] Error auto-syncing from data dir:', error);
  }
}

export interface KnowledgeDocument {
  id: string;
  category: string;
  filename: string;
  title: string;
  content: string;
  raw: any;
}

export function getAllKnowledgeDocuments(): KnowledgeDocument[] {
  ensureKnowledgeStructure();
  const documents: KnowledgeDocument[] = [];

  for (const sub of SUBFOLDERS) {
    const subPath = path.join(KNOWLEDGE_ROOT, sub);
    if (!fs.existsSync(subPath)) continue;

    const files = fs.readdirSync(subPath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(subPath, file);
          const rawText = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(rawText);
          
          let title = data.name || data.title || file.replace('.json', '');
          let contentStr = '';

          if (sub === 'destinations') {
            contentStr = `[DESTINASI: ${data.name}]\nKabupaten: ${data.district}\nKategori: ${data.category}\nDeskripsi: ${data.description}\nJam Buka: ${data.openingHours}\nHarga Tiket: Rp ${data.ticketPrice}\nFasilitas: ${(data.facilities || []).join(', ')}\nLegenda/Cerita: ${data.story || ''}`;
          } else if (sub === 'hotels') {
            contentStr = `[AKOMODASI: ${data.name}]\nKabupaten: ${data.district}\nHarga: ${data.priceRange || data.price}\nDeskripsi: ${data.description}\nFasilitas: ${(data.facilities || []).join(', ')}`;
          } else if (sub === 'culinary') {
            contentStr = `[KULINER: ${data.name}]\nDeskripsi: ${data.description}\nSejarah: ${data.history || ''}\nBahan: ${(data.ingredients || []).join(', ')}\nCara Membuat: ${(data.preparation || []).join('. ')}`;
          } else if (sub === 'culture') {
            contentStr = `[BUDAYA: ${data.title || data.name}]\nKategori: ${data.category || ''}\nDeskripsi: ${data.description}\nDetail: ${data.detailedContent || ''}`;
          } else if (sub === 'faq') {
            contentStr = `[FAQ]\nTanya: ${data.question}\nJawab: ${data.answer}`;
          } else if (sub === 'emergency') {
            contentStr = `[DARURAT: ${data.name}]\nTelepon: ${data.phone || data.number}\nKeterangan: ${data.description}`;
          } else {
            contentStr = `[${sub.toUpperCase()}]: ${title}\n${data.description || ''}\n${data.detailedContent || data.content || JSON.stringify(data)}`;
          }

          documents.push({
            id: data.id || `${sub}-${file.replace('.json', '')}`,
            category: sub,
            filename: file,
            title,
            content: contentStr,
            raw: data
          });
        } catch (err) {
          console.error(`Error parsing knowledge file ${sub}/${file}:`, err);
        }
      } else if (file.endsWith('.txt') || file.endsWith('.md')) {
        try {
          const filePath = path.join(subPath, file);
          const rawText = fs.readFileSync(filePath, 'utf-8');
          documents.push({
            id: `${sub}-${file.replace(/\.(txt|md)$/, '')}`,
            category: sub,
            filename: file,
            title: file.replace(/\.(txt|md)$/, ''),
            content: rawText,
            raw: { content: rawText }
          });
        } catch (err) {
          console.error(`Error reading flat file ${sub}/${file}:`, err);
        }
      }
    }
  }

  return documents;
}

export function saveKnowledgeDocument(category: string, filename: string, data: any): void {
  ensureKnowledgeStructure();
  const subPath = path.join(KNOWLEDGE_ROOT, category);
  if (!fs.existsSync(subPath)) {
    fs.mkdirSync(subPath, { recursive: true });
  }
  const filePath = path.join(subPath, filename.endsWith('.json') ? filename : `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function deleteKnowledgeDocument(category: string, filename: string): void {
  const filePath = path.join(KNOWLEDGE_ROOT, category, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
