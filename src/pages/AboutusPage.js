import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';

export default function AboutusPage() {
    const [officials, setOfficials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockOfficials = [
            { name: "Hon. Joyal U. Esguerra", position: "Barangay Captain" },
            { name: "Mrs. Lida A. Reyes", position: "Barangay Secretary" },
            { name: "Mr. Juan Dela Cruz", position: "Kagawad" },
            { name: "Ms. Maria Clara", position: "Kagawad" },
            { name: "Mr. Pedro Penduko", position: "Kagawad" },
            { name: "Ms. Gabriela Silang", position: "SK Chairperson" },
        ];
        setOfficials(mockOfficials);
        setLoading(false);
    }, []);

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-4xl font-bold text-center mb-12">About Barangay San Vicente</h2>
            
            <Card className="mb-8">
                <h3 className="text-2xl font-bold mb-4">History</h3>
                <p className="text-gray-700">
                    Barangay San Vicente, located in the heart of San Narciso, Quezon, has a rich history rooted in community and resilience. Established in [Year], it has grown from a small settlement into a vibrant community. The barangay is named after its patron saint, St. Vincent Ferrer, whose feast is celebrated annually with much devotion and festivity. Over the years, the residents have shown remarkable spirit in overcoming challenges and working together for progress.
                </p>
            </Card>

            <Card>
                <h3 className="text-2xl font-bold mb-4 text-center">Barangay Officials</h3>
                {loading ? (
                    <p>Loading officials...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {officials.map((official, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg text-center shadow-sm">
                                <p className="font-bold text-lg text-gray-800">{official.name}</p>
                                <p className="text-blue-600">{official.position}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}