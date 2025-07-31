import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { Card as HomeCard } from '../components/common/Card';
import { Button as HomeButton } from '../components/common/Button';

export default function HomePage({ setPage }) {
    const [latestAnnouncements, setLatestAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "announcements"), orderBy("date", "desc"), limit(3));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const announcementsData = [];
            querySnapshot.forEach((doc) => {
                announcementsData.push({ ...doc.data(), id: doc.id });
            });
            setLatestAnnouncements(announcementsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-gray-50">
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Welcome to</span>{' '}
                                    <span className="block text-blue-600 xl:inline">Brgy. San Vicente</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Your centralized hub for barangay services, announcements, and community engagement. We are committed to providing transparent and efficient public service.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <button onClick={() => setPage('services')} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                                            Explore Services
                                        </button>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <button onClick={() => setPage('about')} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://placehold.co/1000x800/3B82F6/FFFFFF?text=Barangay+Hall" alt="Barangay Hall" />
                </div>
            </div>
            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">News & Updates</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Latest Announcements
                        </p>
                    </div>
                    <div className="mt-10">
                        {loading ? (
                            <p className="text-center">Loading latest announcements...</p>
                        ) : (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {latestAnnouncements.map((announcement) => (
                                    <HomeCard key={announcement.id}>
                                        <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{announcement.date?.toDate().toLocaleDateString()}</p>
                                        <p className="mt-4 text-gray-600 truncate">{announcement.content}</p>
                                        <HomeButton onClick={() => setPage('announcements')} className="mt-6 w-full">Read More</HomeButton>
                                    </HomeCard>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}