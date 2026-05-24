import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold font-mono tracking-tight text-indigo-400">ProtexWear Admin</h2>
        </div>
        <nav className="mt-2 space-y-1 px-4">
          <Link href="/admin/orders" className="block px-4 py-3 hover:bg-slate-800 rounded-md transition-colors">
            📦 Pedidos
          </Link>
          <Link href="/admin/users" className="block px-4 py-3 hover:bg-slate-800 rounded-md transition-colors">
            👥 Clientes VIP
          </Link>
          <Link href="/admin/pricing" className="block px-4 py-3 hover:bg-slate-800 rounded-md transition-colors">
            💰 Precios Especiales
          </Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-semibold shadow-sm">
          ⚠️ Estás accediendo a la Intranet con permisos de Administrador Global.
        </div>
        
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
