import {
  createRootRoute,
  createRouter,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const rootRoute = createRootRoute();

export const router = createRouter({
  routeTree: rootRoute,
});

export const wrapper = (component: JSX.Element) => {
  const queryClient = new QueryClient();

  const rootRoute = createRootRoute({
    component: () => (
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    ),
  });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => component,
  });
  const routeTree = rootRoute.addChildren([indexRoute]);
  const router = createRouter({ routeTree });

  return router;
};
