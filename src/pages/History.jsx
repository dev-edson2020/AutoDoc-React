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
    contrato_prestacao:   { title: "Contrato de Prestação de Serviço", emoji: "📄", color: "bg-purple-500" },
    recibo_pagamento:     { title: "Recibo de Pagamento", emoji: "💰", color: "bg-green-500" },
    uniao_estavel:        { title: "União Estável", emoji: "💑", color: "bg-pink-500" },
    pedido_demissao:      { title: "Pedido de Demissão", emoji: "📋", color: "bg-orange-500" },
    procuracao_simples:   { title: "Procuração Simples", emoji: "⚖️", color: "bg-indigo-500" },
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { filterAndSort(); }, [documents, searchTerm, statusFilter, typeFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/documento/listar");
      if (!res.ok) throw new Error();
      const data = await res.json();

      const mapped = data.map(doc => ({
        id: doc.id,
        type: doc.type,
        status: doc.status,
        pdf_url: `http://localhost:8080/documento/download/${doc.pdfUrl}`,
        creator_name: doc.creatorName || "",
        title: documentTypes[doc.type]?.title || doc.title || "Documento",
        created_date: doc.created_date
      }));

      mapped.sort((a,b)=>new Date(b.created_date)-new Date(a.created_date));
      setDocuments(mapped);
    } catch {
      setError("Erro ao carregar documentos.");
      setTimeout(()=>setError(""),3000);
    }
    setIsLoading(false);
  };

  const filterAndSort = () => {
    let list = [...documents];

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter(d =>
        d.title.toLowerCase().includes(s) ||
        d.creator_name.toLowerCase().includes(s)
      );
    }
    if (statusFilter !== "all") list = list.filter(d => d.status === statusFilter);
    if (typeFilter   !== "all") list = list.filter(d => d.type   === typeFilter);

    list.sort((a,b)=>new Date(b.created_date)-new Date(a.created_date));
    setFilteredDocuments(list);
  };

  const updateDocumentStatus = async (id, st) => {
    await fetch(`http://localhost:8080/documento/${id}/status`, {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({status:st})
    });
    loadData();
    setSuccess(`Status atualizado para "${st}"`);
    setTimeout(()=>setSuccess(""),3000);
  };

  const getStatusLabel = st =>
    st==="signed" ? "Assinado" :
    st==="archived" ? "Arquivado" :
    st==="canceled" ? "Cancelado" : "Gerado";

  const getStatusColor = st =>
    st==="signed" ? "bg-green-50 text-green-700 border border-green-200" :
    st==="archived" ? "bg-gray-50 text-gray-700 border border-gray-200" :
    st==="canceled" ? "bg-red-50 text-red-700 border border-red-200" :
                      "bg-blue-50 text-blue-700 border border-blue-200";

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin h-16 w-16 border-b-2 border-blue-600 rounded-full"/>
    </div>
  );

  return (
    <div className="p-8">
      {success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}
      {error   && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      {/* --- FILTROS COM LABELS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Buscar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <Input
            placeholder="Digite um termo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Todos"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="generated">Gerado</SelectItem>
              <SelectItem value="signed">Assinado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Tipo de Documento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger><SelectValue placeholder="Todos"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(documentTypes).map(([k,v]) => (
                <SelectItem key={k} value={k}>{v.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Documentos */}
      {filteredDocuments.map(doc => {
        const dt = documentTypes[doc.type] || { emoji:"📄", color:"bg-gray-400", title:"Documento" };
        return (
          <Card key={doc.id} className="mb-4 shadow">
            <CardContent className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`${dt.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                  {dt.emoji}
                </div>
                <div>
                  <p className="font-bold">
                    {dt.title}
                    {doc.creator_name && ` - ${doc.creator_name}`}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(doc.created_date).toLocaleDateString("pt-BR")} — 
                    {new Date(doc.created_date).toLocaleTimeString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(doc.status)}`}>
                  {getStatusLabel(doc.status)}
                </span>
                <Button variant="ghost" size="sm" onClick={()=>window.open(doc.pdf_url)}>
                  <ExternalLink className="w-4 h-4 mr-1"/>Ver
                </Button>
                <Button variant="ghost" size="sm" onClick={()=>window.open(doc.pdf_url)}>
                  <Download className="w-4 h-4 mr-1"/>Baixar
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="w-4 h-4"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={()=>updateDocumentStatus(doc.id,"signed")}
                      disabled={doc.status==="signed"}
                    >
                      <CheckCircle className="w-4 h-4 mr-2"/>Assinado
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={()=>updateDocumentStatus(doc.id,"archived")}
                      disabled={doc.status==="archived"}
                    >
                      <Archive className="w-4 h-4 mr-2"/>Arquivado
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={()=>updateDocumentStatus(doc.id,"canceled")}
                      disabled={doc.status==="canceled"}
                      className="text-red-600"
                    >
                      <XCircle className="w-4 h-4 mr-2"/>Cancelado
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
