import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "@/src/components/auth/auth-context";

export const Route = createLazyFileRoute("/home/")({
  component: HomePage,
});

function HomePage() {
  const { checkLoggedIn } = useAuth();

  useEffect(() => {
    checkLoggedIn();
  });

  return <div>Hello /home/!</div>;
}
