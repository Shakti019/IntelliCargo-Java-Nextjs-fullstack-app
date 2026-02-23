'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
    const router = useRouter();
    const [hasCompany, setHasCompany] = useState(false); 
    const [companyName, setCompanyName] = useState('');
    const [username, setUsername] = useState('User');

    useEffect(() => {
        const storedUser = localStorage.getItem('username');
        if (storedUser) setUsername(storedUser);
        checkCompanyStatus();
    }, []);

    const checkCompanyStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:8080/api/companies/my-company', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setHasCompany(true);
                setCompanyName(data.name);
            } else {
                setHasCompany(false);
            }
        } catch (err) {
            console.error('Error checking company:', err);
            setHasCompany(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/auth');
    };

    return (
        <header className="w-full bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex justify-between items-center">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {/* Company Status */}
                    {!hasCompany ? (
                        <button 
                            onClick={() => router.push('/create-company')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm"
                        >
                            Create Company
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push('/create-company')}
                            className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl hover:bg-green-100 transition-colors cursor-pointer"
                        >
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="font-medium text-sm text-green-700">{companyName}</span>
                        </button>
                    )}

                    {/* Notification Bell */}
                    <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">{username}</p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {username.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    {/* Logout */}
                    <button 
                        onClick={handleLogout}
                        className="text-red-600 hover:bg-red-50 font-medium transition-colors px-4 py-2 rounded-xl text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;