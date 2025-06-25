import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Document } from '@/api/entities';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ViewDocument() {
  const location = useLocation();
  const [doc, setDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const docId = params.get('id');

    if (!docId) {
      setError('ID do documento não encontrado.');
      setIsLoading(false);
      return;
    }

    const fetchDocument = async () => {
      setIsLoading(true);
      try {
        const documentData = await Document.get(docId);
        setDoc(documentData);
        if (documentData.pdf_url && documentData.pdf_url.startsWith('data:text/html')) {
          const decodedHtml = decodeURIComponent(documentData.pdf_url.split(',')[1]);
          setHtmlContent(decodedHtml);
        } else {
          setError('Conteúdo do documento inválido ou não encontrado.');
        }
      } catch (err) {
        setError('Falha ao carregar o documento. Por favor, tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          Carregando documento...
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex justify-center items-center h-[60vh]">
            <Card className="max-w-lg w-full bg-red-50 border-red-200">
                <CardContent className="p-6 text-center text-red-600">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>{error}</p>
                </CardContent>
            </Card>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
             <iframe
                srcDoc={htmlContent}
                title={doc.title}
                className="w-full h-full bg-white shadow-lg rounded-lg border"
                style={{ height: 'calc(100vh - 200px)' }}
                sandbox="allow-same-origin"
            />
        </div>
    </div>
  );
}