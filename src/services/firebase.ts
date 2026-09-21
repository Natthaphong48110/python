import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { StudentLeaderboardEntry } from '../types';
import configJson from '../../firebase-applet-config.json';

// Initialize Firebase App
const firebaseConfig = {
  apiKey: configJson.apiKey,
  authDomain: configJson.authDomain,
  projectId: configJson.projectId,
  storageBucket: configJson.storageBucket,
  messagingSenderId: configJson.messagingSenderId,
  appId: configJson.appId
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Connect to the specific firestore database ID
export const db = configJson.firestoreDatabaseId
  ? getFirestore(app, configJson.firestoreDatabaseId)
  : getFirestore(app);

const STUDENTS_COLLECTION = 'students';

/**
 * Save or update student record in Firestore across all devices
 */
export async function syncStudentToFirestore(student: StudentLeaderboardEntry): Promise<boolean> {
  try {
    if (!student || !student.id) return false;
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    
    // Clean data for Firestore
    const payload: Record<string, any> = {
      id: student.id,
      studentName: student.studentName || '',
      classroom: student.classroom || '',
      studentNo: student.studentNo || '',
      totalPoints: Number(student.totalPoints) || 0,
      preTestScore: student.preTestScore !== undefined ? student.preTestScore : null,
      postTestScore: student.postTestScore !== undefined ? student.postTestScore : null,
      gainRate: student.gainRate !== undefined ? student.gainRate : null,
      sorterHighScore: Number(student.sorterHighScore) || 0,
      detectiveHighScore: Number(student.detectiveHighScore) || 0,
      labHighScore: Number(student.labHighScore) || 0,
      badges: Array.isArray(student.badges) ? student.badges : [],
      lastActive: student.lastActive || new Date().toISOString(),
      totalQuizzesTaken: Number(student.totalQuizzesTaken) || 0
    };

    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (error) {
    console.warn('Firestore sync failed, fallback to local storage:', error);
    return false;
  }
}

/**
 * Fetch all student records from Firestore
 */
export async function fetchStudentsFromFirestore(): Promise<StudentLeaderboardEntry[]> {
  try {
    const q = query(collection(db, STUDENTS_COLLECTION), orderBy('totalPoints', 'desc'));
    const snapshot = await getDocs(q);
    const students: StudentLeaderboardEntry[] = [];
    snapshot.forEach((d) => {
      const data = d.data() as StudentLeaderboardEntry;
      if (data && data.id && data.studentName) {
        students.push(data);
      }
    });
    return students;
  } catch (error) {
    console.warn('Failed fetching from Firestore:', error);
    return [];
  }
}

/**
 * Subscribe to real-time changes in Firestore students collection
 */
export function subscribeToFirestoreLeaderboard(
  onUpdate: (students: StudentLeaderboardEntry[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const q = query(collection(db, STUDENTS_COLLECTION), orderBy('totalPoints', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const students: StudentLeaderboardEntry[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as StudentLeaderboardEntry;
          if (data && data.id && data.studentName) {
            students.push(data);
          }
        });
        onUpdate(students);
      },
      (err) => {
        console.warn('Firestore real-time subscription error:', err);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn('Could not establish Firestore subscription:', err);
    return () => {};
  }
}

/**
 * Delete a student from Firestore
 */
export async function deleteStudentFromFirestore(studentId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
    return true;
  } catch (error) {
    console.warn('Failed deleting student from Firestore:', error);
    return false;
  }
}

/**
 * Reset all students from Firestore (e.g. for teacher)
 */
export async function resetAllStudentsFromFirestore(): Promise<boolean> {
  try {
    const snapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
    const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.warn('Failed resetting Firestore leaderboard:', error);
    return false;
  }
}
