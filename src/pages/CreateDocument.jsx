import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FormField from "../components/FormField";

export default function CreateDocument() {
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState("");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const documentConfigs = {
    declaracao_residencia: {
      title: "Declaração de Residência",
      icon: "🏠",
      color: "from-blue-500 to-blue-600",
      fields: [
        { name: "nome", label: "Nome Completo", type: "text", required: true },
        { name: "cpf", label: "CPF", type: "text", required: true, placeholder: "000.000.000-00" },
        { name: "endereco", label: "Endereço Completo", type: "textarea", required: true },
        { name: "tempo_residencia", label: "Há quanto tempo reside no endereço?", type: "text", required: true }
      ]
    },
    contrato_prestacao: {
      title: "Contrato de Prestação de Serviço",
      icon: "📄",
      color: "from-purple-500 to-purple-600",
      fields: [
        { name: "nome", label: "Nome do Prestador", type: "text", required: true },
        { name: "cpf", label: "CPF do Prestador", type: "text", required: true },
        { name: "servico", label: "Descrição do Serviço", type: "textarea", required: true },
        { name: "valor", label: "Valor do Serviço (R$)", type: "text", required: true }
      ]
    },
    recibo_pagamento: {
      title: "Recibo de Pagamento",
      icon: "💰",
      color: "from-green-500 to-green-600",
      fields: [
        { name: "nome", label: "Nome do Pagador", type: "text", required: true },
        { name: "cpf", label: "CPF", type: "text", required: true },
        { name: "servico", label: "Descrição do Pagamento", type: "textarea", required: true },
        { name: "valor", label: "Valor (R$)", type: "text", required: true }
      ]
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    if (type && documentConfigs[type]) {
      setDocumentType(type);
    } else {
      navigate(createPageUrl("Dashboard"));
    }
  }, []);

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  const validateForm = () => {
    const config = documentConfigs[documentType];
    if (!config) return false;

    const newErrors = {};
    let isValid = true;

    config.fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        newErrors[field.name] = "Este campo é obrigatório.";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const generateDocument = async () => {
    setShowErrors(true);

    if (!validateForm()) {
      setApiError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsGenerating(true);
    setApiError("");
    setSuccess("");

    try {
      const config = documentConfigs[documentType];

      const payload = {
        type: documentType,
        title: config.title,
        form_data: formData,
        creator_name: "Edson" // Substituir no futuro pelo nome do usuário logado
      };

      const response = await fetch("http://localhost:8080/documento/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar o documento.");
      }

      const pdfPath = await response.text();
      setSuccess("Documento gerado com sucesso!");
      window.open(`http://localhost:8080/documento/download/${encodeURIComponent(pdfPath)}`, "_blank");

      setTimeout(() => {
        navigate(createPageUrl("History"));
      }, 2000);

    } catch (error) {
      console.error("Erro ao gerar documento:", error);
      setApiError("Erro ao gerar documento. Verifique os dados e tente novamente.");
    }

    setIsGenerating(false);
  };

  const config = documentConfigs[documentType];
  if (!config) return null;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl("Dashboard"))} className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center text-2xl`}>
              {config.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
              <p className="text-gray-600">Preencha as informações abaixo</p>
            </div>
          </div>
        </div>

        {apiError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Informações do Documento
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <div className="grid gap-6">
              {config.fields.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  error={errors[field.name]}
                  showErrors={showErrors}
                />
              ))}
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
              <Button variant="outline" onClick={() => navigate(createPageUrl("Dashboard"))} disabled={isGenerating}>
                Cancelar
              </Button>
              <Button onClick={generateDocument} disabled={isGenerating} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Gerar Documento
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
