import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { Card as HomeCard } from '../components/common/Card';
import { Button as HomeButton } from '../components/common/Button';

export default function HomePage({ setPage }) {
    const [latestAnnouncements, setLatestAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    // ⏱ Slideshow state
    const heroImages = ["/brgy1.jpg", "/brgy2.jpg", "/brgy3.jpg"]; 
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 3000); 

        return () => clearInterval(interval);
    }, []);

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
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero container">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>
                            <span>Welcome to</span>{' '}
                            <span className="highlight">Brgy. San Vicente</span>
                        </h1>
                        <p>
                            Your centralized hub for barangay services, announcements, and community engagement.
                            We are committed to providing transparent and efficient public service.
                        </p>
                        <div className="hero-buttons">
                            <button onClick={() => setPage('services')} className="primary">
                                Explore Services
                            </button>
                            <button onClick={() => setPage('about')} className="secondary">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img
                            src={heroImages[currentIndex]}
                            alt="Barangay Slideshow"
                            className="hero-slide"
                        />
                    </div>
                </div>
            </section>

            {/* Announcement Section */}
            <section className="announcements container">
                <div className="section-title">
                    <h2>News & Updates</h2>
                    <p>Latest Announcements</p>
                </div>
                {loading ? (
                    <p className="text-center">Loading latest announcements...</p>
                ) : (
                    <div className="announcement-grid">
                        {latestAnnouncements.map((announcement) => (
                            <HomeCard key={announcement.id}>
                                <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {announcement.date?.toDate().toLocaleDateString()}
                                </p>
                                <p className="mt-4 text-gray-600 truncate">{announcement.content}</p>
                                <HomeButton onClick={() => setPage('announcements')} className="mt-6 w-full">
                                    Read More
                                </HomeButton>
                            </HomeCard>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
