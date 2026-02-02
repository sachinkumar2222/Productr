import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Home, ShoppingBag, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'text-white' : 'text-gray-400 hover:text-white';
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#1e2028] flex flex-col text-white transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white">Productr</span>
                        <div className="w-5 h-5 rounded-full border-2 border-[#ff6b00] flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#ff6b00] rounded-full"></div>
                        </div>
                    </div>
                    {/* Close Sidebar Button (Mobile) */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 mb-6">
                    <div className="flex items-center bg-[#292b34] rounded-lg px-3 py-2 border border-[#363841]">
                        <Search className="w-4 h-4 text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent border-none outline-none text-sm text-gray-300 w-full placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    <Link
                        to="/"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/')}`}
                    >
                        <Home className="w-4 h-4" />
                        Home
                    </Link>
                    <Link
                        to="/products"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/products')}`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Products
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-3 text-gray-800">
                        {/* Hamburger Menu (Mobile) */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden mr-1 text-gray-600 hover:text-[#1a1a80] transition-colors p-1 -ml-1"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {location.pathname === '/' ? (
                            <>
                                <Home className="w-5 h-5 text-gray-500 hidden md:block" />
                                <span className="font-semibold text-lg">Home</span>
                            </>
                        ) : location.pathname === '/products' ? (
                            <>
                                <ShoppingBag className="w-5 h-5 text-gray-500 hidden md:block" />
                                <span className="font-semibold text-lg">Products</span>
                            </>
                        ) : null}
                    </div>

                    <div className="relative">
                        <div
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                                <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" className="w-full h-full object-cover" />
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8 no-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
