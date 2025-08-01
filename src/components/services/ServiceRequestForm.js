import React, { useState } from 'react';
import { db } from '../../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import '../../styles/pages/service-request-form.scss';

export default function ServiceRequestForm({ user, serviceTitle, collectionName, fields, setPage }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = {};

        try {
            // Extract and validate each field
            fields.forEach(field => {
                const value = e.target[field.name].value.trim();
                if (!value) {
                    throw new Error(`Please fill in the "${field.label}" field.`);
                }
                formData[field.name] = value;
            });

            // Submit to Firestore
            await addDoc(collection(db, collectionName), {
                ...formData,
                userId: user.uid || '',
                userEmail: user.email || '',
                status: 'Pending',
                submittedAt: serverTimestamp()
            });

            alert(`Your ${serviceTitle.toLowerCase()} has been submitted successfully!`);
            setPage('profile');
        } catch (err) {
            setError(err.message || 'Failed to submit request. Please try again.');
            console.error('Submission Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="service-request container mx-auto p-8">
            <h2 className="service-request__title">{serviceTitle}</h2>
            <Card className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="service-request__form">
                    {fields.map(field => (
                        <div key={field.name} className="service-request__field">
                            <label htmlFor={field.name}>{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea id={field.name} name={field.name} rows="4" required />
                            ) : field.type === 'select' ? (
                                <select id={field.name} name={field.name} required>
                                    <option value="">Select an option</option>
                                    {field.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input type={field.type} id={field.name} name={field.name} required />
                            )}
                        </div>
                    ))}
                    {error && <p className="service-request__error">{error}</p>}
                    <Button type="submit" className="service-request__submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
