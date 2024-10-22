import { createLazyFileRoute } from "@tanstack/react-router";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import "react-toastify/ReactToastify.css";

import Footer from "@/src/components/footer";
import SignIn from "@/src/components/sign-in";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const location = useLocation();

  useEffect(() => {
    const msg = location.state.message;

    if (msg) {
      toast(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }, []);
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Footer />
    </>
  );
}
