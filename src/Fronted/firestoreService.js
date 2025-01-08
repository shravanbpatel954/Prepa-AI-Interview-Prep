import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

// Fetch user data from Firestore
export const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const userPracticesRef = collection(db, 'users', user.uid, 'interview_practices');
    const querySnapshot = await getDocs(userPracticesRef);

    const data = {};
    querySnapshot.forEach((doc) => {
        data[doc.id] = doc.data();
    });

    return data;
};

// Fetch user data by ID from Firestore
export const fetchUserDataById = async (docId) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const docRef = doc(db, 'users', user.uid, 'interview_practices', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        throw new Error('No such document!');
    }
};

// Save user data to Firestore
export const saveUserData = async (dataToSave) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const dataWithUserId = {
        ...dataToSave,
        userId: user.uid,
    };

    const docRef = doc(db, 'users', user.uid, 'interview_practices', new Date().toISOString());
    await setDoc(docRef, dataWithUserId);
};

// Delete user data from Firestore
export const deleteUserData = async (docId) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const docRef = doc(db, 'users', user.uid, 'interview_practices', docId);
    await deleteDoc(docRef);
};
