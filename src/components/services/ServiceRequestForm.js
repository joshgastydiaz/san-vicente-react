import React, { useState } from 'react';
import { db } from '../../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export default function ServiceRequestForm({ user, serviceTitle, collectionName, fields, setPage }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const formData = {};
        fields.forEach(field => {
            formData[field.name] = e.target[field.name].value;
        });
        try {
            await addDoc(collection(db, collectionName), {
                ...formData,
                userId: user.uid,
                userEmail: user.email,
                status: 'Pending',
                submittedAt: serverTimestamp()
            });
            alert(`Your ${serviceTitle.toLowerCase()} has been submitted successfully!`);
            setPage('profile');
        } catch (err) {
            setError('Failed to submit request. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-4xl font-bold text-center mb-12">{serviceTitle}</h2>
            <Card className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
                            {field.type === 'textarea' ? (<textarea id={field.name} name={field.name} rows="4" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>) 
                            : field.type === 'select' ? (<select id={field.name} name={field.name} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">{field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>) 
                            : (<input type={field.type} id={field.name} name={field.name} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />)}
                        </div>
                    ))}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
                </form>
            </Card>
        </div>
    );
};