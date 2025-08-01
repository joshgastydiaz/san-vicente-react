import React, { useState } from 'react';
import { auth, db } from '../../firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const getFriendlyAuthError = (errorCode) => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Incorrect email or password. Please try again.';
        case 'auth/email-already-in-use':
            return 'An account with this email address already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters long.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
};

export default function AuthPage({ setPage }) {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const role = userDocSnap.data().role;
                console.log("Logged in role:", role);

                // ✅ Instead of setPage(), reload to trigger App.js to route properly
                window.location.reload();
            } else {
                setError('User profile not found.');
            }
        } catch (err) {
            setError(getFriendlyAuthError(err.code));
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const fullName = e.target.fullname.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const address = e.target.address.value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName,
                email,
                address,
                role: 'resident'
            });

            alert("Registration successful! Please log in.");
            setIsLogin(true);
        } catch (err) {
            setError(getFriendlyAuthError(err.code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__container">
                <h2 className="auth-page__title">
                    {isLogin ? 'Sign in to your account' : 'Create a new account'}
                </h2>
                <Card className="auth-page__card">
                    <form className="auth-page__form" onSubmit={isLogin ? handleLogin : handleRegister}>
                        {!isLogin && (
                            <input name="fullname" type="text" required className="auth-page__input" placeholder="Full Name" />
                        )}
                        <input name="email" type="email" required className="auth-page__input" placeholder="Email address" />
                        {!isLogin && (
                            <input name="address" type="text" required className="auth-page__input" placeholder="Address" />
                        )}
                        <input name="password" type="password" required className="auth-page__input" placeholder="Password" />
                        {error && <p className="auth-page__error">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
                        </Button>
                    </form>
                    <div className="auth-page__toggle">
                        <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="auth-page__toggle-link">
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
