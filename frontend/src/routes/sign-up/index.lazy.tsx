import { createLazyFileRoute } from "@tanstack/react-router";
import { Link, Navigate } from "@tanstack/react-router";

import { useAuth } from "@/src/components/auth/auth-context";
import Footer from "@/src/components/footer";
import SignUp from "@/src/components/sign-up";

export const Route = createLazyFileRoute("/sign-up/")({
  component: SignUpPage,
});

function SignUpPage() {
  const { authData } = useAuth();

  if (authData) {
    return <Navigate to="/home"></Navigate>;
  }
  return (
    <>
      <div className="bg-slate-200 h-[705px]  flex flex-col items-center gap-4 pb-48 pt-">
        <Link to="/">
          <h1 className="text-blue-600 hover:text-blue-500 text-6xl font-bold">
            facebook
          </h1>
        </Link>

        <div className="bg-white rounded-md shadow-lg">
          <div className="flex flex-col items-center border-b-2 mb-2">
            <h2 className="text-2xl font-bold mt-2">Create a new account</h2>
            <p className="text-sm opacity-70 mb-2">It's quick and easy</p>
          </div>

          <SignUp />
        </div>
      </div>

      <Footer />
    </>
  );
}
