import clsx from "clsx";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import profileImg from "@/src/assets/blank-profile-picture-973460_640.png";
import { useAuth } from "@/src/components/auth/auth-context";

export function AccountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { authData, logout } = useAuth();

  return (
    <>
      <div
        className={clsx(
          "z-0 absolute w-screen h-screen top-[0px] right-[0px]",
          {
            hidden: !isOpen,
          },
        )}
        onClick={() => setIsOpen(!isOpen)}
      ></div>

      <div className="relative bg-gray-200 p-1 rounded-3xl" title="Account">
        <div
          className={clsx(
            "z-10 absolute flex flex-col items-center p-4 top-[50px] right-[5px] bg-gray-100 w-[340px] h-[400px] rounded-lg shadow-lg",
            {
              hidden: !isOpen,
            },
          )}
        >
          <div className="flex items-center gap-2 border border-gray-300 w-[320px] shadow-xl rounded-xl">
            <Link
              className="w-full flex gap-4 items-center m-2 p-2 rounded-lg hover:bg-gray-200"
              to="/"
            >
              <img
                src={authData?.avatar ? authData.avatar : profileImg}
                className="w-9 h-9 rounded-3xl"
                alt="profile picture"
              ></img>
              <p className="font-bold">{`${authData?.firstName} ${authData?.lastName}`}</p>
            </Link>
          </div>

          <div className="flex items-center gap-2 w-[320px]">
            <Link
              className="w-full flex gap-4 items-center mt-4 p-2 rounded-lg hover:bg-gray-200"
              to="/"
            >
              <div className="bg-gray-300 p-2 rounded-3xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-bold">Settings & privacy</p>
            </Link>
          </div>

          <div className="flex items-center gap-2 w-[320px]">
            <Link
              className="w-full flex gap-4 items-center p-2 rounded-lg hover:bg-gray-200"
              to="/"
            >
              <div className="bg-gray-300 p-2 rounded-3xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-bold">Help & Support</p>
            </Link>
          </div>

          <div className="flex items-center gap-2 w-[320px]">
            <Link
              className="w-full flex gap-4 items-center p-2 rounded-lg hover:bg-gray-200"
              to="/"
            >
              <div className="bg-gray-300 p-2 rounded-3xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-bold">Display & Accessibility</p>
            </Link>
          </div>

          <div className="flex items-center gap-2 w-[320px]">
            <Link
              className="w-full flex gap-4 items-center p-2 rounded-lg hover:bg-gray-200"
              to="/"
            >
              <div className="bg-gray-300 p-2 rounded-3xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-semibold">Give feedback</p>
            </Link>
          </div>

          <div className="flex items-center gap-2 w-[320px]">
            <button
              className="w-full flex gap-4 items-center p-2 rounded-lg hover:bg-gray-200"
              onClick={() => logout()}
            >
              <div className="bg-gray-300 p-2 rounded-3xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-bold">Log out</p>
            </button>
          </div>
        </div>

        <img
          src={authData?.avatar ? authData.avatar : profileImg}
          className="w-9 h-9 hover:opacity-80 hover:cursor-pointer rounded-3xl"
          alt="profile picture"
          onClick={() => setIsOpen(!isOpen)}
        ></img>
      </div>
    </>
  );
}
