import React, { useState } from 'react';

/**
 * Development Authentication Configuration Component
 * Shows current Amplify configuration status and provides testing utilities
 * Only shown in development mode
 */
function DevAuthConfig() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const amplifyConfigured = !!(
    process.env.VITE_USER_POOL_ID && 
    process.env.VITE_USER_POOL_CLIENT_ID
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-12'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full p-3 flex items-center justify-center text-gray-600 hover:text-gray-800 ${
            isExpanded ? 'border-b border-gray-200' : ''
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Auth Config Status</h3>
            
            {/* Configuration Status */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span>Amplify Configured:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  amplifyConfigured 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {amplifyConfigured ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>User Pool ID:</span>
                <span className="text-xs text-gray-600 truncate max-w-32">
                  {process.env.VITE_USER_POOL_ID || 'Not set'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Client ID:</span>
                <span className="text-xs text-gray-600 truncate max-w-32">
                  {process.env.VITE_USER_POOL_CLIENT_ID || 'Not set'}
                </span>
              </div>
            </div>

            {/* Instructions */}
            {!amplifyConfigured && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-xs text-yellow-800 mb-2">
                  <strong>To enable real Amplify Auth:</strong>
                </p>
                <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Run <code className="bg-yellow-100 px-1 rounded">npx ampx sandbox</code></li>
                  <li>Copy the generated config values</li>
                  <li>Set environment variables in .env.local</li>
                </ol>
              </div>
            )}

            {/* Test Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-xs text-blue-800 mb-2">
                <strong>Demo Credentials:</strong>
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <div>Admin: admin@demo.com</div>
                <div>Customer: cliente@demo.com</div>
                <div>Password: TempPass123!</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('admin@demo.com');
                  alert('Admin email copied!');
                }}
                className="w-full text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                Copy Admin Email
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('TempPass123!');
                  alert('Password copied!');
                }}
                className="w-full text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                Copy Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DevAuthConfig;