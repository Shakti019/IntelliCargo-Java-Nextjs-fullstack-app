'use client';

import { useState } from 'react';

export default function TestApiPage() {
    const [token, setToken] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const testGetCompany = async () => {
        setLoading(true);
        setError('');
        setResponse(null);

        try {
            const tokenToUse = token || localStorage.getItem('token') || '';
            console.log('Testing with token:', tokenToUse);

            const res = await fetch('http://localhost:8080/api/companies/my-company', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenToUse}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', res.status);
            console.log('Response headers:', res.headers);

            const text = await res.text();
            console.log('Response body:', text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                data = text;
            }

            setResponse({
                status: res.status,
                statusText: res.statusText,
                headers: Object.fromEntries(res.headers.entries()),
                body: data
            });

        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const testCreateCompany = async () => {
        setLoading(true);
        setError('');
        setResponse(null);

        try {
            const tokenToUse = token || localStorage.getItem('token') || '';
            const testData = {
                name: 'Test Company ' + new Date().getTime(),
                registrationNumber: 'REG' + new Date().getTime(),
                country: 'India',
                status: 'Active'
            };

            console.log('Creating company with data:', testData);

            const res = await fetch('http://localhost:8080/api/companies', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenToUse}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });

            console.log('Response status:', res.status);

            const text = await res.text();
            console.log('Response body:', text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                data = text;
            }

            setResponse({
                status: res.status,
                statusText: res.statusText,
                headers: Object.fromEntries(res.headers.entries()),
                body: data
            });

        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">API Test Page</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Configuration</h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Bearer Token (leave empty to use localStorage)
                        </label>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Enter token or leave empty"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Current localStorage token: {localStorage.getItem('token') ? 'exists' : 'not found'}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={testGetCompany}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading ? 'Testing...' : 'GET /api/companies/my-company'}
                        </button>
                        
                        <button
                            onClick={testCreateCompany}
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {loading ? 'Testing...' : 'POST /api/companies'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
                        <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
                    </div>
                )}

                {response && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Response</h2>
                        
                        <div className="mb-4">
                            <span className={`inline-block px-3 py-1 rounded font-semibold ${
                                response.status >= 200 && response.status < 300 ? 'bg-green-100 text-green-800' :
                                response.status >= 400 ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {response.status} {response.statusText}
                            </span>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Headers:</h3>
                            <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                                {JSON.stringify(response.headers, null, 2)}
                            </pre>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Body:</h3>
                            <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                                {JSON.stringify(response.body, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                        <li>Make sure your backend server is running on http://localhost:8080</li>
                        <li>Login first to get a valid token</li>
                        <li>Click "GET" to check if you have a company</li>
                        <li>Click "POST" to create a test company</li>
                        <li>Check the browser console for detailed logs</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
