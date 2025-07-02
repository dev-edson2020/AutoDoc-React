import Layout from "./Layout.jsx";
import Home from "./Home";
import Dashboard from "./Dashboard";
import CreateDocument from "./CreateDocument";
import History from "./History";
import Profile from "./Profile";
import Upgrade from "./Upgrade";
import ViewDocument from "./ViewDocument";
import AdminPanel from "./AdminPanel";
import Login from "./Login";

import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";

const PAGES = {
  Home: Home,
  Dashboard: Dashboard,
  CreateDocument: CreateDocument,
  History: History,
  Profile: Profile,
  Upgrade: Upgrade,
  ViewDocument: ViewDocument,
  AdminPanel: AdminPanel,
};

function _getCurrentPage(url) {
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  let urlLastPart = url.split("/").pop();
  if (urlLastPart.includes("?")) {
    urlLastPart = urlLastPart.split("?")[0];
  }

  const pageName = Object.keys(PAGES).find(
    (page) => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  return pageName || Object.keys(PAGES)[0];
}

// Função que verifica se o usuário está autenticado
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Wrapper das rotas internas
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      {isAuthenticated() && (
        <>
          <Route
            path="/Dashboard"
            element={
              <Layout currentPageName={currentPage}>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/CreateDocument"
            element={
              <Layout currentPageName={currentPage}>
                <CreateDocument />
              </Layout>
            }
          />
          <Route
            path="/History"
            element={
              <Layout currentPageName={currentPage}>
                <History />
              </Layout>
            }
          />
          <Route
            path="/Profile"
            element={
              <Layout currentPageName={currentPage}>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/Upgrade"
            element={
              <Layout currentPageName={currentPage}>
                <Upgrade />
              </Layout>
            }
          />
          <Route
            path="/ViewDocument"
            element={
              <Layout currentPageName={currentPage}>
                <ViewDocument />
              </Layout>
            }
          />
          <Route
            path="/AdminPanel"
            element={
              <Layout currentPageName={currentPage}>
                <AdminPanel />
              </Layout>
            }
          />
        </>
      )}

      {/* Redireciona para login caso tente acessar rota protegida sem autenticação */}
      {!isAuthenticated() && (
        <>
          <Route path="/Dashboard" element={<Navigate to="/login" />} />
          <Route path="/CreateDocument" element={<Navigate to="/login" />} />
          <Route path="/History" element={<Navigate to="/login" />} />
          <Route path="/Profile" element={<Navigate to="/login" />} />
          <Route path="/Upgrade" element={<Navigate to="/login" />} />
          <Route path="/ViewDocument" element={<Navigate to="/login" />} />
          <Route path="/AdminPanel" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  );
}
