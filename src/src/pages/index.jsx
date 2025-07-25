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

import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";

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

// Verifica se o usuário está autenticado
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Wrapper das rotas internas
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout currentPageName={currentPage}>
                <Routes>
                  <Route path="/Dashboard" element={<Dashboard />} />
                  <Route path="/CreateDocument" element={<CreateDocument />} />
                  <Route path="/History" element={<History />} />
                  <Route path="/Profile" element={<Profile />} />
                  <Route path="/Upgrade" element={<Upgrade />} />
                  <Route path="/ViewDocument" element={<ViewDocument />} />
                  <Route path="/AdminPanel" element={<AdminPanel />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  );
}
