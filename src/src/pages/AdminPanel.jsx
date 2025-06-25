import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Document } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertCircle, Users, FileText, Crown, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalDocs: 0, proUsers: 0, freeUsers: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        setCurrentUser(user);

        if (user.role !== 'admin') {
          setError("Acesso negado. Esta área é restrita para administradores.");
          setIsLoading(false);
          setTimeout(() => navigate(createPageUrl("Dashboard")), 3000);
          return;
        }

        const [allUsers, allDocs] = await Promise.all([
          User.list(),
          Document.list()
        ]);

        setUsers(allUsers);
        setDocuments(allDocs);
        calculateStats(allUsers, allDocs);

      } catch (err) {
        setError("Ocorreu um erro ao carregar os dados do painel administrativo.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndLoadData();
  }, [navigate]);

  const calculateStats = (allUsers, allDocs) => {
    const proUsersCount = allUsers.filter(u => u.plan === 'pro').length;
    setStats({
      totalUsers: allUsers.length,
      totalDocs: allDocs.length,
      proUsers: proUsersCount,
      freeUsers: allUsers.length - proUsersCount
    });
  };

  const getDocsCountForUser = (userEmail) => {
    return documents.filter(doc => doc.created_by === userEmail).length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-center text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          Carregando painel administrativo...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] px-4">
        <Card className="max-w-lg w-full bg-red-50 border-red-200">
          <CardContent className="p-6 text-center text-red-700">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">{error}</p>
            <p className="text-sm">Você será redirecionado para o Dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3">
            Painel Administrativo
          </h1>
          <p className="text-xl text-gray-600">Visão geral do sistema e usuários.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium text-sm mb-1">Total de Usuários</p>
                  <p className="text-3xl font-bold text-blue-800">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium text-sm mb-1">Total de Documentos</p>
                  <p className="text-3xl font-bold text-green-800">{stats.totalDocs}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 font-medium text-sm mb-1">Usuários PRO</p>
                  <p className="text-3xl font-bold text-amber-800">{stats.proUsers}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium text-sm mb-1">Usuários Gratuitos</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.freeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                  <BarChart2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Plano</TableHead>
                    <TableHead className="text-center">Documentos</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name || "N/A"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={user.plan === 'pro' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}>
                            {user.plan === 'pro' ? 'PRO' : 'Gratuito'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono">{getDocsCountForUser(user.email)}</TableCell>
                        <TableCell>{new Date(user.created_date).toLocaleDateString('pt-BR')}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="5" className="text-center h-24">Nenhum usuário encontrado.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}