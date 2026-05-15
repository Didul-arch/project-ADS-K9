import { BrowserRouter, Route, Routes } from "react-router-dom";
import SidebarUser from "./components/SidebarUser";

import Browse from "./pages/Browse";
import Claims from "./pages/Claims";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Report from "./pages/Report";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarUser />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;
