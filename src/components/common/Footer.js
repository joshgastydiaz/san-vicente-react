import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p>&copy; {new Date().getFullYear()} Barangay San Vicente, San Narciso, Quezon. All Rights Reserved.</p>
                    <p className="text-sm text-gray-400 mt-2">Developed by Group 3 - ITS122L</p>
                </div>
            </div>
        </footer>
    );
}
