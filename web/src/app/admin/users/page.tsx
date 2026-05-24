'use client';
import { useState } from 'react';

const MOCK_USERS = [
  { id: 'dani-test', email: 'vip@test.com', name: 'Dani VIP', can_pay_later: true },
  { id: 'user-002', email: 'normal@gmail.com', name: 'Carlos López', can_pay_later: false },
  { id: 'user-003', email: 'empresa@b2b.es', name: 'Suministros Industriales', can_pay_later: true },
];

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);

  const toggleVipStatus = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, can_pay_later: newStatus } : u));
    console.log(`Usuario ${userId} VIP status cambiado a: ${newStatus}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-4xl">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Directorio de Clientes VIP</h1>
        <p className="text-sm text-gray-500 mt-1">Activa la facturación diferida para permitir pagos a plazos (B2B).</p>
      </div>
      <div className="p-0">
        <ul className="divide-y divide-gray-100">
          {users.map(user => (
            <li key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{user.name}</span>
                <span className="text-sm text-gray-500">{user.email} (ID: {user.id})</span>
              </div>
              <button
                onClick={() => toggleVipStatus(user.id, user.can_pay_later)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${user.can_pay_later ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.can_pay_later ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
