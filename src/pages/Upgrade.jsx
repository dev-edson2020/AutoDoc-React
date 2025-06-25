import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Crown, 
  ArrowLeft,
  Check,
  Zap,
  Shield,
  Star,
  Calendar,
  CreditCard,
  Smartphone,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";

export default function Upgrade() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // If user is already PRO, redirect to profile
      if (currentUser.plan === "pro") {
        navigate(createPageUrl("Profile"));
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setError("Erro ao carregar dados do usuário.");
    }
    setIsLoading(false);
  };

  const handlePixPayment = () => {
    setIsProcessing(true);
    setError("");
    setSuccess("");
    
    // Simulate PIX payment processing
    setTimeout(() => {
      setSuccess("PIX gerado com sucesso! Use o código abaixo para fazer o pagamento:");
      setIsProcessing(false);
    }, 2000);
  };

  const handleCreditCardPayment = () => {
    setIsProcessing(true);
    setError("");
    setSuccess("");
    
    // Simulate credit card payment processing
    setTimeout(() => {
      setSuccess("Pagamento processado com sucesso! Sua assinatura PRO foi ativada.");
      // Update user to PRO
      updateUserToPro();
      setIsProcessing(false);
    }, 3000);
  };

  const updateUserToPro = async () => {
    try {
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);
      
      await User.updateMyUserData({
        plan: "pro",
        subscription_expires: expirationDate.toISOString().split('T')[0]
      });
      
      setTimeout(() => {
        navigate(createPageUrl("Dashboard"));
      }, 2000);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Erro ao ativar assinatura PRO.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Profile"))}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upgrade para PRO</h1>
              <p className="text-gray-600">Desbloqueie recursos ilimitados</p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
              {success.includes("PIX") && (
                <div className="mt-3 p-4 bg-white border border-green-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-mono bg-gray-100 p-4 rounded mb-2">
                      00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540512.905802BR5925AUTODOC SERVICOS DIGITAIS6009SAO PAULO61080540000062070503***6304ABCD
                    </div>
                    <p className="text-sm text-gray-600">Copie e cole este código no seu app do banco</p>
                    <p className="text-lg font-bold text-green-600 mt-2">Valor: R$ 12,90</p>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Comparison */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-amber-600" />
                  Por que escolher o PRO?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Documentos ilimitados por mês</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Assinatura digital integrada</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Histórico completo de documentos</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Suporte prioritário via email</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Templates exclusivos</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Backup automático na nuvem</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-800 mb-2">
                      R$ 12,90<span className="text-lg text-blue-600">/mês</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      ❌ Cancele quando quiser • 🔒 Pagamento seguro
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Table */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Comparação de Planos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Recurso</th>
                        <th className="text-center py-2">Gratuito</th>
                        <th className="text-center py-2 text-amber-600">PRO</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      <tr className="border-b">
                        <td className="py-2">Documentos por mês</td>
                        <td className="text-center py-2">5</td>
                        <td className="text-center py-2 text-green-600 font-semibold">∞</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Tipos de documento</td>
                        <td className="text-center py-2">✅</td>
                        <td className="text-center py-2">✅</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Download PDF</td>
                        <td className="text-center py-2">✅</td>
                        <td className="text-center py-2">✅</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Assinatura digital</td>
                        <td className="text-center py-2">❌</td>
                        <td className="text-center py-2 text-green-600">✅</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Suporte prioritário</td>
                        <td className="text-center py-2">❌</td>
                        <td className="text-center py-2 text-green-600">✅</td>
                      </tr>
                      <tr>
                        <td className="py-2">Histórico completo</td>
                        <td className="text-center py-2">❌</td>
                        <td className="text-center py-2 text-green-600">✅</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Options */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Opções de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* PIX Payment */}
                <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">PIX</h3>
                          <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Mais rápido</Badge>
                    </div>
                    
                    <div className="text-2xl font-bold text-gray-900 mb-4">
                      R$ 12,90
                    </div>
                    
                    <Button 
                      onClick={handlePixPayment}
                      disabled={isProcessing}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isProcessing ? "Gerando PIX..." : "Pagar com PIX"}
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Ativação imediata após confirmação do pagamento
                    </p>
                  </CardContent>
                </Card>

                {/* Credit Card Payment */}
                <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Cartão de Crédito</h3>
                          <p className="text-sm text-gray-600">Renovação automática</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Popular</Badge>
                    </div>
                    
                    <div className="text-2xl font-bold text-gray-900 mb-4">
                      R$ 12,90<span className="text-sm text-gray-600">/mês</span>
                    </div>
                    
                    <Button 
                      onClick={handleCreditCardPayment}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isProcessing ? "Processando..." : "Pagar com Cartão"}
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Cobrança recorrente mensal • Cancele quando quiser
                    </p>
                  </CardContent>
                </Card>

                {/* Security Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Pagamento 100% Seguro</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>🔒 Seus dados são criptografados e protegidos</p>
                    <p>🛡️ Processamento seguro via gateway confiável</p>
                    <p>💳 Não armazenamos dados do seu cartão</p>
                    <p>📋 Nota fiscal enviada por email</p>
                  </div>
                </div>

                {/* Testimonial */}
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 italic mb-2">
                      "O AutoDoc PRO mudou completamente minha rotina. Agora gero todos os documentos que preciso sem limitações!"
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      - Maria Silva, Contadora
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}