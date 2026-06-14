import AppRouter from './routes/AppRouter';

export { VIEW_ACCESS, PAGE_LABELS, VIEW_LABELS, canAccess, getDefaultView, getPathForView, getViewFromPath } from './routes/routeConfig';
export type { Role, View } from './routes/routeConfig';

export default function App() {
  return <AppRouter />;
}
