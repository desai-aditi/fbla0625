// import { useState } from 'react';
// import auth from '@react-native-firebase/auth';
// import { FirebaseError } from 'firebase/app';

// export function useAuth() {
// 	const [email, setEmail] = useState('');
// 	const [password, setPassword] = useState('');
// 	const [loading, setLoading] = useState(false);

// 	const signIn = async () => {
// 		setLoading(true);
// 		try {
// 			await auth().signInWithEmailAndPassword(email, password);
// 		} catch (e: any) {
// 			const err = e as FirebaseError;
// 			alert('Sign in failed: ' + err.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const signUp = async () => {
// 		setLoading(true);
// 		try {
// 			await auth().createUserWithEmailAndPassword(email, password);
// 			alert('Check your emails!');
// 		} catch (e: any) {
// 			const err = e as FirebaseError;
// 			alert('Registration failed: ' + err.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return {
// 		email,
// 		setEmail,
// 		password,
// 		setPassword,
// 		loading,
// 		signIn,
// 		signUp
// 	};
// }