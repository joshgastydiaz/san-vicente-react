import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    addDoc,
    deleteDoc,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const DashboardSection = ({ title, children }) => (
    <Card>
        <h3 className="dashboard-section__title">{title}</h3>
        <div className="dashboard-section__content">{children}</div>
    </Card>
);

export default function AdminDashboardPage() {
    const [documentRequests, setDocumentRequests] = useState([]);
    const [incidentReports, setIncidentReports] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const setupCollection = (collectionName, setter, sortBySubmittedAt = true) => {
            const colRef = collection(db, collectionName);
            const q = sortBySubmittedAt ? query(colRef, orderBy('submittedAt', 'desc')) : colRef;
            return onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setter(data);
            });
        };

        const unsubDoc = setupCollection('documentRequests', setDocumentRequests);
        const unsubReports = setupCollection('incidentReports', setIncidentReports);
        const unsubSugg = setupCollection('suggestions', setSuggestions);
        const unsubAnn = setupCollection('announcements', setAnnouncements, false);

        return () => {
            unsubDoc();
            unsubReports();
            unsubSugg();
            unsubAnn();
        };
    }, []);

    const handleUpdateRequestStatus = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, 'documentRequests', id), { status: newStatus });
            alert(`Request status updated to "${newStatus}"`);
        } catch (error) {
            console.error("Error updating document status:", error);
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
                ...newAnnouncement,
                date: serverTimestamp(),
                submittedAt: serverTimestamp()
            });
            setNewAnnouncement({ title: '', content: '' });
            alert("Announcement posted successfully!");
        } catch (error) {
            console.error("Error creating announcement:", error);
            alert("Failed to post announcement.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            try {
                await deleteDoc(doc(db, 'announcements', id));
                alert("Announcement deleted successfully.");
            } catch (error) {
                console.error("Error deleting announcement:", error);
                alert("Failed to delete announcement.");
            }
        }
    };

    const formatDate = (dateField) => {
        if (dateField instanceof Date) return dateField.toLocaleDateString();
        if (dateField?.toDate instanceof Function) return dateField.toDate().toLocaleDateString();
        return '—';
    };

    const fallbackEmail = (data) => data?.userEmail || data?.email || '—';

    return (
        <div className="container">
            <header className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <p>Welcome, Admin!</p>
            </header>

            <div className="stats-grid">
                <Card className="stat-card stat-card--pending">
                    <h3>Pending Requests</h3>
                    <p>{documentRequests.filter(req => req.status === 'Pending').length}</p>
                </Card>
                <Card className="stat-card stat-card--reports">
                    <h3>Incident Reports</h3>
                    <p>{incidentReports.length}</p>
                </Card>
                <Card className="stat-card stat-card--suggestions">
                    <h3>Suggestions</h3>
                    <p>{suggestions.length}</p>
                </Card>
            </div>

            <div className="dashboard-content">
                <DashboardSection title="Manage Announcements">
                    <form onSubmit={handleCreateAnnouncement} className="announcement-form">
                        <h4>Create New Announcement</h4>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Content"
                                value={newAnnouncement.content}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                className="form-input"
                                rows="4"
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Posting...' : 'Post Announcement'}
                        </Button>
                    </form>

                    <div className="announcement-list">
                        <h4>Existing Announcements</h4>
                        <table className="data-table">
                            <thead>
                                <tr><th>Date</th><th>Title</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {announcements.map(ann => (
                                    <tr key={ann.id}>
                                        <td>{formatDate(ann.date)}</td>
                                        <td>{ann.title}</td>
                                        <td>
                                            <button onClick={() => handleDeleteAnnouncement(ann.id)} className="action-btn action-btn--deny">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardSection>

               <DashboardSection title="Document Requests">
    <table className="data-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Resident</th>
                <th>Document</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {documentRequests.map(req => (
                <tr key={req.id}>
                    <td>{formatDate(req.submittedAt)}</td>
                    <td>{fallbackEmail(req)}</td>
                    <td>{req.documentType || '—'}</td> {/* ← SHOWS DOC TYPE */}
                    <td>{req.purpose || '—'}</td>      {/* ← SHOWS PURPOSE */}
                    <td>
                        <span className={`status-badge status--${req.status?.toLowerCase().replace(' ', '-')}`}>
                            {req.status || '—'}
                        </span>
                    </td>
                    <td className="actions-cell">
                        {req.status === 'Pending' && (
                            <>
                                <button
                                    onClick={() => handleUpdateRequestStatus(req.id, 'Ready for Pick-up')}
                                    className="action-btn action-btn--approve"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleUpdateRequestStatus(req.id, 'Denied')}
                                    className="action-btn action-btn--deny"
                                >
                                    Deny
                                </button>
                            </>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</DashboardSection>


              <DashboardSection title="Incident Reports">
    <table className="data-table">
        <thead>
            <tr><th>Date</th><th>Resident</th><th>Location</th><th>Description</th><th>Status</th></tr>
        </thead>
        <tbody>
            {incidentReports.map(report => (
                <tr key={report.id}>
                    <td>{formatDate(report.submittedAt)}</td>
                    <td>{fallbackEmail(report)}</td>
                    <td>{report.location || '—'}</td>
                    <td>{report.description || '—'}</td>
                </tr>
            ))}
        </tbody>
    </table>
</DashboardSection>


                <DashboardSection title="Suggestions">
                    <table className="data-table">
                        <thead>
                            <tr><th>Date</th><th>Resident</th><th>Subject</th><th>Suggestion</th></tr>
                        </thead>
                        <tbody>
                            {suggestions.map(suggestion => (
                                <tr key={suggestion.id}>
                                    <td>{formatDate(suggestion.submittedAt)}</td>
                                    <td>{fallbackEmail(suggestion)}</td>
                                    <td>{suggestion.subject || '—'}</td>
                                    <td>{suggestion.suggestion || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DashboardSection>
            </div>
        </div>
    );
}