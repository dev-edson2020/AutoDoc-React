import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa erros quando o usuário digita
    if (error) setError(null);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.includes("@")) newErrors.email = "E-mail inválido";
    if (formData.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Senhas não coincidem";
    
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erro ao registrar");
      }

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedEmail", formData.email);
      }
      
      navigate("/login");
    } catch (err) {
      setError(err.message || "Ocorreu um erro ao registrar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            AutoDoc
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Crie sua conta para começar</p>
        </div>

        {error && typeof error === 'string' && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${error?.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="Seu nome completo"
              disabled={isLoading}
            />
            {error?.name && <p className="mt-1 text-sm text-red-500">{error.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${error?.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="seuemail@exemplo.com"
              disabled={isLoading}
            />
            {error?.email && <p className="mt-1 text-sm text-red-500">{error.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${error?.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error?.password && <p className="mt-1 text-sm text-red-500">{error.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${error?.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error?.confirmPassword && <p className="mt-1 text-sm text-red-500">{error.confirmPassword}</p>}
          </div>

          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-600">
              Lembrar de mim
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Registrar-se"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}