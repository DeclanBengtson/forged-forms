'use client';

import { useState } from 'react';
import Link from 'next/link';

const features = [
  {
    id: 'time-money',
    name: 'Time = Money',
    icon: '💰',
    title: 'TIME IS MONEY',
    subtitle: 'Stop building, start billing',
    description: 'Every hour you spend building form backends is an hour you\'re not billing clients. Use that time for high-value work instead. Your hourly rate just became a lot more valuable.',
    mockup: (
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-gray-500 text-sm">Time Tracker</span>
        </div>
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Form Backend Project</h3>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 text-sm mb-2">❌ Building Your Own</h4>
            <div className="space-y-2 text-sm text-red-800">
              <div className="flex justify-between">
                <span>Server setup</span>
                <span>4 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Database design</span>
                <span>3 hours</span>
              </div>
              <div className="flex justify-between">
                <span>API endpoints</span>
                <span>6 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Email integration</span>
                <span>4 hours</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total: 17 hours</span>
                <span>$1,700</span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 text-sm mb-2">✅ Using ForgedForms</h4>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex justify-between">
                <span>Setup time</span>
                <span>5 minutes</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Extra billing time</span>
                <span>+16.9 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'no-backend',
    name: 'No Backend Needed',
    icon: '🚀',
    title: 'NO BACKEND REQUIRED',
    subtitle: 'Frontend-only setup',
    description: 'Perfect for indie developers and freelancers who want to focus on what they do best. No servers to manage, no databases to maintain, no DevOps headaches. Just beautiful frontends that actually work.',
    mockup: (
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-gray-500 text-sm">VS Code</span>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm">
          <div className="text-green-400 mb-2">{'// Your entire backend 👇'}</div>
          <div className="text-gray-300">
            <span className="text-blue-400">&lt;form</span><br />
            <span className="text-gray-300">  </span><span className="text-yellow-300">action=</span><span className="text-green-300">&quot;https://forgedforms.com/f/xyz&quot;</span><br />
            <span className="text-gray-300">  </span><span className="text-yellow-300">method=</span><span className="text-green-300">&quot;post&quot;</span><br />
            <span className="text-blue-400">&gt;</span><br />
            <span className="text-gray-300">  </span><span className="text-gray-500">{'/* Your form fields */'}</span><br />
            <span className="text-blue-400">&lt;/form&gt;</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
          <span>✅</span>
          <span>Deploy anywhere. Works everywhere.</span>
        </div>
      </div>
    )
  },
  {
    id: 'client-management',
    name: 'Multiple Clients',
    icon: '👥',
    title: 'CLIENT MANAGEMENT',
    subtitle: 'Organize all your projects',
    description: 'Managing forms for multiple clients? Create separate forms for each project, track submissions individually, and keep everything organized. Your clients will love the professional touch.',
    mockup: (
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-gray-500 text-sm">Dashboard</span>
        </div>
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Acme Corp Contact</p>
                <p className="text-gray-600 text-xs">23 submissions this month</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">StartupXYZ Newsletter</p>
                <p className="text-gray-600 text-xs">156 subscribers added</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Agency Portfolio</p>
                <p className="text-gray-600 text-xs">8 new leads today</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button className="text-blue-600 text-sm font-medium">+ Add New Form</button>
        </div>
      </div>
    )
  }
];

export default function InteractiveFeaturesComponent() {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <div>
      {/* Feature Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setActiveFeature(feature)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              activeFeature.id === feature.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span>{feature.icon}</span>
            <span>{feature.name}</span>
          </button>
        ))}
      </div>

      {/* Feature Content */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start min-h-[600px]">
        {/* Left Content */}
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">{activeFeature.icon}</span>
            </div>
          </div>
          
          <h3 className="text-sm font-bold text-blue-400 tracking-wider mb-2">
            {activeFeature.title}
          </h3>
          
          <h4 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {activeFeature.subtitle}
          </h4>
          
          <div className="flex-1 mb-8">
            <p className="text-gray-300 text-lg leading-relaxed">
              {activeFeature.description}
            </p>
          </div>
          
          <Link
            href="/documentation"
            className="inline-flex items-center gap-2 bg-transparent border border-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 self-start"
          >
            See Documentation
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Right Mockup */}
        <div className="lg:order-last h-full">
          <div className="relative h-full flex items-center justify-center">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
            <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
              <div className="max-h-full overflow-auto">
                {activeFeature.mockup}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 