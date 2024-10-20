import apiUrl from "@/src/lib/api-url";
import clsx from "clsx";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  firstName: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Cannot be empty." })
    .max(50, { message: "Too long." }),
  lastName: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Cannot be empty." })
    .max(50, { message: "Too long." }),
  gender: z.enum(["male", "female", "other"], {
    message: "This field is required",
  }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email (example: user@example.com)" }),
  password: z
    .string()
    .min(8, { message: "Must be between 8 and 64 characters." })
    .max(64, { message: "Must be between 8 and 64 characters." }),
});

type SchemaType = z.infer<typeof schema>;

export default function SignUp() {
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });
  const days = new Array(31).fill(0, 0, 31);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = new Date().getFullYear();
  const years = new Array(currentYear - 1905 + 1).fill(
    0,
    0,
    currentYear - 1905 + 1,
  );

  const submitHandler = async (d: SchemaType) => {
    try {
      const res = await fetch(`${apiUrl}/sign-up`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(d),
      });

      if (res.status === 400) {
        setApiError("An account with this email already exists.");
        return;
      }

      if (res.status !== 201) {
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
    <div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        onChange={() => setApiError("")}
        className="flex flex-col items-center text-sm w-[432px]"
      >
        <div className="flex gap-2 p-2 relative">
          <input
            {...register("firstName")}
            placeholder="First name"
            className={clsx(
              "w-full p-2 border-2 border-gray-200 appearance-none outline-none rounded-md",
              { "border-red-400": errors.firstName },
            )}
          ></input>
          <p
            className={clsx(
              "absolute right-[427px] top-[12px] w-[170px] p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center select-none",
              {
                invisible: !errors.firstName,
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
            {errors.firstName ? errors.firstName.message : ""}
          </p>
          <input
            {...register("lastName")}
            placeholder="Surname"
            className={clsx(
              "w-full p-2 border-2 border-gray-200 appearance-none outline-none rounded-md",
              { "border-red-400": errors.lastName },
            )}
          ></input>
          <p
            className={clsx(
              "absolute right-[-166px] top-[12px] w-[170px] p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center select-none",
              {
                invisible: !errors.lastName,
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
            {errors.lastName ? errors.lastName.message : ""}
          </p>
        </div>

        <div className="w-full flex flex-col p-2">
          <p className="text-[12px] opacity-80">Date of birth</p>
          <div className="flex gap-2 justify-center w-full">
            <select className="bg-white outline-gray-200 border-2 border-gray-200 rounded-md p-2 w-full">
              {days.map((_, index) => (
                <option value={index + 1} key={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            <select className="bg-white outline-gray-200 border-2 border-gray-200 rounded-md p-2 w-full">
              {months.map((month) => (
                <option value={month} key={month}>
                  {month}
                </option>
              ))}
            </select>
            <select className="bg-white outline-gray-200 border-2 border-gray-200 rounded-md p-2 w-full">
              {years.map((_, index) => (
                <option value={currentYear - index} key={currentYear - index}>
                  {currentYear - index}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full flex-flex-col p-2 relative">
          <p className="text-[12px] opacity-80">Gender</p>
          <div className="flex gap-2 w-full">
            <div
              className={clsx(
                "border-gray-200 border-2 flex items-center rounded-md w-full",
                { "border-red-400": errors.gender },
              )}
            >
              <label htmlFor="female" className="w-full p-2">
                Female
              </label>
              <input
                {...register("gender")}
                type="radio"
                id="female"
                name="gender"
                value="female"
                className="m-2"
              ></input>
            </div>
            <div
              className={clsx(
                "border-gray-200 border-2 flex items-center rounded-md w-full",
                { "border-red-400": errors.gender },
              )}
            >
              <label htmlFor="male" className="w-full p-2">
                Male
              </label>
              <input
                {...register("gender")}
                type="radio"
                id="male"
                name="gender"
                value="male"
                className="m-2"
              ></input>
            </div>
            <div
              className={clsx(
                "border-gray-200 border-2 flex items-center rounded-md w-full",
                { "border-red-400": errors.gender },
              )}
            >
              <label htmlFor="other" className="w-full p-2">
                Other
              </label>
              <input
                {...register("gender")}
                type="radio"
                id="other"
                name="gender"
                value="other"
                className="m-2"
              ></input>
            </div>
          </div>
          <p
            className={clsx(
              "absolute right-[427px] top-[32px] w-[170px] p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center select-none",
              {
                invisible: !errors.gender,
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
            {errors.gender ? errors.gender.message : ""}
          </p>
        </div>

        <div className="w-full p-2 relative">
          <input
            {...register("email")}
            placeholder="Email address"
            className={clsx(
              "border-2 border-gray-200 p-2 rounded-md outline-none w-full",
              { "border-red-400": errors.email },
            )}
          ></input>
          <p
            className={clsx(
              "absolute right-[-325px] top-[11px] w-[330px] p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center select-none",
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
        </div>

        <div className="w-full p-2 relative">
          <input
            {...register("password")}
            type="password"
            placeholder="New password"
            className={clsx(
              "border-2 border-gray-200 p-2 rounded-md outline-none w-full",
              { "border-red-400": errors.password },
            )}
          ></input>
          <p
            className={clsx(
              "absolute right-[-325px] top-[11px] w-[330px] p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center select-none",
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
        </div>

        <p className="text-[10px] p-2 pb-0 opacity-70">
          People who use our service may have uploaded your contact information
          to Facebook.{" "}
          <a className="text-blue-600 hover:underline hover:cursor-pointer">
            Learn more
          </a>
        </p>

        <p className="text-[10px] p-2 pt-0 mt-2 mb-1 opacity-70">
          By clicking Sign Up, you agree to our{" "}
          <a className="text-blue-600 hover:underline hover:cursor-pointer">
            Terms
          </a>
          ,{" "}
          <a className="text-blue-600 hover:underline hover:cursor-pointer">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a className="text-blue-600 hover:underline hover:cursor-pointer">
            Cookies Policy
          </a>
          . You may receive SMS notificaitons from us and can opt out at any
          time.
        </p>

        <div className="flex justify-center mt-2 relative">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 p-3 rounded-lg text-white font-bold w-48"
          >
            Sign Up
          </button>
          <p
            className={clsx(
              "absolute right-[195px] top-[6px] w-[330px] p-1 rounded-md bg-red-200 text-red-800 opacity-90 flex gap-1 items-center select-none",
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
        </div>

        <Link
          to="/"
          className="text-blue-500 m-3 hover:underline hover:underline-offset-2 hover:cursor-pointer"
        >
          Already have an account?
        </Link>
      </form>
    </div>
  );
}
