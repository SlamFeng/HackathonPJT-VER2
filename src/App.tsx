import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { ToastProvider } from "@/components/ToastProvider";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import CustomerIntake from "@/pages/CustomerIntake";
import AiProfile from "@/pages/AiProfile";
import OotdBreakdown from "@/pages/OotdBreakdown";
import ProductRecommendation from "@/pages/ProductRecommendation";
import SalesTalk from "@/pages/SalesTalk";
import VirtualPreview from "@/pages/VirtualPreview";
import ProposalSummary from "@/pages/ProposalSummary";

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<Outlet />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="intake" element={<CustomerIntake />} />
              <Route path="profile" element={<AiProfile />} />
              <Route path="ootd" element={<OotdBreakdown />} />
              <Route path="recommend" element={<ProductRecommendation />} />
              <Route path="talk" element={<SalesTalk />} />
              <Route path="preview" element={<VirtualPreview />} />
              <Route path="summary" element={<ProposalSummary />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}
