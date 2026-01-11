"use client";

import DashboardGuard from "@/components/DashboardGuard";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import outputs from "../../../amplify_outputs.json";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Menu,
    X,
    ChevronRight,
    User as UserIcon,
    LogOut
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ username: string; email?: string; groups?: string[]; isExpired?: boolean; isEnvMismatch?: boolean } | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                // Amplify is configured in ConfigureAmplify.tsx

                const currentUser = await getCurrentUser();
                const session = await fetchAuthSession();
                const groups = (session.tokens?.accessToken.payload['cognito:groups'] as string[]) || [];
                // Debug clock skew
                const exp = session.tokens?.accessToken.payload.exp || 0;
                const now = Math.floor(Date.now() / 1000);
                const isExpired = exp < now;

                console.log("👮‍♂️ [AUTH DEBUG] User Groups:", groups);
                console.log("👤 [AUTH DEBUG] User ID:", currentUser.userId);
                console.log("🔑 [AUTH DEBUG] Token Valid:", !isExpired);

                // Debug Env Mismatch
                const iss = session.tokens?.accessToken.payload.iss || "";
                const configPoolId = outputs.auth.user_pool_id;
                const isEnvMismatch = !iss.endsWith(configPoolId);

                setUser({
                    username: currentUser.username,
                    email: (currentUser as any).signInDetails?.loginId || currentUser.username,
                    groups: groups,
                    isExpired,
                    isEnvMismatch
                });
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        fetchUser();
    }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const navLinks = [
        { name: "Panel Control", href: "/dashboard", icon: LayoutDashboard },
        { name: "Productos", href: "/dashboard/products", icon: Package },
        { name: "Pedidos", href: "/dashboard/orders", icon: ShoppingCart },
    ];

    return (
        <DashboardGuard>
            <div className="flex h-screen bg-slate-50 font-outfit overflow-hidden">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:relative lg:translate-x-0
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        shadow-2xl lg:shadow-none
                    `}
                >
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header */}
                        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
                                <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-sm font-bold text-xs">PW</div>
                                <span className="text-slate-900 font-bold tracking-tight">Protex Wear</span>
                            </h1>
                            <button
                                className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`
                                            flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
                                            ${isActive
                                                ? "bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600 hover:translate-x-1"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <link.icon size={22} className={isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-500 transition-colors"} />
                                            <span className="font-bold tracking-tight text-[15px] uppercase">{link.name}</span>
                                        </div>
                                        {isActive && <ChevronRight size={18} className="text-indigo-400" />}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Sidebar Footer - User Section */}
                        <div className="p-4 mt-auto border-t border-slate-100">
                            <button
                                onClick={() => router.push("/")}
                                className="w-full flex items-center gap-4 px-4 py-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md"
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300">
                                        <UserIcon size={24} />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-[14px] font-black text-slate-900 truncate leading-tight">
                                        {user?.email?.split('@')[0] || "Administrador"}
                                    </p>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                                        {user?.isEnvMismatch ? '⚠ ERROR DE ENTORNO' : (user?.isExpired ? '⚠ RELOJ INCORRECTO' : (user?.groups?.includes('ADMIN') ? 'ADMIN' : (user?.groups?.join(', ') || 'Sin Rol')))}
                                    </p>
                                </div>
                                <LogOut size={18} className="text-slate-300 group-hover:text-red-500 transition-colors" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    {/* Glassmorphism Background Decor */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/30 blur-[100px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/20 blur-[100px] -z-10 rounded-full -translate-x-1/2 translate-y-1/2" />

                    {/* Top Mobile Header */}
                    <header className="h-20 lg:hidden flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-30">
                        <button
                            className="p-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={28} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-md shadow-sm font-bold text-[10px]">PW</div>
                            <span className="text-base font-bold text-slate-900 tracking-tight">Protex Wear</span>
                        </div>
                        <button
                            onClick={() => router.push("/")}
                            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 transition-transform active:scale-95"
                        >
                            <UserIcon size={20} className="text-slate-600" />
                        </button>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto scroll-smooth">
                        <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-12 animate-in fade-in duration-700">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </DashboardGuard>
    );
}
