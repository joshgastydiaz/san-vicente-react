import React, { useState } from 'react';
import { auth, db } from '../../firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

// The component receives `{ setPage }` as a prop from App.js
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
            await signInWithEmailAndPassword(auth, email, password);
            // This line will now work correctly because setPage is a valid function
            setPage('home');
        } catch (err) {
            setError(err.message);
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
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="auth-title">
                    {isLogin ? 'Sign in to your account' : 'Create a new account'}
                </h2>
                <Card className="auth-card">
                    <form className="auth-form" onSubmit={isLogin ? handleLogin : handleRegister}>
                        {!isLogin && (
                             <input name="fullname" type="text" required className="auth-input" placeholder="Full Name" />
                        )}
                        <input id="email-address" name="email" type="email" autoComplete="email" required className="auth-input" placeholder="Email address" />
                        {!isLogin && (
                             <input name="address" type="text" required className="auth-input" placeholder="Address" />
                        )}
                        <input id="password" name="password" type="password" autoComplete="current-password" required className="auth-input" placeholder="Password" />
                        
                        {error && <p className="auth-error">{error}</p>}

                        <Button type="submit" className="btn--full-width" disabled={loading}>
                            {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
                        </Button>
                    </form>
                    <div className="auth-toggle">
                        <button onClick={() => {setIsLogin(!isLogin); setError('');}} className="auth-toggle-link">
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
