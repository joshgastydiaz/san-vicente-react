import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { collection, query, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

// A reusable component for each section of the dashboard
const DashboardSection = ({ title, children }) => (
    <Card>
        <h3 className="dashboard-section__title">{title}</h3>
        <div className="dashboard-section__content">
            {children}
        </div>
    </Card>
);

export default function AdminDashboard() {
    const [documentRequests, setDocumentRequests] = useState([]);
    const [incidentReports, setIncidentReports] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [announcements, setAnnouncements] = useState([]); // State for announcements
    
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const collections = {
            documentRequests: setDocumentRequests,
            incidentReports: setIncidentReports,
            suggestions: setSuggestions,
            announcements: setAnnouncements, // Fetch announcements
        };

        const unsubscribes = Object.entries(collections).map(([collectionName, setter]) => {
            const q = query(collection(db, collectionName), orderBy('submittedAt', 'desc'));
            return onSnapshot(q, (querySnapshot) => {
                const items = [];
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() });
                });
                setter(items);
            });
        });

        return () => unsubscribes.forEach(unsub => unsub());
    }, []);

    const handleUpdateRequestStatus = async (id, newStatus) => {
        const requestDocRef = doc(db, 'documentRequests', id);
        try {
            await updateDoc(requestDocRef, { status: newStatus });
            alert(`Request status updated to "${newStatus}"`);
        } catch (error) {
            console.error("Error updating document status: ", error);
            alert("Failed to update status.");
        }
    };

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        if (!newAnnouncement.title || !newAnnouncement.content) {
            alert("Please fill in both title and content.");
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(db, 'announcements'), {
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                date: serverTimestamp(),
                submittedAt: serverTimestamp()
            });
            setNewAnnouncement({ title: '', content: '' });
            alert("Announcement posted successfully!");
        } catch (error) {
            console.error("Error creating announcement: ", error);
            alert("Failed to post announcement.");
        } finally {
            setLoading(false);
        }
    };

    // ** NEW FUNCTION TO DELETE ANNOUNCEMENTS **
    const handleDeleteAnnouncement = async (id) => {
        // Ask for confirmation before deleting
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            const announcementDocRef = doc(db, 'announcements', id);
            try {
                await deleteDoc(announcementDocRef);
                alert("Announcement deleted successfully.");
            } catch (error) {
                console.error("Error deleting announcement: ", error);
                alert("Failed to delete announcement.");
            }
        }
    };

    const pendingRequestsCount = documentRequests.filter(req => req.status === 'Pending').length;
    const newReportsCount = incidentReports.length;
    const newSuggestionsCount = suggestions.length;

    return (
        <div className="container">
            <header className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <p>Welcome, Admin!</p>
            </header>

            <div className="stats-grid">
                <Card className="stat-card stat-card--pending"><h3>Pending Requests</h3><p>{pendingRequestsCount}</p></Card>
                <Card className="stat-card stat-card--reports"><h3>New Incident Reports</h3><p>{newReportsCount}</p></Card>
                <Card className="stat-card stat-card--suggestions"><h3>New Suggestions</h3><p>{newSuggestionsCount}</p></Card>
            </div>

            <div className="dashboard-content">
                <DashboardSection title="Manage Announcements">
                    <form onSubmit={handleCreateAnnouncement} className="announcement-form">
                        <h4>Create New Announcement</h4>
                        <div className="form-group"><input type="text" placeholder="Title" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} className="form-input"/></div>
                        <div className="form-group"><textarea placeholder="Content" value={newAnnouncement.content} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} className="form-input" rows="4"></textarea></div>
                        <Button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Announcement'}</Button>
                    </form>

                    {/* ** NEW SECTION TO LIST AND DELETE ANNOUNCEMENTS ** */}
                    <div className="announcement-list">
                        <h4>Existing Announcements</h4>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Title</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.map(ann => (
                                    <tr key={ann.id}>
                                        <td>{ann.date?.toDate().toLocaleDateString()}</td>
                                        <td>{ann.title}</td>
                                        <td className="actions-cell">
                                            <button onClick={() => handleDeleteAnnouncement(ann.id)} className="action-btn action-btn--deny">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardSection>

                <DashboardSection title="Manage Document Requests">
                    <table className="data-table">
                        <thead><tr><th>Date</th><th>Resident</th><th>Document</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {documentRequests.map(req => (
                                <tr key={req.id}>
                                    <td>{req.submittedAt?.toDate().toLocaleDateString()}</td>
                                    <td>{req.userEmail}</td>
                                    <td>{req.documentType}</td>
                                    <td><span className={`status-badge status--${req.status.toLowerCase().replace(' ', '-')}`}>{req.status}</span></td>
                                    <td className="actions-cell">
                                        <button onClick={() => handleUpdateRequestStatus(req.id, 'Ready for Pick-up')} className="action-btn action-btn--approve">Approve</button>
                                        <button onClick={() => handleUpdateRequestStatus(req.id, 'Denied')} className="action-btn action-btn--deny">Deny</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DashboardSection>
            </div>
        </div>
    );
}

