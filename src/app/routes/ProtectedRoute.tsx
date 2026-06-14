import { Navigate, Outlet, useLocation } from 'react-router';
import { getDefaultView, getPathForView, getViewFromPath, type Role} from './routeConfig';

export function ProtectedRoute({ role }: { role: Role }) {
	const location = useLocation();
	const currentView = getViewFromPath(location.pathname);

	if (!currentView) {
		return <Navigate to={getPathForView(getDefaultView(role))} replace />;
	}

	return <Outlet />;
}
