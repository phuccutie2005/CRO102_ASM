import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();
const auth = getAuth();

// Async thunk để lấy thông tin người dùng từ Firestore và cập nhật Redux
export const fetchUserInfo = createAsyncThunk(
    'auth/fetchUserInfo',
    async (userId, { rejectWithValue }) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                return userDoc.data(); // Trả về thông tin người dùng từ Firestore
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
