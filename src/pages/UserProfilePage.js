import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, query, where, onSnapshot, doc, getDoc, orderBy } from 'firebase/firestore';
import { Card as ProfileCard } from '../components/common/Card';

const StatusBadge = ({ status }) => {
    let colorClasses = 'bg-gray-100 text-gray-800';
    if (status === 'Pending') colorClasses = 'bg-yellow-100 text-yellow-800';
    if (status === 'Ready for Pick-up') colorClasses = 'bg-green-100 text-green-800';
    if (status === 'Denied') colorClasses = 'bg-red-100 text-red-800';

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
            {status}
        </span>
    );
};

export default function UserProfilePage({ user }) {
    const [userInfo, setUserInfo] = useState(null);
    const [requests, setRequests] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const userDocRef = doc(db, 'users', user.uid);
        const getUserInfo = async () => {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                setUserInfo(docSnap.data());
            }
        };
        getUserInfo();

        const requestsQuery = query(collection(db, 'documentRequests'), where('userId', '==', user.uid), orderBy('submittedAt', 'desc'));
        const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
            setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const reportsQuery = query(collection(db, 'incidentReports'), where('userId', '==', user.uid), orderBy('submittedAt', 'desc'));
        const unsubscribeReports = onSnapshot(reportsQuery, (snapshot) => {
            setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        
        setLoading(false);

        return () => {
            unsubscribeRequests();
            unsubscribeReports();
        };
    }, [user]);

    if (loading || !userInfo) {
        return <div className="text-center p-8">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-4xl font-bold text-center mb-12">My Profile</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <ProfileCard>
                        <h3 className="text-2xl font-bold mb-4">My Information</h3>
                        <p><strong>Name:</strong> {userInfo.fullName}</p>
                        <p><strong>Email:</strong> {userInfo.email}</p>
                        <p><strong>Address:</strong> {userInfo.address}</p>
                    </ProfileCard>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <ProfileCard>
                        <h3 className="text-2xl font-bold mb-4">My Document Requests</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left py-2 px-4">Date</th>
                                        <th className="text-left py-2 px-4">Document Type</th>
                                        <th className="text-left py-2 px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.length > 0 ? requests.map(req => (
                                        <tr key={req.id} className="border-b">
                                            <td className="py-2 px-4">{req.submittedAt?.toDate().toLocaleDateString()}</td>
                                            <td className="py-2 px-4">{req.documentType}</td>
                                            <td className="py-2 px-4"><StatusBadge status={req.status} /></td>
                                        </tr>
                                    )) : <tr><td colSpan="3" className="text-center py-4">No document requests found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </ProfileCard>
                    <ProfileCard>
                        <h3 className="text-2xl font-bold mb-4">My Incident Reports</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left py-2 px-4">Date</th>
                                        <th className="text-left py-2 px-4">Description</th>
                                        <th className="text-left py-2 px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.length > 0 ? reports.map(rep => (
                                        <tr key={rep.id} className="border-b">
                                            <td className="py-2 px-4">{rep.submittedAt?.toDate().toLocaleDateString()}</td>
                                            <td className="py-2 px-4 truncate max-w-xs">{rep.description}</td>
                                            <td className="py-2 px-4"><StatusBadge status={rep.status} /></td>
                                        </tr>
                                    )) : <tr><td colSpan="3" className="text-center py-4">No incident reports found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </ProfileCard>
                </div>
            </div>
        </div>
    );
}