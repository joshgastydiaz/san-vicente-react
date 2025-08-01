import React from 'react';

export default function ContactPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden shadow-xl mt-10 mx-4 md:mx-12 lg:mx-24 rounded-2xl">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32 px-6 sm:px-8 lg:px-12 text-center">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">Contact Us!  </span>
                            <span className="block text-blue-600">Barangay San Vicente</span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                            We’re here to help. For any questions, assistance, or concerns regarding services and community matters in Barangay San Vicente, Quezon Province, please reach out through the following:
                        </p>
                        <div className="mt-8 text-gray-700 space-y-3 text-base max-w-md mx-auto">
                            <p><strong>📍 Address:</strong> Barangay Hall, San Vicente, Gumaca, Quezon, Philippines</p>
                            <p><strong>📧 Email:</strong> brgy.sanvicente.quezon@gmail.com</p>
                            <p><strong>📞 Phone:</strong> (042) 123-4567</p>
                            <p><strong>⏰ Office Hours:</strong> Monday to Friday, 8:00 AM – 5:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="mt-12 px-4 md:px-12 lg:px-24 pb-12">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                    <iframe
                        title="Barangay San Vicente Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.719662186002!2d122.10135967494197!3d13.946381492273335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd5150db8e6319%3A0xe0a5f96e190f5f64!2sSan%20Vicente%2C%20Gumaca%2C%20Quezon!5e0!3m2!1sen!2sph!4v1694504920792!5m2!1sen!2sph"
                        width="100%"
                        height="450"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-[450px] border-0"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
