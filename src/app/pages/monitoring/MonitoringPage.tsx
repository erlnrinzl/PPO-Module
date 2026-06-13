import { MonitoringDashboard } from '../../features/monitoring';
import { Role } from '../../types/role.types';
import { View } from '../../types/view.types';

interface MonitoringPageProps {
    role: Role;
    onNavigate: (view: View) => void;
};
  
export function MonitoringPage({ role, onNavigate }: MonitoringPageProps) {
    return (
      <MonitoringDashboard role={role} onNavigate={onNavigate} />
    );
}