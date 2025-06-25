import Layout from "./Layout.jsx";

import Home from "./Home";

import Dashboard from "./Dashboard";

import CreateDocument from "./CreateDocument";

import History from "./History";

import Profile from "./Profile";

import Upgrade from "./Upgrade";

import ViewDocument from "./ViewDocument";

import AdminPanel from "./AdminPanel";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Dashboard: Dashboard,
    
    CreateDocument: CreateDocument,
    
    History: History,
    
    Profile: Profile,
    
    Upgrade: Upgrade,
    
    ViewDocument: ViewDocument,
    
    AdminPanel: AdminPanel,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/CreateDocument" element={<CreateDocument />} />
                
                <Route path="/History" element={<History />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Upgrade" element={<Upgrade />} />
                
                <Route path="/ViewDocument" element={<ViewDocument />} />
                
                <Route path="/AdminPanel" element={<AdminPanel />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}