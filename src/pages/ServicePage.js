import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

// Icons can be moved to a dedicated icons file
const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ReportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SuggestionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
);

export default function ServicesPage({ setPage, loggedIn }) {
    const handleServiceClick = (servicePage) => {
        if (loggedIn) {
            setPage(servicePage);
        } else {
            alert("You must be logged in to access this service. Please login or register.");
            setPage('login');
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-4xl font-bold text-center mb-2">Barangay Services</h2>
            <p className="text-center text-gray-600 mb-12">Access various barangay services online for your convenience.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                    <DocumentIcon />
                    <h3 className="text-2xl font-bold mb-2">Request Documents</h3>
                    <p className="text-gray-600 mb-4">Request for Barangay Clearance, Certificate of Indigency, and more.</p>
                    <Button onClick={() => handleServiceClick('requestDocument')} className="w-full">Proceed</Button>
                </Card>
                <Card className="text-center">
                    <ReportIcon />
                    <h3 className="text-2xl font-bold mb-2">Report Incident</h3>
                    <p className="text-gray-600 mb-4">Safely report disturbances, violations, or other non-emergency incidents.</p>
                    <Button onClick={() => handleServiceClick('reportIncident')} className="w-full">Proceed</Button>
                </Card>
                <Card className="text-center">
                    <SuggestionIcon />
                    <h3 className="text-2xl font-bold mb-2">Suggestions</h3>
                    <p className="text-gray-600 mb-4">Submit feedback, concerns, or ideas for community improvement.</p>
                    <Button onClick={() => handleServiceClick('submitSuggestion')} className="w-full">Proceed</Button>
                </Card>
            </div>
        </div>
    );
};
