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
  XCircle,
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
    procuracao_simples: { title: "Procuração Simples", icon: "⚖️", color: "from-indigo-500 to-indigo-600" },
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
      const response = await fetch("http://localhost:8080/documento/listar");
      if (!response.ok) {
        throw new Error("Erro ao buscar documentos");
      }
      const data = await response.json();
      const documentosTratados = data.map((doc) => ({
        id: doc.id,
        title: documentTypes[doc.type]?.title || "Documento",
        type: doc.type,
        pdf_url: `http://localhost:8080/documento/download/${doc.pdfUrl}`,
        status: doc.status,
        created_date: doc.createdDate || new Date().toISOString(),
      }));
      setDocuments(documentosTratados);
    } catch (error) {
      console.error("Erro ao carregar documentos:", error);
      setError("Erro ao carregar documentos.");
      setTimeout(() => setError(""), 3000);
    }
    setIsLoading(false);
  };

  const updateDocumentStatus = async (docId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/documento/${docId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar status");
      await loadData();
      setSuccess(`Status atualizado para \"${getStatusLabel(newStatus)}\" com sucesso!`);
    } catch (error) {
      setError(error.message);
    } finally {
      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchLower) ||
          documentTypes[doc.type]?.title.toLowerCase().includes(searchLower)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.type === typeFilter);
    }
    setFilteredDocuments(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "signed": return "bg-green-100 text-green-800 border-green-200";
      case "archived": return "bg-gray-100 text-gray-800 border-gray-200";
      case "canceled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
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
      window.open(doc.pdf_url, "_blank");
    }
  };

  const viewDocument = (doc) => {
    if (doc.pdf_url) {
      window.open(doc.pdf_url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Histórico de Documentos</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="generated">Gerado</SelectItem>
              <SelectItem value="signed">Assinado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(documentTypes).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {success && <Alert className="mb-4"><AlertDescription>{success}</AlertDescription></Alert>}
        {error && <Alert className="mb-4" variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        {filteredDocuments.length === 0 ? (
          <p>Nenhum documento encontrado.</p>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="shadow-md">
                <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 flex items-center justify-center text-2xl rounded-lg ${documentTypes[doc.type]?.color || "bg-gray-400"}`}>
                      {documentTypes[doc.type]?.icon || "📄"}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{doc.title}</p>
                      <p className="text-sm text-gray-500">{new Date(doc.created_date).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(doc.status)}>{getStatusLabel(doc.status)}</Badge>
                    <Button variant="outline" size="sm" onClick={() => viewDocument(doc)}><ExternalLink className="w-4 h-4 mr-1" />Ver</Button>
                    <Button variant="outline" size="sm" onClick={() => downloadDocument(doc)}><Download className="w-4 h-4 mr-1" />Baixar</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateDocumentStatus(doc.id, "signed")} disabled={doc.status === "signed"}><CheckCircle className="w-4 h-4 mr-2" />Assinado</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateDocumentStatus(doc.id, "archived")} disabled={doc.status === "archived"}><Archive className="w-4 h-4 mr-2" />Arquivado</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateDocumentStatus(doc.id, "canceled")} disabled={doc.status === "canceled"} className="text-red-600"><XCircle className="w-4 h-4 mr-2" />Cancelado</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
