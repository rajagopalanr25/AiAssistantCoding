import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'local_db.json');

// In-memory collections
let db = {
  users: [],
  problems: [],
  interviews: [],
  submissions: [],
  aiInteractions: [],
  evaluations: [],
  customProblems: []
};

// Load existing data from file if present
export function initStore() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      db = JSON.parse(data);
      console.log('[Embedded DB] Loaded existing database from disk.');
    } else {
      saveStore();
      console.log('[Embedded DB] Initialized new embedded database.');
    }
  } catch (err) {
    console.error('[Embedded DB] Failed to load data file, starting with empty store:', err.message);
  }
}

export function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('[Embedded DB] Failed to persist data:', err.message);
  }
}

// Model-like abstraction for local operations
export function createCollection(collectionName) {
  return {
    async find(query = {}) {
      const items = db[collectionName] || [];
      return items.filter(item => {
        for (const key of Object.keys(query)) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      });
    },
    async findOne(query = {}) {
      const items = db[collectionName] || [];
      return items.find(item => {
        for (const key of Object.keys(query)) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      }) || null;
    },
    async findById(id) {
      const items = db[collectionName] || [];
      return items.find(item => item._id === id || item.id === id) || null;
    },
    async create(doc) {
      if (!db[collectionName]) db[collectionName] = [];
      const newDoc = {
        _id: doc._id || 'id_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...doc
      };
      db[collectionName].push(newDoc);
      saveStore();
      return newDoc;
    },
    async insertMany(docs) {
      if (!db[collectionName]) db[collectionName] = [];
      const newDocs = docs.map(d => ({
        _id: d._id || 'id_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...d
      }));
      db[collectionName].push(...newDocs);
      saveStore();
      return newDocs;
    },
    async findByIdAndUpdate(id, update, options = { new: true }) {
      if (!db[collectionName]) return null;
      const index = db[collectionName].findIndex(item => item._id === id || item.id === id);
      if (index === -1) return null;
      
      const current = db[collectionName][index];
      const updated = {
        ...current,
        ...(update.$set || update),
        updatedAt: new Date().toISOString()
      };
      
      // Handle $inc if any
      if (update.$inc) {
        for (const [key, value] of Object.entries(update.$inc)) {
          updated[key] = (current[key] || 0) + value;
        }
      }
      
      db[collectionName][index] = updated;
      saveStore();
      return updated;
    },
    async updateOne(query, update) {
      const item = await this.findOne(query);
      if (!item) return { matchedCount: 0, modifiedCount: 0 };
      await this.findByIdAndUpdate(item._id, update);
      return { matchedCount: 1, modifiedCount: 1 };
    },
    async findByIdAndDelete(id) {
      if (!db[collectionName]) return null;
      const index = db[collectionName].findIndex(item => item._id === id || item.id === id);
      if (index === -1) return null;
      const deleted = db[collectionName].splice(index, 1)[0];
      saveStore();
      return deleted;
    },
    async countDocuments(query = {}) {
      const matches = await this.find(query);
      return matches.length;
    },
    async deleteMany(query = {}) {
      if (!db[collectionName]) return { deletedCount: 0 };
      const initialLen = db[collectionName].length;
      db[collectionName] = db[collectionName].filter(item => {
        for (const key of Object.keys(query)) {
          if (item[key] === query[key]) return false;
        }
        return true;
      });
      const deletedCount = initialLen - db[collectionName].length;
      saveStore();
      return { deletedCount };
    }
  };
}

export const localCollections = {
  users: createCollection('users'),
  problems: createCollection('problems'),
  interviews: createCollection('interviews'),
  submissions: createCollection('submissions'),
  aiInteractions: createCollection('aiInteractions'),
  evaluations: createCollection('evaluations'),
  customProblems: createCollection('customProblems')
};

