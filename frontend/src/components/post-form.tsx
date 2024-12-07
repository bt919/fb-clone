import clsx from "clsx";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

import profileImg from "@/src/assets/blank-profile-picture-973460_640.png";
import { useAuth } from "@/src/components/auth/auth-context";

type PostInputs = {
  text: string;
  image: FileList | null;
};

export function PostForm() {
  const { authData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isFileInputOpen, setIsFileInputOpen] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<PostInputs>();
  const [text, image] = watch(["text", "image"]);

  const onSubmit: SubmitHandler<PostInputs> = (data) => {
    console.log(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx(
          "z-10 mt-24 absolute flex flex-col items-center w-[500px]  bg-slate-50 shadow-md rounded-lg",
          {
            hidden: !isOpen,
          },
        )}
      >
        <h2 className="font-bold text-lg mt-2">Create post</h2>
        <hr className="mt-4 w-full"></hr>
        <div className="flex items-center gap-2 m-2 mr-auto">
          <img
            src={authData?.avatar ? authData.avatar : profileImg}
            className="w-11 h-11 hover:opacity-80 hover:cursor-pointer rounded-3xl"
            alt="profile picture"
          ></img>
          <p className="font-bold">{`${authData?.firstName} ${authData?.lastName}`}</p>
        </div>

        <textarea
          {...register("text")}
          className="w-full m-2 outline-none p-4 bg-slate-50 appearance-none"
          placeholder={`What's on your mind, ${authData?.firstName}?`}
          rows={text?.length > 120 ? 5 : 2}
          spellCheck={false}
        ></textarea>

        <div
          className={clsx(
            "relative flex flex-col items-center bg-slate-50 w-[450px] min-h-[220px] rounded-lg",
            {
              hidden: !isFileInputOpen,
            },
          )}
        >
          <button
            className="absolute z-10 right-[12px] top-[12px] bg-slate-50 p-1 rounded-3xl hover:bg-slate-100"
            onClick={() => {
              setIsFileInputOpen(false);
              setValue("image", null);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <label
            htmlFor="image"
            className="absolute flex flex-col items-center justify-center w-[450px] h-full rounded-md bg-gray-200 hover:bg-gray-300 hover:cursor-pointer"
          >
            <div className="p-2 bg-gray-400 w-min rounded-3xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p>Add a photo</p>
          </label>
          {image?.length ? (
            <img
              src={URL.createObjectURL(image[0])}
              className="z-0 w-full rounded-md"
            ></img>
          ) : null}
          <input
            {...register("image")}
            id="image"
            type="file"
            className="appearance-none w-11/12 bg-gray-200 opacity-0 absolute top-0"
          />
        </div>

        <div className="w-11/12 m-2 p-3 border-2 border-gray-200 rounded-lg flex items-center gap-2">
          <p className="mr-auto">Add to your post</p>
          <button
            title="Photo"
            className="hover:bg-gray-200 p-1 hover:rounded-3xl"
            onClick={() => setIsFileInputOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 text-green-600"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            title="Tag people"
            className="hover:bg-gray-200 p-1 hover:rounded-3xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 text-blue-600"
            >
              <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
            </svg>
          </button>
        </div>

        <button
          disabled={!(text || image?.length)}
          type="submit"
          className={clsx(
            "mt-auto mb-2 w-11/12 bg-blue-600 text-slate-50 font-bold p-2 rounded-lg",
            {
              "bg-gray-300 text-gray-400": !(text || image?.length),
            },
          )}
        >
          Post
        </button>
      </form>

      <div
        className={clsx(
          "fixed w-full h-full top-0 right-0 bg-gray-400 opacity-30",
          {
            hidden: !isOpen,
          },
        )}
        onClick={() => setIsOpen(!isOpen)}
      ></div>

      <div className="flex flex-col bg-slate-50 w-[680px] p-4 rounded-lg shadow-md">
        <div className="flex gap-2 items-center">
          <img
            src={authData?.avatar ? authData.avatar : profileImg}
            className="w-11 h-11 hover:opacity-80 hover:cursor-pointer rounded-3xl"
            alt="profile picture"
          ></img>
          <input
            type="text"
            className="p-3 rounded-3xl bg-gray-200 w-full appearance-none outline-none hover:cursor-pointer hover:bg-gray-300"
            placeholder={`What's on your mind, ${authData?.firstName}?`}
            onClick={() => setIsOpen(!isOpen)}
          ></input>
        </div>

        <hr className="mt-2 mb-4"></hr>
      </div>
    </>
  );
}
