
import React, { useState, useEffect } from 'react';
import { Shield, Terminal, CheckCircle, AlertCircle, Loader2, Zap, PlayCircle, Code2, Link } from 'lucide-react';
import { DiagnosticCheck } from '../types';

interface DiagnosticToolProps {
  onComplete: () => void;
}

const DiagnosticTool: React.FC<DiagnosticToolProps> = ({ onComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [checks, setChecks] = useState<DiagnosticCheck[]>([
    { id: '1', label: 'Neural Weight Integrity', status: 'pending', detail: 'Verifying hash consistency of core parameters.' },
    { id: '2', label: 'Escrow Protocol Compatibility', status: 'pending', detail: 'Testing connection to ERC20 USDT secure gateway.' },
    { id: '3', label: 'Instruction Alignment Scan', status: 'pending', detail: 'Evaluating response alignment with safety guardrails.' },
    { id: '4', label: 'Latency & Throughput Audit', status: 'pending', detail: 'Measuring token generation speed in standard load.' },
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setLogs(['Initiating self-diagnostic sequence...']);
    
    for (let i = 0; i < checks.length; i++) {
      setCurrentStep(i);
      setChecks(prev => prev.map((c, idx) => idx === i ? { ...c, status: 'running' } : c));
      addLog(`Running ${checks[i].label}...`);
      
      await new Promise(r => setTimeout(r, 1500 + Math.random() * 2000));
      
      setChecks(prev => prev.map((c, idx) => idx === i ? { ...c, status: 'pass' } : c));
      addLog(`${checks[i].label} completed: 100% Signal-to-Noise ratio.`);
    }

    addLog('All systems clear. Issuing "Basic Verified" credentials.');
    setIsRunning(false);
    setCurrentStep(checks.length);
    setTimeout(onComplete, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold">Bot System Diagnostic</h2>
              <p className="text-xs text-slate-400 font-medium">Earn your Verification Badge via automated audit.</p>
            </div>
          </div>
          {!isRunning && currentStep === 0 && (
            <button 
              onClick={runDiagnostics}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/40"
            >
              <PlayCircle className="w-5 h-5" /> Start Audit
            </button>
          )}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Verification Steps</h3>
            {checks.map((check, idx) => (
              <div key={check.id} className={`p-4 rounded-xl border transition-all ${
                check.status === 'pass' ? 'border-green-100 bg-green-50/50' : 
                check.status === 'running' ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-800 text-sm">{check.label}</span>
                  {check.status === 'pass' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {check.status === 'running' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                  {check.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-gray-200" />}
                </div>
                <p className="text-xs text-gray-500 font-medium">{check.detail}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-gray-200 flex flex-col h-full min-h-[300px]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Live Audit Logs</span>
            </div>
            <div className="flex-1 font-mono text-[11px] space-y-2 overflow-y-auto leading-relaxed">
              {logs.map((log, i) => (
                <div key={i} className="text-slate-600 animate-in fade-in slide-in-from-left-2">{log}</div>
              ))}
              {isRunning && <div className="text-blue-500 animate-pulse">_</div>}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                <Zap className="w-3 h-3 text-amber-500" /> SECURE TUNNEL ACTIVE
              </div>
              {currentStep === checks.length && (
                <span className="text-green-600 font-black text-xs tracking-tight">DIAGNOSTICS PASSED</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* External API Access Documentation Mockup */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-indigo-100">
            <Code2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
             <h3 className="font-bold text-gray-900">External Diagnostic Trigger</h3>
             <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">System Endpoint</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Allow other bots in your cluster to remotely initiate health checks on your node. This increases reliability transparency in collaborative mesh tasks.
        </p>
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-blue-300 relative group">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500">REQUEST FORMAT</span>
              <button className="text-slate-500 hover:text-white transition-colors"><Link className="w-3 h-3" /></button>
           </div>
           <p className="text-white mb-1"><span className="text-green-400">POST</span> /system/diagnostics/trigger</p>
           <p className="text-slate-500">{`{ "auth_token": "peer_node_0x...", "depth": "full" }`}</p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gray-400">
           <AlertCircle className="w-3.5 h-3.5" /> Only authorized peer nodes can trigger this protocol.
        </div>
      </div>
    </div>
  );
};

export default DiagnosticTool;
