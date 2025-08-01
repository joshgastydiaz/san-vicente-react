import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutusPage';
import ServicesPage from './pages/ServicePage';
import AnnouncementsPage from './pages/AnnouncementPage';
import ContactUsPage from './pages/ContactUsPage';
import AuthPage from './components/auth/Authpage';
import UserProfilePage from './pages/UserProfilePage';
import ServiceRequestForm from './components/services/ServiceRequestForm';
import AdminDashboard from './components/admin/AdminDashboard';
import './index.scss';

export default function App() {
    const [page, setPage] = useState('home');
    const [currentUser, setCurrentUser] = useState(null);
    const [userType, setUserType] = useState('resident');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                if (user.email === 'josh_admin@sanvicente.com') {
                    setUserType('admin');
                } else {
                    setUserType('resident');
                }
            } else {
                setCurrentUser(null);
                setUserType('resident');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    const renderPage = () => {
        const isLoggedIn = !!currentUser;
        switch (page) {
            case 'home': return <HomePage setPage={setPage} />;
            case 'about': return <AboutUsPage />;
            case 'services': return <ServicesPage setPage={setPage} loggedIn={isLoggedIn} />;
            case 'announcements': return <AnnouncementsPage />;
            case 'contact': return <ContactUsPage />;
            
            case 'login': return <AuthPage setPage={setPage} />;
            
            case 'profile':
                return isLoggedIn ? <UserProfilePage user={currentUser} /> : <AuthPage setPage={setPage} />;
            case 'requestDocument':
                return isLoggedIn ? <ServiceRequestForm user={currentUser} serviceTitle="Request a Document" collectionName="documentRequests" fields={[{name: 'documentType', label: 'Document Type', type: 'select', options: ['Barangay Clearance', 'Certificate of Indigency']}, {name: 'purpose', label: 'Purpose', type: 'textarea'}]} setPage={setPage} /> : <AuthPage setPage={setPage} />;
            case 'reportIncident':
                return isLoggedIn ? <ServiceRequestForm user={currentUser} serviceTitle="Report an Incident" collectionName="incidentReports" fields={[{name: 'date', label: 'Date of Incident', type: 'date'}, {name: 'location', label: 'Location', type: 'text'}, {name: 'description', label: 'Description', type: 'textarea'}]} setPage={setPage} /> : <AuthPage setPage={setPage} />;
            case 'submitSuggestion':
                 return isLoggedIn ? <ServiceRequestForm user={currentUser} serviceTitle="Submit a Suggestion" collectionName="suggestions" fields={[{name: 'subject', label: 'Subject', type: 'text'}, {name: 'suggestion', label: 'Suggestion/Feedback', type: 'textarea'}]} setPage={setPage} /> : <AuthPage setPage={setPage} />;

            // This is the security check. If you are not a logged-in admin, it sends you to the Home Page.
            case 'adminDashboard':
                return (isLoggedIn && userType === 'admin') ? <AdminDashboard /> : <HomePage setPage={setPage} />;
            
            default: return <HomePage setPage={setPage} />;
        }
    };

    return (
        <div className="app-container">
            <Header setPage={setPage} currentUser={currentUser} userType={userType} />
            <main className="main-content">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}
