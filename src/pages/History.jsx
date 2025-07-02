import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ExternalLink,
  Download,
  MoreHorizontal,
  CheckCircle,
  Archive,
  XCircle,
  Filter,
} from "lucide-react";

export default function History() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const documentTypes = {
    declaracao_residencia: { title: "Declaração de Residência", emoji: "🏠", color: "bg-blue-500" },
    contrato_prestacao: { title: "Contrato de Prestação de Serviço", emoji: "📄", color: "bg-purple-500" },
    recibo_pagamento: { title: "Recibo de Pagamento", emoji: "💰", color: "bg-green-500" },
    uniao_estavel: { title: "União Estável", emoji: "💑", color: "bg-pink-500" },
    pedido_demissao: { title: "Pedido de Demissão", emoji: "📋", color: "bg-orange-500" },
    procuracao_simples: { title: "Procuração Simples", emoji: "⚖️", color: "bg-indigo-500" },
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [documents, searchTerm, statusFilter, typeFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/documento/listar");
      if (!res.ok) throw new Error("Falha ao buscar documentos");
      const data = await res.json();

      const mapped = data.map((doc) => ({
        id: doc.id,
        type: doc.type,
        status: doc.status?.toLowerCase() || "generated",
        pdf_url: `http://localhost:8080/documento/download/${doc.pdfUrl}`,
        creator_name: doc.createdBy || "",
        title: documentTypes[doc.type]?.title || doc.title || "Documento",
        created_date: doc.createdDate,
      }));

      mapped.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setDocuments(mapped);
    } catch (e) {
      setError("Erro ao carregar documentos.");
      setTimeout(() => setError(""), 3000);
    }
    setIsLoading(false);
  };

  const filterAndSort = () => {
    let list = [...documents];

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(s) ||
          d.creator_name.toLowerCase().includes(s)
      );
    }
    if (statusFilter !== "all") list = list.filter((d) => d.status === statusFilter);
    if (typeFilter !== "all") list = list.filter((d) => d.type === typeFilter);

    list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    setFilteredDocuments(list);
  };

  const updateDocumentStatus = async (id, st) => {
    try {
      const res = await fetch(`http://localhost:8080/documento/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: st }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar status");

      await loadData();

      setSuccess(`Status atualizado para "${getStatusLabel(st)}"`);
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Erro ao atualizar status.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Gerado";
    switch (status.toLowerCase()) {
      case "signed": return "Assinado";
      case "archived": return "Arquivado";
      case "canceled": return "Cancelado";
      default: return "Gerado";
    }
  };

  const getStatusColor = (st) =>
    st === "signed"
      ? "bg-green-50 text-green-700 border border-green-200"
      : st === "archived"
      ? "bg-gray-50 text-gray-700 border border-gray-200"
      : st === "canceled"
      ? "bg-red-50 text-red-700 border border-red-200"
      : "bg-blue-50 text-blue-700 border border-blue-200";

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-16 w-16 border-b-2 border-blue-600 rounded-full" />
      </div>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
          Histórico de Documentos
        </h1>
        <p className="text-gray-600">Gerencie e visualize todos os seus documentos criados</p>
      </header>

      {success && (
        <Alert className="mb-6">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="mb-8">
        <h2 className="text-2xl font-semibold flex items-center mb-4">
          <Filter className="w-5 h-5 mr-2 text-blue-600" />
          Filtros e Pesquisa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              className="pl-10"
              placeholder="Pesquisar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="lucide lucide-search absolute left-3 top-3 w-4 h-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24"
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os Status" />
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
              <SelectValue placeholder="Todos os Tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              {Object.entries(documentTypes).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <main className="mb-12">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => {
            const dt = documentTypes[doc.type] || {
              emoji: "📄",
              color: "bg-gray-400",
              title: "Documento",
            };
            return (
              <Card key={doc.id} className="mb-4 shadow">
                <CardContent className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-4">
                    <div className={`${dt.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                      {dt.emoji}
                    </div>
                    <div>
                      <p className="font-bold">
                        {dt.title} {doc.creator_name && `- ${doc.creator_name}`}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Date(doc.created_date).toLocaleDateString("pt-BR")} -
                        {new Date(doc.created_date).toLocaleTimeString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(doc.status)}`}>
                      {getStatusLabel(doc.status)}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => window.open(doc.pdf_url)}>
                      <ExternalLink className="w-4 h-4 mr-1" /> Ver
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => window.open(doc.pdf_url)}>
                      <Download className="w-4 h-4 mr-1" /> Baixar
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateDocumentStatus(doc.id, "signed")} disabled={doc.status === "signed"}>
                          <CheckCircle className="w-4 h-4 mr-2" /> Assinado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateDocumentStatus(doc.id, "archived")} disabled={doc.status === "archived"}>
                          <Archive className="w-4 h-4 mr-2" /> Arquivado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateDocumentStatus(doc.id, "canceled")} disabled={doc.status === "canceled"} className="text-red-600">
                          <XCircle className="w-4 h-4 mr-2" /> Cancelado
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500">
            Nenhum documento encontrado
          </div>
        )}
      </main>
    </div>
  );
}
