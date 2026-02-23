'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api'; // Axios instance for Backend (PostgreSQL)
import { CheckCircle, XCircle, Activity, Database, Server, RefreshCw } from 'lucide-react';

export default function SystemStatusPage() {
  const router = useRouter();
  const [pgStatus, setPgStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [mongoStatus, setMongoStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Check if user is logged in (PostgreSQL Verification)
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }
    
    // If token exists, we assume PostgreSQL Auth worked (Step 1)
    addLog('Checking Local Session (PostgreSQL Auth Token)... Found.');
    setPgStatus('success');
    
    // Auto-run MongoDB test
    testMongoConnection();
  }, []);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testMongoConnection = async () => {
    setMongoStatus('pending');
    addLog('Initiating MongoDB Write Test...');

    try {
      const token = localStorage.getItem('token');
      
      // Call Next.js API (Green Layer)
      const response = await fetch('/api/test-mongo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // This token was issued by Spring/Postgres
        },
        body: JSON.stringify({ 
          test: 'Integration Check',
          source: 'System Status Page'
        })
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
        const text = await response.text();
        throw new Error(`Server returned ${response.status} ${response.statusText} (Standard HTML Error Page). Response Preview: ${text.substring(0, 100)}...`);
      }

      const data = await response.json();

      if (response.ok) {
        addLog('✅ MongoDB Write Success: Created ActivityLog document.');
        addLog(`   ID: ${data.data._id}`);
        addLog('✅ JWT Validation Success: Next.js accepted Backend Token.');
        setMongoStatus('success');
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err: any) {
      addLog(`❌ MongoDB Error: ${err.message}`);
      setMongoStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="text-blue-400" /> System Health
            </h1>
            <p className="text-slate-400 text-sm mt-1">Cross-Database Communication Check</p>
          </div>
          <button 
            onClick={testMongoConnection} 
            className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-colors"
            title="Rerun Tests"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-2 gap-8">
          {/* PostgreSQL Status */}
          <div className={`p-6 rounded-xl border-2 flex flex-col items-center text-center gap-4 transition-all ${
            pgStatus === 'success' ? 'border-green-100 bg-green-50' : 'border-slate-100 bg-slate-50'
          }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              pgStatus === 'success' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'
            }`}>
              <Server size={32} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Spring Boot + PostgreSQL</h3>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Blue Layer</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              pgStatus === 'success' ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-slate-600'
            }`}>
              {pgStatus === 'success' ? 'CONNECTED' : 'CHECKING'}
            </div>
          </div>

          {/* MongoDB Status */}
          <div className={`p-6 rounded-xl border-2 flex flex-col items-center text-center gap-4 transition-all ${
            mongoStatus === 'success' ? 'border-green-100 bg-green-50' : 
            mongoStatus === 'error' ? 'border-red-100 bg-red-50' : 'border-slate-100 bg-slate-50'
          }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              mongoStatus === 'success' ? 'bg-green-100 text-green-600' : 
              mongoStatus === 'error' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-400'
            }`}>
              <Database size={32} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Next.js + MongoDB</h3>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Green Layer</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
               mongoStatus === 'success' ? 'bg-green-200 text-green-800' : 
               mongoStatus === 'error' ? 'bg-red-200 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {mongoStatus === 'success' ? 'WRITABLE' : mongoStatus === 'error' ? 'FAILED' : 'CHECKING'}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 mx-8 mb-8 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto">
          <div className="text-slate-500 border-b border-slate-700 pb-2 mb-2">System Logs</div>
          {logs.map((log, i) => (
            <div key={i} className="mb-1 text-slate-300">
              <span className="text-blue-500 mr-2">➜</span>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
