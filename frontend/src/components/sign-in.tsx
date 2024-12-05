import apiUrl from "@/src/lib/api-url";
import clsx from "clsx";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuth } from "@/src/components/auth/auth-context";

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
  const { login } = useAuth();
  const mutation = useMutation({
    mutationFn: async (data: SchemaType) => {
      const response = await fetch(`${apiUrl}/user/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const message =
          response.status === 401
            ? "Email or password incorrect."
            : "Unexpected error. Try again later.";
        throw new Error(message);
      }
      return response.json();
    },
    onSuccess: (body) => {
      const data = body.data;
      const capitalizedFirstName =
        data.firstName[0].toUpperCase() + data.firstName.slice(1);
      const capitalizedLastName =
        data.lastName[0].toUpperCase() + data.lastName.slice(1);
      login({
        token: data.token,
        firstName: capitalizedFirstName,
        lastName: capitalizedLastName,
        gender: data.gender,
        avatar: data.avatar,
      });
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="flex flex-col items-center pt-20">
      <div className="bg-white border-2 border-gray-200 p-4 rounded-lg w-96 flex flex-col shadow-lg">
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          onChange={() => mutation.reset()}
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
              "absolute right-[350px] top-2 w-max p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center select-none",
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
            placeholder="Password"
            className={clsx(
              "p-3 border-2 border-gray-200 appearance-none outline-none focus:border-blue-400 rounded-lg",
              { "border-red-400": errors.password },
            )}
          ></input>
          <p
            className={clsx(
              "absolute right-[350px] top-[80px] w-max p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center select-none",
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
            disabled={mutation.isPending}
            type="submit"
            className={clsx(
              "bg-blue-600 hover:bg-blue-500 text-gray-50 font-bold p-2 rounded-lg",
              {
                "animate-pulse": mutation.isPending,
              },
            )}
          >
            Log in
          </button>
          <p
            className={clsx(
              "absolute right-[350px] top-[140px] w-max p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center select-none",
              {
                invisible: !mutation.isError,
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
            {mutation.isError ? mutation.error.message : ""}
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
        <Link to="/sign-up">
          <div className="flex justify-center mt-2">
            <button className="bg-green-500 hover:bg-green-600 p-3 rounded-lg text-white font-bold w-48">
              Create new account
            </button>
          </div>
        </Link>
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
