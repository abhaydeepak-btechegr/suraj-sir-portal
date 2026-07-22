import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore,
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  onSnapshot, 
  deleteDoc, 
  writeBatch,
  query,
  orderBy
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PortalBatch, Book, MockTest, Notice, Doubt } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId and auto-detect long polling for sandbox stability
const databaseId = firebaseConfig.firestoreDatabaseId || (firebaseConfig as any).databaseId;
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
}, databaseId);

// Initialize Storage
export const storage = getStorage(app);

// Helper to convert youtube URL to video ID
export function getYouTubeId(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[2].length === 11) ? match[2] : trimmed;
}

// ----------------------------------------------------
// DB SEED HELPERS
// ----------------------------------------------------
export async function seedDatabaseIfEmpty(
  initialNotices: Notice[],
  initialPortalBatches: PortalBatch[],
  initialBooks: Book[],
  initialMockTests: MockTest[],
  initialDoubts: Doubt[]
) {
  try {
    const noticesRef = collection(db, 'notices');
    const noticesSnap = await getDocs(noticesRef);
    if (noticesSnap.empty) {
      console.log('Seeding notices...');
      const batch = writeBatch(db);
      initialNotices.forEach(notice => {
        batch.set(doc(db, 'notices', notice.id), notice);
      });
      await batch.commit();
    }

    const batchesRef = collection(db, 'portalBatches');
    const batchesSnap = await getDocs(batchesRef);
    if (batchesSnap.empty) {
      console.log('Seeding portalBatches...');
      const batch = writeBatch(db);
      initialPortalBatches.forEach(b => {
        batch.set(doc(db, 'portalBatches', b.id), b);
      });
      await batch.commit();
    } else {
      // Force update class_10 with new science youtube lectures if they aren't already set
      const class10DocRef = doc(db, 'portalBatches', 'class_10');
      const class10Doc = batchesSnap.docs.find(d => d.id === 'class_10');
      if (class10Doc) {
        const data = class10Doc.data() as PortalBatch;
        const currentSciLectures = data.subjects?.science?.lectures || [];
        const currentIds = currentSciLectures.map(l => l.youtubeId).join(',');
        const expectedIds = ['_FSKjiotREo', '4ds0eiFnYhE', 'WrtsWQpB7Kg', 'YU6peT7ORM4', 'Qw0-1HffQkE'].join(',');
        
        if (currentIds !== expectedIds) {
          console.log('Migrating class_10 to new science lectures...');
          const updatedClass10 = initialPortalBatches.find(b => b.id === 'class_10');
          if (updatedClass10) {
            await setDoc(class10DocRef, updatedClass10);
          }
        }
      }
    }

    const booksRef = collection(db, 'books');
    const booksSnap = await getDocs(booksRef);
    if (booksSnap.empty) {
      console.log('Seeding books...');
      const batch = writeBatch(db);
      initialBooks.forEach(b => {
        batch.set(doc(db, 'books', b.id), b);
      });
      await batch.commit();
    }

    const testsRef = collection(db, 'mockTests');
    const testsSnap = await getDocs(testsRef);
    if (testsSnap.empty) {
      console.log('Seeding mockTests...');
      const batch = writeBatch(db);
      initialMockTests.forEach(t => {
        batch.set(doc(db, 'mockTests', t.id), t);
      });
      await batch.commit();
    }

    const doubtsRef = collection(db, 'doubts');
    const doubtsSnap = await getDocs(doubtsRef);
    if (doubtsSnap.empty) {
      console.log('Seeding doubts...');
      const batch = writeBatch(db);
      initialDoubts.forEach(d => {
        batch.set(doc(db, 'doubts', d.id), d);
      });
      await batch.commit();
    }
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

// ----------------------------------------------------
// REAL-TIME SYNC HELPERS (with local state update callback)
// ----------------------------------------------------
export function syncCollection<T>(
  collectionName: string,
  onUpdate: (data: T[]) => void,
  sortField?: string,
  sortDirection: 'asc' | 'desc' = 'asc',
  onError?: (err: unknown) => void
) {
  const colRef = collection(db, collectionName);
  const q = sortField ? query(colRef, orderBy(sortField, sortDirection)) : colRef;
  
  return onSnapshot(q, (snapshot) => {
    const list: T[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as T);
    });
    onUpdate(list);
  }, (error) => {
    console.warn(`[Firestore] Sync notice for ${collectionName}:`, error);
    if (onError) onError(error);
  });
}

// ----------------------------------------------------
// DATA WRITE OPERATIONS
// ----------------------------------------------------
export async function saveDocument(collectionName: string, docId: string, data: any) {
  try {
    await setDoc(doc(db, collectionName, docId), data, { merge: true });
  } catch (error) {
    console.error(`Error saving document inside ${collectionName}:`, error);
    throw error;
  }
}

export async function deleteDocument(collectionName: string, docId: string) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

// ----------------------------------------------------
// FIREBASE STORAGE UPLOAD HELPER
// ----------------------------------------------------
export async function uploadVideoFile(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const storagePath = `videos/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const storageRef = ref(storage, storagePath);
  
  try {
    // Standard uploadBytes since it is fast and simple
    const result = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(result.ref);
    return url;
  } catch (error) {
    console.error('Firebase storage upload failed:', error);
    throw error;
  }
}
