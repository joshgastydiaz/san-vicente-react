import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';


const iconSize = "h-8 w-8"; 

const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${iconSize} mx-auto mb-3 text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ReportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${iconSize} mx-auto mb-3 text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SuggestionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${iconSize} mx-auto mb-3 text-yellow-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="services-page">
            <h2 className="services-title">Barangay Services</h2>
            <p className="services-subtitle">Access various barangay services online for your convenience.</p>

            <div className="services-grid">
                <Card className="service-card">
                    <DocumentIcon />
                    <h3 className="service-heading">Request Documents</h3>
                    <p className="service-description">
                        Request for Barangay Clearance, Certificate of Indigency, and more.
                    </p>
                    <Button onClick={() => handleServiceClick('requestDocument')} className="w-full">Proceed</Button>
                </Card>

                <Card className="service-card">
                    <ReportIcon />
                    <h3 className="service-heading">Report Incident</h3>
                    <p className="service-description">
                        Safely report disturbances, violations, or other non-emergency incidents.
                    </p>
                    <Button onClick={() => handleServiceClick('reportIncident')} className="w-full">Proceed</Button>
                </Card>

                <Card className="service-card">
                    <SuggestionIcon />
                    <h3 className="service-heading">Suggestions</h3>
                    <p className="service-description">
                        Submit feedback, concerns, or ideas for community improvement.
                    </p>
                    <Button onClick={() => handleServiceClick('submitSuggestion')} className="w-full">Proceed</Button>
                </Card>
            </div>
        </div>
    );
}
