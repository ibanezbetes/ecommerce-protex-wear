"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Protex Wear Backoffice</h1>

        <Authenticator>
          {({ signOut, user }) => (
            <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-green-600">Welcome, {user?.username}</h2>
              <p className="text-gray-600">You are successfully logged in.</p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </Authenticator>
      </div>
    </main>
  );
}
