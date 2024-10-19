import { createLazyFileRoute } from "@tanstack/react-router";

import Footer from "@/src/components/footer";
import SignIn from "@/src/components/sign-in";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <div className="bg-slate-200 h-[705px] flex items-center justify-center gap-20 pb-48">
        <div className="w-[440px]">
          <h1 className="text-blue-600 text-6xl font-bold">facebook</h1>
          <p className="text-2xl mt-3">
            Facebook helps you connect and share with the people in your life.
          </p>
        </div>

        <SignIn />
      </div>

      <Footer />
    </>
  );
}
