import React, { useState, useEffect } from "react";
import { Document } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  FileText, 
  Plus, 
  Crown,
  Clock,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Download,
  ExternalLink,
  MoreHorizontal,
  CheckCircle,
  Archive,
  XCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [user, setUser] = useState(null);
  const [documentsThisMonth, setDocumentsThisMonth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const documentTypes = [
    {
      type: "declaracao_residencia",
      title: "Declaração de Residência",
      description: "Comprove seu endereço residencial",
      icon: "🏠",
      color: "from-blue-500 to-blue-600",
      questions: 4
    },
    {
      type: "contrato_prestacao",
      title: "Contrato de Prestação",
      description: "Formalize seus serviços profissionais",
      icon: "📄",
      color: "from-purple-500 to-purple-600",
      questions: 6
    },
    {
      type: "recibo_pagamento",
      title: "Recibo de Pagamento",
      description: "Comprove recebimentos e pagamentos",
      icon: "💰",
      color: "from-green-500 to-green-600",
      questions: 5
    },
    {
      type: "uniao_estavel",
      title: "União Estável",
      description: "Declare sua união estável",
      icon: "💑",
      color: "from-pink-500 to-pink-600",
      questions: 5
    },
    {
      type: "pedido_demissao",
      title: "Pedido de Demissão",
      description: "Formalize sua saída do emprego",
      icon: "📋",
      color: "from-orange-500 to-orange-600",
      questions: 4
    },
    {
      type: "procuracao_simples",
      title: "Procuração Simples",
      description: "Delegue poderes a terceiros",
      icon: "⚖️",
      color: "from-indigo-500 to-indigo-600",
      questions: 5
    }
  ];

  const documentTypesMap = documentTypes.reduce((acc, docType) => {
    acc[docType.type] = docType;
    return acc;
  }, {});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const response = await fetch(`http://localhost:8080/documento/dashboard/${currentUser.email}`, {
        method: 'GET',
        credentials: 'include',  // <== Aqui está a correção importante para enviar cookies
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error("Falha ao carregar dados do painel");
      }
      const data = await response.json();

      setRecentDocuments(data.recentDocuments || []);
      setDocumentsThisMonth(data.documentsThisMonth || 0);
      setUser((prev) => ({ ...prev, plan: data.plan || "gratuito" }));

    } catch (error) {
      console.error("Error loading data:", error);
      setError("Erro ao carregar dados do painel.");
    }
    setIsLoading(false);
  };

  const updateDocumentStatus = async (docId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/documento/${docId}/status`, {
        method: 'PUT',
        credentials: 'include', // <== Também aqui para status update
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar status');
      }
      await loadData();
      setSuccess(`Status atualizado para "${getStatusLabel(newStatus)}" com sucesso!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating document status:", error);
      setError("Erro ao atualizar status do documento.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "signed": return "bg-green-100 text-green-800 border-green-200 pointer-events-none";
      case "archived": return "bg-gray-100 text-gray-800 border-gray-200 pointer-events-none";
      case "canceled": return "bg-red-100 text-red-800 border-red-200 pointer-events-none";
      default: return "bg-blue-100 text-blue-800 border-blue-200 pointer-events-none";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "signed": return "Assinado";
      case "archived": return "Arquivado";
      case "canceled": return "Cancelado";
      default: return "Gerado";
    }
  };

  const downloadDocument = (doc) => {
    if (doc.pdf_url) {
      const link = document.createElement('a');
      link.href = doc.pdf_url;
      link.download = `${doc.title}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const viewDocument = (doc) => {
    if (doc.pdf_url) {
      const url = createPageUrl(`ViewDocument?id=${doc.id}`);
      window.open(url, '_blank');
    }
  };

  const canCreateDocument = () => {
    if (user?.plan === "pro") return true;
    return documentsThisMonth < 5;
  };

  const getRemainingDocuments = () => {
    if (user?.plan === "pro") return "∞";
    return Math.max(0, 5 - documentsThisMonth);
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3">
                Bem-vindo ao AutoDoc
              </h1>
              <p className="text-xl text-gray-600">
                Crie documentos profissionais em poucos cliques
              </p>
            </div>
            
            {user?.plan !== "pro" && (
              <Button 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
                onClick={() => window.location.href = createPageUrl("Upgrade")}
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade para PRO
              </Button>
            )}
          </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium text-sm mb-1">Documentos Este Mês</p>
                  <p className="text-3xl font-bold text-blue-800">{documentsThisMonth}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium text-sm mb-1">Plano Atual</p>
                  <p className="text-2xl font-bold text-green-800">
                    {user?.plan === "pro" ? "PRO" : "Gratuito"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  {user?.plan === "pro" ? 
                    <Crown className="w-6 h-6 text-white" /> :
                    <TrendingUp className="w-6 h-6 text-white" />
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 font-medium text-sm mb-1">Restantes</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {getRemainingDocuments()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Limit Warning */}
        {user?.plan !== "pro" && documentsThisMonth >= 4 && (
          <Alert className="mb-8 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">
                    {documentsThisMonth >= 5 ? 
                      "Limite mensal atingido!" : 
                      "Você está próximo do limite mensal"
                    }
                  </span>
                  <p className="text-sm mt-1">
                    {documentsThisMonth >= 5 ? 
                      "Faça upgrade para PRO e tenha documentos ilimitados" :
                      "Upgrade para PRO e crie documentos ilimitados"
                    }
                  </p>
                </div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => window.location.href = createPageUrl("Upgrade")}
                >
                  Fazer Upgrade
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Document Types Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Criar Novo Documento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTypes.map((docType) => (
              <Card key={docType.type} className={`group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${!canCreateDocument() ? 'opacity-50' : ''}`}>
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${docType.color} rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    {docType.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {docType.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center mb-4 text-sm leading-relaxed">
                    {docType.description}
                  </p>
                  
                  <div className="flex items-center justify-center mb-6">
                    <Badge variant="outline" className="text-xs">
                      {docType.questions} perguntas
                    </Badge>
                  </div>
                  
                  {canCreateDocument() ? (
                    <Link to={createPageUrl(`CreateDocument?type=${docType.type}`)}>
                      <Button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-3 rounded-xl transition-all duration-300">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Agora
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-3 rounded-xl">
                      Limite Atingido
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        {recentDocuments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Documentos Recentes</h2>
              <Link to={createPageUrl("History")}>
                <Button variant="outline" className="font-medium">
                  Ver Todos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-4">
              {recentDocuments.map((doc) => {
                const docType = documentTypesMap[doc.type];
                return (
                  <Card key={doc.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-14 h-14 bg-gradient-to-r ${docType?.color || 'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                            {docType?.icon || '📄'}
                          </div>

                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{doc.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-1" />
                                {docType?.title || "Documento"}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(doc.created_date).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                          <Badge variant="outline" className={`border ${getStatusColor(doc.status)}`}>
                            {getStatusLabel(doc.status)}
                          </Badge>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewDocument(doc)}
                              className="text-blue-600 hover:text-blue-800"
                              disabled={!doc.pdf_url}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadDocument(doc)}
                              className="text-gray-700 hover:text-black"
                              disabled={!doc.pdf_url}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Baixar
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-9 w-9">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => updateDocumentStatus(doc.id, "signed")}
                                  disabled={doc.status === "signed"}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  Marcar como Assinado
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateDocumentStatus(doc.id, "archived")}
                                  disabled={doc.status === "archived"}
                                >
                                  <Archive className="w-4 h-4 mr-2 text-gray-500" />
                                  Arquivar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateDocumentStatus(doc.id, "canceled")}
                                  disabled={doc.status === "canceled"}
                                >
                                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                  Cancelar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
