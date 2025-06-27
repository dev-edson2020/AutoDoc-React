import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Search,
  Filter,
  Download,
  ExternalLink,
  Calendar,
  MoreHorizontal,
  CheckCircle,
  Archive,
  XCircle
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function History() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const documentTypes = {
    declaracao_residencia: { title: "Declaração de Residência", icon: "🏠", color: "from-blue-500 to-blue-600" },
    contrato_prestacao: { title: "Contrato de Prestação", icon: "📄", color: "from-purple-500 to-purple-600" },
    recibo_pagamento: { title: "Recibo de Pagamento", icon: "💰", color: "from-green-500 to-green-600" },
    uniao_estavel: { title: "União Estável", icon: "💑", color: "from-pink-500 to-pink-600" },
    pedido_demissao: { title: "Pedido de Demissão", icon: "📋", color: "from-orange-500 to-orange-600" },
    procuracao_simples: { title: "Procuração Simples", icon: "⚖️", color: "from-indigo-500 to-indigo-600" }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, statusFilter, typeFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/documento/historico");
      if (!response.ok) {
        throw new Error("Erro ao buscar documentos");
      }
      const data = await response.json();

      const documentosTratados = data.map((doc, index) => ({
        id: doc.id || index,
        title: doc.title || "Documento",
        type: doc.documentType || "desconhecido",
        pdf_url: doc.pdfPath || "",
        status: doc.status || "generated",
        created_date: doc.createdDate || new Date().toISOString()
      }));

      setDocuments(documentosTratados);
    } catch (error) {
      console.error("Erro ao carregar documentos:", error);
      setError("Erro ao carregar documentos.");
      setTimeout(() => setError(""), 3000);
    }
    setIsLoading(false);
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchLower) ||
        documentTypes[doc.type]?.title.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    setFilteredDocuments(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "signed":
        return "bg-green-100 text-green-800 border-green-200 pointer-events-none";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200 pointer-events-none";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200 pointer-events-none";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200 pointer-events-none";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "signed":
        return "Assinado";
      case "archived":
        return "Arquivado";
      case "canceled":
        return "Cancelado";
      default:
        return "Gerado";
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3">
            Histórico de Documentos
          </h1>
          <p className="text-xl text-gray-600">
            Gerencie e visualize todos os seus documentos criados
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Filtros e Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="generated">Gerado</SelectItem>
                  <SelectItem value="signed">Assinado</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                  <SelectItem value="canceled">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  {Object.entries(documentTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>{type.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <Card className="border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  {documents.length === 0
                    ? "Nenhum documento criado ainda"
                    : "Nenhum documento encontrado"
                  }
                </h3>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((doc) => {
              const docType = documentTypes[doc.type];
              return (
                <Card key={doc.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 bg-gradient-to-r ${docType?.color || 'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center text-xl`}>
                          {docType?.icon || '📄'}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{doc.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
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
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
