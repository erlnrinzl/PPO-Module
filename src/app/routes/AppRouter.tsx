import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import { Header } from "../components/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { FlowBUP } from "../components/FlowBUP";
import { FlowHilang } from "../components/FlowHilang";
import { FlowMPP } from "../components/FlowMPP";
import { FlowPengunduranDiri } from "../components/FlowPengunduranDiri";
import { FlowTewas } from "../components/FlowTewas";
import { FlowVerifikasi } from "../components/FlowVerifikasi";
import { MonitoringPage } from "../pages/monitoring/MonitoringPage";
import { RoleStoreProvider, useRoleStore } from "../store/role.store";
import {
  getDefaultView,
  getPathForView,
  getViewFromPath,
  type Role,
  type View,
} from "./routeConfig";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, setCurrentRole } = useRoleStore();
  const currentView =
    getViewFromPath(location.pathname) ?? getDefaultView(currentRole);

  const handleNavigate = (view: View) => {
    navigate(getPathForView(view));
  };

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    const fallbackView =
      getDefaultView(newRole) === currentView ? null : getDefaultView(newRole);

    if (fallbackView) {
      navigate(getPathForView(fallbackView), { replace: true });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#EEF2F7]">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentRole={currentRole}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          currentView={currentView}
          onNavigate={handleNavigate}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function MonitoringRoute({ role }: { role: Role }) {
  const navigate = useNavigate();

  return (
    <RoleBasedRoute role={role} view="monitoring">
      <MonitoringPage
        role={role}
        onNavigate={(view) => navigate(getPathForView(view))}
      />
    </RoleBasedRoute>
  );
}

function BupRoute({ role }: { role: Role }) {
  return (
    <RoleBasedRoute role={role} view="bup">
      <FlowBUP role={role} />
    </RoleBasedRoute>
  );
}

function TewasRoute({ role }: { role: Role }) {
  return (
    <RoleBasedRoute role={role} view="tewas">
      <FlowTewas role={role} />
    </RoleBasedRoute>
  );
}

function PengunduranDiriRoute({ role }: { role: Role }) {
  return (
    <RoleBasedRoute role={role} view="pengunduran-diri">
      <FlowPengunduranDiri role={role} />
    </RoleBasedRoute>
  );
}

function HilangRoute({ role }: { role: Role }) {
  return (
    <RoleBasedRoute role={role} view="hilang">
      <FlowHilang role={role} />
    </RoleBasedRoute>
  );
}

function VerifikasiRoute({ role }: { role: Role }) {
  return (
    <RoleBasedRoute role={role} view="verifikasi">
      <FlowVerifikasi role={role} />
    </RoleBasedRoute>
  );
}

function MppRoute({ role }: { role: Role }) {
  return (
    <RoleBasedRoute role={role} view="mpp">
      <FlowMPP role={role} />
    </RoleBasedRoute>
  );
}

export function AppRouter() {
  return (
    <RoleStoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRouteWrapper />}>
            <Route element={<AppShell />}>
              <Route index element={<DefaultRoute />} />
              <Route path="monitoring" element={<MonitoringRouteWrapper />} />
              <Route path="bup" element={<BupRouteWrapper />} />
              <Route path="tewas" element={<TewasRouteWrapper />} />
              <Route
                path="pengunduran-diri"
                element={<PengunduranDiriRouteWrapper />}
              />
              <Route path="hilang" element={<HilangRouteWrapper />} />
              <Route path="verifikasi" element={<VerifikasiRouteWrapper />} />
              <Route path="mpp" element={<MppRouteWrapper />} />
              <Route path="*" element={<DefaultRoute />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </RoleStoreProvider>
  );
}

function ProtectedRouteWrapper() {
  const location = useLocation();
  const { currentRole } = useRoleStore();

  return <ProtectedRoute role={currentRole} key={location.pathname} />;
}

function DefaultRoute() {
  const { currentRole } = useRoleStore();
  return <Navigate to={getPathForView(getDefaultView(currentRole))} replace />;
}

function MonitoringRouteWrapper() {
  const { currentRole } = useRoleStore();
  return <MonitoringRoute role={currentRole} />;
}

function BupRouteWrapper() {
  const { currentRole } = useRoleStore();
  return <BupRoute role={currentRole} />;
}

function TewasRouteWrapper() {
  const { currentRole } = useRoleStore();
  return <TewasRoute role={currentRole} />;
}

function PengunduranDiriRouteWrapper() {
  const { currentRole } = useRoleStore();
  return <PengunduranDiriRoute role={currentRole} />;
}

function HilangRouteWrapper() {
  const { currentRole } = useRoleStore();
  return <HilangRoute role={currentRole} />;
}

function VerifikasiRouteWrapper() {
  const { currentRole } = useRoleStore();
  return <VerifikasiRoute role={currentRole} />;
}

function MppRouteWrapper() {
  const { currentRole } = useRoleStore();
  return <MppRoute role={currentRole} />;
}

export default AppRouter;
