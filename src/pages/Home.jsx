
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Download,
  Share2,
  Clock,
  Shield,
  Zap,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const documentTypes = [
    { title: "Declaração de Residência", icon: "🏠", color: "from-blue-500 to-blue-600" },
    { title: "Contrato de Prestação", icon: "📄", color: "from-purple-500 to-purple-600" },
    { title: "Recibo de Pagamento", icon: "💰", color: "from-green-500 to-green-600" },
    { title: "União Estável", icon: "💑", color: "from-pink-500 to-pink-600" },
    { title: "Pedido de Demissão", icon: "📋", color: "from-orange-500 to-orange-600" },
    { title: "Procuração", icon: "⚖️", color: "from-indigo-500 to-indigo-600" }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Autônoma",
      text: "Economizei horas criando recibos para meus clientes. Super prático!",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Contador",
      text: "Uso diariamente para meus clientes. Interface intuitiva e documentos profissionais.",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "MEI",
      text: "Perfeito para quem precisa de agilidade. Recomendo para todos os empreendedores!",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Geração Instantânea",
      description: "Crie documentos profissionais em segundos"
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Seus dados protegidos com criptografia avançada"
    },
    {
      icon: Download,
      title: "Múltiplos Formatos",
      description: "Baixe em PDF, compartilhe ou imprima diretamente"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <style>
        {`
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
        `}
      </style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AutoDoc
              </span>
            </div>
            
            <Link to={createPageUrl("Dashboard")}>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Comece Agora
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 bg-clip-text text-transparent mb-8 leading-tight">
              Automatize seus<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                documentos
              </span> em segundos
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Crie documentos profissionais respondendo apenas algumas perguntas simples. 
              <br className="hidden md:block" />
              Ideal para autônomos, MEIs e pequenos negócios.
            </p>
            
            <Link to={createPageUrl("Dashboard")}>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                Criar Primeiro Documento
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Como funciona?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Processo simplificado em apenas 3 passos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Responda perguntas simples",
                description: "Preencha um formulário intuitivo com as informações necessárias",
                icon: "📝"
              },
              {
                step: "02", 
                title: "Gere o documento pronto",
                description: "Nosso sistema cria automaticamente um PDF profissional",
                icon: "⚡"
              },
              {
                step: "03",
                title: "Baixe, imprima ou compartilhe",
                description: "Use como preferir: download, impressão ou WhatsApp",
                icon: "📤"
              }
            ].map((item, index) => (
              <Card key={index} className="relative p-8 border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="text-4xl mb-6">{item.icon}</div>
                  <div className="text-blue-600 font-bold text-sm mb-2 tracking-wider">PASSO {item.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tipos de Documentos */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Documentos Disponíveis
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modelos profissionais para suas necessidades
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {documentTypes.map((doc, index) => (
              <Card key={index} className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${doc.color} rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    {doc.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">{doc.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to={createPageUrl("Dashboard")}>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-xl transition-all duration-300">
                Ver Todos os Documentos
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Por que escolher o AutoDoc?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              O que nossos usuários dizem
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl bg-white">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-blue-600 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Planos Simples e Transparentes
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
                <p className="text-gray-600 mb-6">Para experimentar o AutoDoc</p>
                <div className="text-4xl font-bold text-gray-900 mb-6">R$ 0<span className="text-lg text-gray-500">/mês</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>3 documentos por mês</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Todos os tipos de documento</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Download em PDF</span>
                  </li>
                </ul>
                <Link to={createPageUrl("Dashboard")}>
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold">
                    Começar Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  MAIS POPULAR
                </span>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">PRO</h3>
                <p className="text-gray-600 mb-6">Para uso profissional</p>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-6">
                  R$ 12,90<span className="text-lg text-gray-500">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span><strong>Documentos ilimitados</strong></span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Assinatura digital</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Histórico completo</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold">
                  Assinar PRO
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para automatizar seus documentos?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Junte-se a milhares de profissionais que já economizam tempo com o AutoDoc
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Link to={createPageUrl("Dashboard")}>
              <Button className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-2xl text-lg shadow-xl transition-all duration-300 transform hover:scale-105">
                Começar Agora - É Grátis
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-2xl text-lg shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                const subject = encodeURIComponent('Contato AutoDoc');
                const body = encodeURIComponent('Olá! Gostaria de saber mais sobre o AutoDoc.');
                window.location.href = `mailto:dev-edson2020@outlook.com?subject=${subject}&body=${body}`;
              }}
            >
              Entrar em Contato
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-8 md:mb-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">AutoDoc</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                Automatize seus documentos com segurança e praticidade
              </p>
              <p className="text-gray-500 text-sm">
                © 2024 AutoDoc. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
