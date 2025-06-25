
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Document } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Modal } from "@/components/ui/modal";
import { createPageUrl } from "@/utils";
import { 
  Crown, 
  User as UserIcon, 
  Mail,
  Calendar,
  CreditCard,
  Check,
  Zap,
  Shield,
  Star,
  CheckCircle,
  AlertCircle,
  Edit
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setEditForm({
        full_name: currentUser.full_name || "",
        email: currentUser.email || ""
      });
      
      const userDocs = await Document.filter({ created_by: currentUser.email });
      setDocuments(userDocs);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Erro ao carregar dados do perfil");
    }
    setIsLoading(false);
  };

  const getMonthlyDocuments = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    return documents.filter(doc => {
      const docDate = new Date(doc.created_date);
      return docDate.getMonth() === thisMonth && docDate.getFullYear() === thisYear;
    }).length;
  };

  const handleEditProfile = async () => {
    setIsUpdating(true);
    setError("");
    setSuccess("");
    
    try {
      await User.updateMyUserData({
        full_name: editForm.full_name
      });
      
      await loadData();
      setIsEditing(false);
      setSuccess("Perfil atualizado com sucesso!");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Erro ao atualizar perfil. Tente novamente.");
    }
    setIsUpdating(false);
  };

  const upgradeToPro = () => {
    // Redirect to internal upgrade page instead of external link
    window.location.href = createPageUrl("Upgrade");
  };

  const cancelSubscription = async () => {
    setIsUpdating(true);
    setError("");
    setSuccess("");
    
    try {
      await User.updateMyUserData({
        plan: "free",
        subscription_expires: null
      });
      await loadData();
      setShowCancelModal(false);
      setSuccess("Assinatura cancelada com sucesso! Você voltou ao plano gratuito.");
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      setError("Erro ao cancelar assinatura. Tente novamente.");
    }
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar perfil</h2>
            <Button onClick={loadData}>Tentar Novamente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3">
            Meu Perfil
          </h1>
          <p className="text-xl text-gray-600">
            Gerencie sua conta e assinatura
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Informações Pessoais
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancelar" : "Editar"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label className="text-base font-medium text-gray-700">Nome Completo</Label>
                      <Input 
                        value={editForm.full_name} 
                        onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                        className="mt-1" 
                      />
                    </div>
                    
                    <div>
                      <Label className="text-base font-medium text-gray-700">Email</Label>
                      <Input value={editForm.email} disabled className="mt-1 bg-gray-50" />
                      <p className="text-sm text-gray-500 mt-1">Email não pode ser alterado</p>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <Button
                        onClick={handleEditProfile}
                        disabled={isUpdating}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isUpdating ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            full_name: user.full_name || "",
                            email: user.email || ""
                          });
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label className="text-base font-medium text-gray-700">Nome Completo</Label>
                      <Input value={user.full_name || "Usuário"} disabled className="mt-1" />
                    </div>
                    
                    <div>
                      <Label className="text-base font-medium text-gray-700">Email</Label>
                      <Input value={user.email || ""} disabled className="mt-1" />
                    </div>
                    
                    <div>
                      <Label className="text-base font-medium text-gray-700">Membro desde</Label>
                      <Input 
                        value={new Date(user.created_date).toLocaleDateString('pt-BR')} 
                        disabled 
                        className="mt-1" 
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium text-gray-700">Função</Label>
                      <Input 
                        value={user.role === 'admin' ? 'Administrador' : 'Usuário'} 
                        disabled 
                        className="mt-1" 
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Estatísticas de Uso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {documents.length}
                    </div>
                    <div className="text-blue-700 font-medium">Total de Documentos</div>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {getMonthlyDocuments()}
                    </div>
                    <div className="text-green-700 font-medium">Este Mês</div>
                  </div>
                  
                  <div className="text-center p-6 bg-purple-50 rounded-xl">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {user.plan === "pro" ? "∞" : Math.max(0, 5 - getMonthlyDocuments())}
                    </div>
                    <div className="text-purple-700 font-medium">Restantes</div>
                  </div>
                  
                  <div className="text-center p-6 bg-orange-50 rounded-xl">
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {new Set(documents.map(d => d.type)).size}
                    </div>
                    <div className="text-orange-700 font-medium">Tipos Únicos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plan Info */}
          <div className="space-y-6">
            <Card className={`border-0 shadow-xl ${user.plan === "pro" ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200" : ""}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    {user.plan === "pro" ? 
                      <Crown className="w-5 h-5 mr-2 text-amber-600" /> : 
                      <Star className="w-5 h-5 mr-2 text-gray-600" />
                    }
                    Plano Atual
                  </span>
                  <Badge className={user.plan === "pro" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-gray-100 text-gray-800"}>
                    {user.plan === "pro" ? "PRO" : "Gratuito"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.plan === "pro" ? (
                  <div className="space-y-4">
                    <div className="flex items-center text-green-600">
                      <Check className="w-5 h-5 mr-2" />
                      <span>Documentos ilimitados</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Check className="w-5 h-5 mr-2" />
                      <span>Assinatura digital</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Check className="w-5 h-5 mr-2" />
                      <span>Suporte prioritário</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Check className="w-5 h-5 mr-2" />
                      <span>Histórico completo</span>
                    </div>
                    
                    {user.subscription_expires && (
                      <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                        <div className="flex items-center text-amber-800">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            Renovação em {new Date(user.subscription_expires).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setShowCancelModal(true)}
                      disabled={isUpdating}
                    >
                      Cancelar Assinatura
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-600 text-sm">
                      Plano gratuito com limite de 5 documentos por mês
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div>• 5 documentos por mês</div>
                      <div>• Todos os tipos de documento</div>
                      <div>• Download em PDF</div>
                    </div>

                    {getMonthlyDocuments() >= 5 && (
                      <Alert className="border-orange-200 bg-orange-50">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800 text-sm">
                          Você atingiu o limite mensal. Faça upgrade para continuar criando documentos.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upgrade Card */}
            {user.plan !== "pro" && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800">
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade para PRO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-4xl font-bold text-blue-800">
                      R$ 12,90<span className="text-lg text-blue-600">/mês</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-blue-700">
                        <Zap className="w-4 h-4 mr-2" />
                        <span className="text-sm">Documentos ilimitados</span>
                      </div>
                      <div className="flex items-center text-blue-700">
                        <Shield className="w-4 h-4 mr-2" />
                        <span className="text-sm">Assinatura digital</span>
                      </div>
                      <div className="flex items-center text-blue-700">
                        <Star className="w-4 h-4 mr-2" />
                        <span className="text-sm">Suporte prioritário</span>
                      </div>
                      <div className="flex items-center text-blue-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">Histórico completo</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      onClick={upgradeToPro}
                      disabled={isUpdating}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Fazer Upgrade
                    </Button>
                    
                    <div className="text-xs text-center text-blue-600">
                      💳 Pagamento seguro • ❌ Cancele quando quiser
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Support Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Precisa de Ajuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>• ❓ Como criar documentos</div>
                  <div>• 💳 Problemas com pagamento</div>
                  <div>• 📋 Dúvidas sobre assinatura</div>
                  <div>• 🔧 Suporte técnico</div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open('https://wa.me/5515996141027?text=Olá! Preciso de ajuda com o AutoDoc', '_blank')}
                  >
                    💬 WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const subject = encodeURIComponent('Dúvida sobre AutoDoc');
                      const body = encodeURIComponent('Olá! Preciso de ajuda com:');
                      window.location.href = `mailto:dev-edson2020@outlook.com?subject=${subject}&body=${body}`;
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    E-mail
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cancel Subscription Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancelar Assinatura PRO"
          actions={
            <>
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                disabled={isUpdating}
              >
                Manter Assinatura
              </Button>
              <Button
                variant="destructive"
                onClick={cancelSubscription}
                disabled={isUpdating}
              >
                {isUpdating ? "Cancelando..." : "Confirmar Cancelamento"}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja cancelar sua assinatura PRO?
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <p className="text-sm text-red-800 font-medium mb-2">
                  Você perderá os seguintes benefícios:
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Documentos ilimitados</li>
                  <li>• Assinatura digital</li>
                  <li>• Suporte prioritário</li>
                  <li>• Histórico completo</li>
                </ul>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Você voltará ao plano gratuito com limite de 5 documentos por mês.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
