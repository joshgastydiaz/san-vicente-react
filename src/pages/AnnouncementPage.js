import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Card as CustomCard } from '../components/common/Card';

export default function AnnouncementPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "announcements"), orderBy("date", "desc"));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const announcementsData = [];
            querySnapshot.forEach((doc) => {
                announcementsData.push({ ...doc.data(), id: doc.id });
            });
            setAnnouncements(announcementsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching announcements: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading announcements...</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-4xl font-bold text-center mb-12">Announcements</h2>
            <div className="space-y-8">
                {announcements.length > 0 ? (
                    announcements.map(announcement => (
                        <CustomCard key={announcement.id}>
                            <h3 className="text-2xl font-bold">{announcement.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {announcement.date?.toDate().toLocaleDateString()}
                            </p>
                            <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                        </CustomCard>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No announcements at this time.</p>
                )}
            </div>
        </div>
    );
};
