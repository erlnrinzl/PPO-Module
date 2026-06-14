import { ReactNode } from 'react';
import { canAccess, getDefaultView, getPathForView, getViewFromPath, type Role, type View } from './routeConfig';
import { Navigate } from 'react-router';

export function RoleBasedRoute({ role, view, children }: { role: Role; view: View; children: ReactNode }) {
	if (!canAccess(role, view)) {
		return <Navigate to={getPathForView(getDefaultView(role))} replace />;
	}

	return <>{children}</>;
}