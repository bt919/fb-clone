import {
  createRootRoute,
  createRouter,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { AuthProvider } from "@/src/components/auth/auth-context";

const rootRoute = createRootRoute();

export const router = createRouter({
  routeTree: rootRoute,
});

export const wrapper = (component: JSX.Element) => {
  const queryClient = new QueryClient();

  const rootRoute = createRootRoute({
    component: () => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </QueryClientProvider>
    ),
  });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => component,
  });
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/home",
    component: () => <div>Welcome to home</div>,
  });
  const routeTree = rootRoute.addChildren([indexRoute, homeRoute]);
  const router = createRouter({ routeTree });

  return router;
};
