import apiUrl from "@/src/lib/api-url";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email (example: user@example.com)" }),
  password: z
    .string()
    .min(8, { message: "Must be between 8 and 64 characters" })
    .max(64, { message: "Must be between 8 and 64 characters" }),
});

type SchemaType = z.infer<typeof schema>;

export default function SignIn() {
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  const submitHandler = async (d: SchemaType) => {
    try {
      const res = await fetch(`${apiUrl}/sign-in`, {
        body: JSON.stringify(d),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        setApiError("Incorrect email or password.");
        return;
      }

      if (res.status !== 200) {
        setApiError("Unexpected error. Please try again later.");
        return;
      }

      const data = await res.json();
      console.log({ data });
    } catch (err) {
      setApiError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center pt-20">
      <div className="bg-white border-2 border-gray-200 p-4 rounded-lg w-96 flex flex-col shadow-lg">
        <form
          onSubmit={handleSubmit(submitHandler)}
          onChange={() => setApiError("")}
          className="flex flex-col gap-4 relative"
        >
          <input
            {...register("email")}
            placeholder="Email address or phone number"
            className={clsx(
              "p-3 border-2 border-gray-200 appearance-none outline-none focus:border-blue-400 rounded-lg",
              { "border-red-400": errors.email },
            )}
          ></input>
          <p
            className={clsx(
              "absolute right-[350px] top-2 w-[370px] bg-gray-100 p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center",
              {
                invisible: !errors.email,
              },
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            {errors.email ? errors.email.message : ""}
          </p>
          <input
            {...register("password")}
            type="password"
            placeholder="password"
            className={clsx(
              "p-3 border-2 border-gray-200 appearance-none outline-none focus:border-blue-400 rounded-lg",
              { "border-red-400": errors.password },
            )}
          ></input>
          <p
            className={clsx(
              "absolute right-[350px] top-[80px] w-[370px] bg-gray-100 p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center",
              { invisible: !errors.password },
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            {errors.password ? errors.password.message : ""}
          </p>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-gray-50 font-bold p-2 rounded-lg"
          >
            Log in
          </button>
          <p
            className={clsx(
              "absolute right-[350px] top-[140px] w-[370px] bg-gray-100 p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center",
              {
                invisible: !apiError.length,
              },
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            {apiError.length ? apiError : ""}
          </p>
        </form>
        <div className="flex justify-center mb-3">
          <a
            aria-disabled
            className="text-blue-500 mt-4 hover:underline hover:underline-offset-2 hover:cursor-pointer"
          >
            Forgotten password?
          </a>
        </div>
        <div className="bg-slate-300 h-[1px] w-full m-2"></div>
        <div className="flex justify-center mt-2">
          <button className="bg-green-500 hover:bg-green-600 p-3 rounded-lg text-white font-bold w-48">
            Create new account
          </button>
        </div>
      </div>

      <p className="text-sm mt-6">
        <span className="font-bold hover:underline hover:cursor-pointer">
          Create a Page
        </span>{" "}
        for a celebrity, brand or business.
      </p>
    </div>
  );
}
