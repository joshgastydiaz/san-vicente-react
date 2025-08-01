import React, { useState } from 'react';
import { auth, db } from '../../firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const t = (x) => x;


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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{isLogin ? 'Sign in to your account' : 'Create a new account'}</h2></div>
                <Card className="mt-8">
                    <form className="space-y-6" onSubmit={isLogin ? handleLogin : handleRegister}>
                        {!isLogin && (<input name="fullname" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Full Name" />)}
                        <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                        {!isLogin && (<input name="address" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Address" />)}
                        <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" />
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <div><Button type="submit" className="w-full" disabled={loading}>{loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}</Button></div>
                    </form>
                    <div className="text-sm text-center mt-4"><button onClick={() => {setIsLogin(!isLogin); setError('');}} className="font-medium text-blue-600 hover:text-blue-500">{isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}</button></div>
                </Card>
            </div>
        </div>
    );
};
