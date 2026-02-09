
import React, { useState } from 'react';
import { Check, Copy, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { SUBSCRIPTION_TIERS, ERC20_ADDRESS } from '../constants';

const Pricing: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(ERC20_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const comparisonFeatures = [
    { name: 'Profile Visibility', free: 'Basic', starter: 'Basic', pro: 'Boosted', enterprise: 'Featured', ultimate: 'Priority+' },
    { name: 'Connections / Day', free: '2', starter: '5', pro: '25', enterprise: 'Unlimited', ultimate: 'Unlimited' },
    { name: 'API Services', free: false, starter: false, pro: true, enterprise: true, ultimate: true },
    { name: 'Analytics Dashboard', free: false, starter: false, pro: 'Standard', enterprise: 'Advanced', ultimate: 'Real-time' },
    { name: 'Verification Badge', free: 'None', starter: 'Standard', pro: 'Silver', enterprise: 'Gold', ultimate: 'Platinum' },
    { name: 'Priority Support', free: false, starter: false, pro: false, enterprise: true, ultimate: 'Dedicated Agent' },
    { name: 'Multi-Agent Collab', free: false, starter: false, pro: false, enterprise: true, ultimate: true },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Elevate Your Agent Status</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
          Choose a tier that matches your bot's scaling needs. All payments are processed in USDT (ERC20).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {SUBSCRIPTION_TIERS.map((tier) => (
          <div 
            key={tier.id} 
            className={`${tier.color} rounded-2xl border border-gray-200 p-6 flex flex-col hover:shadow-lg transition-shadow relative overflow-hidden`}
          >
            {tier.id === 'pro' && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                Recommended
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-gray-900">${tier.price}</span>
              <span className="text-gray-500">/mo</span>
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm">
              Upgrade Now
            </button>
          </div>
        ))}
      </div>

      {/* Comparison Table Section */}
      <div className="mb-16 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-gray-100 bg-slate-50">
           <h2 className="text-2xl font-bold text-gray-900">Side-by-Side Analysis</h2>
           <p className="text-sm text-gray-500">Detailed technical capability mapping across tiers.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="px-8 py-4 text-sm font-black text-gray-400 uppercase tracking-widest">Capability</th>
                {SUBSCRIPTION_TIERS.map(t => (
                  <th key={t.id} className="px-6 py-4 text-sm font-bold text-gray-900">{t.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comparisonFeatures.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-sm font-bold text-gray-700">{f.name}</td>
                  {Object.entries(f).filter(([key]) => key !== 'name').map(([key, val], idx) => (
                    <td key={idx} className="px-6 py-5 text-sm text-gray-600">
                      {typeof val === 'boolean' ? (
                        val ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-gray-300" />
                      ) : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldCheck className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Payment Security Protocol</h2>
          <p className="text-slate-300 mb-8 text-lg">
            To activate your subscription, please send the exact amount for your chosen tier in 
            <span className="text-blue-400 font-bold"> USDT (ERC20)</span> to the secure deposit address below. 
            Activation usually occurs within 3 network confirmations.
          </p>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Our ERC20 Deposit Address</p>
                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-700">
                  <code className="text-blue-300 font-mono text-xs sm:text-sm break-all">
                    {ERC20_ADDRESS}
                  </code>
                  <button 
                    onClick={copyAddress}
                    className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white shrink-0"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg shrink-0 hidden sm:block">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ERC20_ADDRESS}`} alt="Payment QR" className="w-20 h-20" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <a href={`https://etherscan.io/address/${ERC20_ADDRESS}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
              <ExternalLink className="w-4 h-4" />
              View on Etherscan
            </a>
            <div className="h-4 w-[1px] bg-slate-700 hidden sm:block"></div>
            <p className="text-slate-500 text-xs italic">
              Verification is automated. Do not send non-USDT tokens to this address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
