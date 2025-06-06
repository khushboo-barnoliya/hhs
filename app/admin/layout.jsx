"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  Trophy,
  Megaphone,
  Image,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Settings,
  User,
  Bell,
  Search,
} from "lucide-react";

export default function Dashboard({ children }) {
  const { logout, isAuthenticated } = useAuth(); // make sure `isAuthenticated` exists in context
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/api/login"); // Replace with your login route
    }
  }, [isAuthenticated]);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Achievers", icon: <Trophy size={20} />, path: "/admin/achievers-add" },
    { name: "Announcements", icon: <Megaphone size={20} />, path: "/dashboard/announcements" },
    { name: "Gallery", icon: <Image size={20} />, path: "/dashboard/gallery" },
    { name: "Our Team", icon: <Users size={20} />, path: "/dashboard/our-team" },
    { name: "Settings", icon: <Settings size={20} />, path: "/dashboard/settings" },
  ];

  // Optional: while checking authentication, show loading
  if (typeof window !== "undefined" && !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Navbar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold text-indigo-600">{activeTab}</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} 
        bg-white shadow-lg transition-all duration-300 fixed md:relative 
        h-full z-40 ${isMobile && !sidebarOpen ? "-left-full" : "left-0"}`}
      >
        <div className="p-4 flex items-center justify-between border-b h-16">
          {sidebarOpen ? (
            <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
          ) : (
            <div className="w-6" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:block text-gray-500 hover:text-indigo-600"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                router.push(item.path);
                setActiveTab(item.name);
              }}
              className={`flex items-center w-full p-3 mx-2 rounded-lg transition-colors mb-1 
                ${pathname === item.path
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Profile & Logout */}
        <div className={`absolute bottom-0 w-full p-4 border-t ${!sidebarOpen && "px-2.5"}`}>
          <button
            onClick={logout}
            className={`flex items-center w-full p-2 rounded-lg text-red-600 hover:bg-red-50 ${!sidebarOpen && "justify-center"}`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${isMobile ? "mt-16" : ""}`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">{activeTab}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button className="relative text-gray-600 hover:text-indigo-600">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <User size={16} className="text-indigo-600" />
              </div>
              {sidebarOpen && <span className="text-sm font-medium">Admin</span>}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {children}
          
        </div>
      </div>
    </div>
  );
}