import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { NavBar } from "@/src/components/nav-bar";
import { PostForm } from "@/src/components/post-form";
import { useAuth } from "@/src/components/auth/auth-context";

export const Route = createLazyFileRoute("/home/")({
  component: HomePage,
});

function HomePage() {
  const { checkLoggedIn } = useAuth();

  useEffect(() => {
    checkLoggedIn();
  });

  return (
    <div className="bg-slate-200 h-full">
      <NavBar />
      <div className="w-screen flex flex-col items-center p-4">
        <PostForm />
      </div>
    </div>
  );
}
