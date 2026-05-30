import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import Report from "./pages/Report";
import Claim from "./pages/Claim";
import Detail from "./pages/Detail";
import DetailClaim from "./pages/DetailClaim";
import History from "./pages/History";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserManagement from "./pages/UserManagement";
import UserProfile from "./pages/UserProfile";

import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { ItemsProvider } from "./context/ItemsContext";

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <LanguageProvider>
          <ItemsProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                  path="/*"
                  element={
                    <div className="app-container">
                      <Sidebar />
                      <main className="main-content">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/browse" element={<Browse />} />
                          <Route path="/report" element={<Report />} />
                          <Route path="/detail/:id" element={<Detail />} />
                          <Route path="/claim/:id" element={<Claim />} />
                          <Route
                            path="/detail-claim/:id"
                            element={<DetailClaim />}
                          />
                          <Route path="/history" element={<History />} />
                          <Route path="/users" element={<UserManagement />} />
                          <Route path="/users/:id" element={<UserProfile />} />
                        </Routes>
                      </main>
                    </div>
                  }
                />
              </Routes>
            </Router>
          </ItemsProvider>
        </LanguageProvider>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
