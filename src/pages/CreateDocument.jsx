import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Document } from "@/api/entities";
import { User } from "@/api/entities";
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
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const documentConfigs = {
    declaracao_residencia: {
      title: "Declaração de Residência",
      icon: "🏠",
      color: "from-blue-500 to-blue-600",
      fields: [
        { name: "nome_completo", label: "Nome Completo", type: "text", required: true },
        { name: "cpf", label: "CPF", type: "text", required: true, placeholder: "000.000.000-00" },
        { name: "endereco_completo", label: "Endereço Completo", type: "textarea", required: true },
        { name: "tempo_residencia", label: "Há quanto tempo reside no endereço?", type: "text", required: true, placeholder: "Ex: 2 anos" }
      ]
    },
    contrato_prestacao: {
      title: "Contrato de Prestação de Serviço",
      icon: "📄",
      color: "from-purple-500 to-purple-600",
      fields: [
        { name: "prestador_nome", label: "Nome do Prestador", type: "text", required: true },
        { name: "prestador_cpf", label: "CPF do Prestador", type: "text", required: true, placeholder: "000.000.000-00" },
        { name: "contratante_nome", label: "Nome do Contratante", type: "text", required: true },
        { name: "contratante_cpf", label: "CPF/CNPJ do Contratante", type: "text", required: true },
        { name: "servico_descricao", label: "Descrição do Serviço", type: "textarea", required: true },
        { name: "valor", label: "Valor do Serviço (R$)", type: "number", required: true, placeholder: "0,00" }
      ]
    },
    recibo_pagamento: {
      title: "Recibo de Pagamento",
      icon: "💰",
      color: "from-green-500 to-green-600",
      fields: [
        { name: "pagador_nome", label: "Nome do Pagador", type: "text", required: true },
        { name: "recebedor_nome", label: "Nome do Recebedor", type: "text", required: true },
        { name: "valor", label: "Valor (R$)", type: "number", required: true, placeholder: "0,00" },
        { name: "descricao", label: "Descrição do Pagamento", type: "textarea", required: true },
        { name: "data_pagamento", label: "Data do Pagamento", type: "date", required: true }
      ]
    },
    uniao_estavel: {
      title: "Declaração de União Estável",
      icon: "💑",
      color: "from-pink-500 to-pink-600",
      fields: [
        { name: "companheiro1_nome", label: "Nome do(a) Primeiro(a) Companheiro(a)", type: "text", required: true },
        { name: "companheiro1_cpf", label: "CPF do(a) Primeiro(a) Companheiro(a)", type: "text", required: true, placeholder: "000.000.000-00" },
        { name: "companheiro2_nome", label: "Nome do(a) Segundo(a) Companheiro(a)", type: "text", required: true },
        { name: "companheiro2_cpf", label: "CPF do(a) Segundo(a) Companheiro(a)", type: "text", required: true, placeholder: "000.000.000-00" },
        { name: "data_inicio", label: "Data de Início da União", type: "date", required: true }
      ]
    },
    pedido_demissao: {
      title: "Pedido de Demissão",
      icon: "📋",
      color: "from-orange-500 to-orange-600",
      fields: [
        { name: "funcionario_nome", label: "Nome do Funcionário", type: "text", required: true },
        { name: "empresa_nome", label: "Nome da Empresa", type: "text", required: true },
        { name: "cargo", label: "Cargo Ocupado", type: "text", required: true },
        { name: "data_saida", label: "Data de Saída Desejada", type: "date", required: true }
      ]
    },
    procuracao_simples: {
      title: "Procuração Simples",
      icon: "⚖️",
      color: "from-indigo-500 to-indigo-600",
      fields: [
        { name: "outorgante_nome", label: "Nome do Outorgante", type: "text", required: true },
        { name: "outorgante_cpf", label: "CPF do Outorgante", type: "text", required: true, placeholder: "000.000.000-00" },
        { name: "outorgado_nome", label: "Nome do Outorgado", type: "text", required: true },
        { name: "outorgado_cpf", label: "CPF do Outorgado", type: "text", required: true, placeholder: "000.000.000-00" },
        { name: "poderes", label: "Poderes Concedidos", type: "textarea", required: true, placeholder: "Ex: Assinar contratos, representar em reuniões..." }
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
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
      setApiError("Erro ao carregar dados do usuário.");
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear specific field error when user starts typing
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
      
      // Get user name for document title
      const userName = formData.nome_completo || 
                     formData.prestador_nome || 
                     formData.funcionario_nome || 
                     formData.outorgante_nome ||
                     formData.recebedor_nome ||
                     user?.full_name || 
                     "Usuário";
      
      const documentTitle = `${config.title} - ${userName}`;

      const prompt = `
        Crie um documento profissional em HTML do tipo "${config.title}" com os seguintes dados:
        ${JSON.stringify(formData, null, 2)}
        
        O documento deve:
        - Ser formatado profissionalmente em HTML com CSS inline
        - Incluir um cabeçalho com título centralizado
        - Ter formatação adequada para impressão (A4)
        - Incluir campos para assinatura no final
        - Seguir padrões brasileiros para este tipo de documento
        - Incluir data atual formatada (${new Date().toLocaleDateString('pt-BR')})
        - Usar linguagem formal e jurídica apropriada
        - Ter margens adequadas e fonte legível (Arial, 12pt)
        - Incluir espaço para testemunhas quando necessário
        - Usar formatação de moeda brasileira para valores
        
        Retorne apenas o HTML completo pronto para visualização e impressão.
      `;

      const response = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            html_content: { type: "string" },
            document_title: { type: "string" }
          }
        }
      });

      const documentData = {
        type: documentType,
        title: documentTitle,
        form_data: formData,
        pdf_url: `data:text/html;charset=utf-8,${encodeURIComponent(response.html_content)}`,
        status: "generated",
        creator_name: userName
      };

      await Document.create(documentData);
      
      setSuccess("Documento gerado com sucesso! Redirecionando...");
      
      setTimeout(() => {
        navigate(createPageUrl("History"));
      }, 2000);

    } catch (error) {
      console.error("Error generating document:", error);
      setApiError("Erro ao gerar documento. Verifique os dados e tente novamente.");
    }

    setIsGenerating(false);
  };
  
  const config = documentConfigs[documentType];
  if (!config) {
    return null; 
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="mr-4"
          >
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

        {/* Form */}
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
              <Button
                variant="outline"
                onClick={() => navigate(createPageUrl("Dashboard"))}
                disabled={isGenerating}
              >
                Cancelar
              </Button>
              
              <Button
                onClick={generateDocument}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8"
              >
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