

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { FileText, User as UserIcon, LogOut, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        if (currentPageName !== "Home") {
          await User.login();
        }
      }
      setIsAuthenticating(false);
    };
    fetchUser();
  }, [location.pathname, currentPageName]);
  
  if (currentPageName === "Home") {
    return children;
  }

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const getFirstName = () => {
    if (!user || !user.full_name) return "Usuário";
    return user.full_name.split(' ')[0];
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.href = createPageUrl("Home");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    window.location.href = createPageUrl("Profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <style>
        {`
          :root {
            --primary: #1A73E8;
            --primary-dark: #1557B0;
            --secondary: #F8FAFF;
            --accent: #E8F0FE;
          }
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
        `}
      </style>
      
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Dashboard")} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AutoDoc
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to={createPageUrl("Dashboard")} 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${ currentPageName === "Dashboard" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50" }`}
              >
                Dashboard
              </Link>
              <Link 
                to={createPageUrl("History")} 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${ currentPageName === "History" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50" }`}
              >
                Histórico
              </Link>
              <Link 
                to={createPageUrl("Profile")} 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${ currentPageName === "Profile" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50" }`}
              >
                Perfil
              </Link>
              {user && user.role === 'admin' && (
                <Link
                  to={createPageUrl("AdminPanel")}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${ currentPageName === "AdminPanel" ? "bg-red-100 text-red-700 font-medium" : "text-gray-600 hover:text-red-600 hover:bg-red-50" }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden sm:flex items-center space-x-2 text-gray-700">
                  <span className="font-medium">Olá, {getFirstName()}!</span>
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium hover:shadow-lg transition-all duration-200"
                  >
                    <UserIcon className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.full_name || "Usuário"}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowLogoutModal(true)} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AutoDoc
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 AutoDoc. Automatize seus documentos com segurança e praticidade.
            </p>
          </div>
        </div>
      </footer>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirmar Saída"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <LogOut className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Sair do Sistema</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Tem certeza que deseja encerrar sua sessão?
            </p>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Sim, Sair
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

