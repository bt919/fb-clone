import profileImg from "@/src/assets/blank-profile-picture-973460_640.png";

export function Post({
  userId,
  fullName,
  profileImageKey,
  postId,
  postedAt,
  isLikedByUser,
  numberOfLikes,
  numberOfComments,
  imageKey,
  postText,
}: {
  userId: string;
  fullName: string;
  profileImageKey: string;
  postId: number;
  postedAt: string;
  isLikedByUser: boolean;
  numberOfLikes: number;
  numberOfComments: number;
  imageKey: string;
  postText: string;
}) {
  const postDate = new Date(postedAt);

  return (
    <div className="w-[680px]  bg-slate-50 shadow-lg rounded-md mt-6 p-2">
      <div className="flex items-center gap-4">
        <img
          src={profileImageKey ? profileImageKey : profileImg}
          className="w-11 h-11 hover:opacity-80 hover:cursor-pointer rounded-3xl"
          alt="profile picture"
        ></img>
        <div>
          <p className="font-bold">{fullName}</p>
          <p className="text-sm">{`${new Date(postedAt).toLocaleDateString()}`}</p>
        </div>
      </div>
      <p className={postText.length > 400 ? "text-sm" : "text-lg"}>
        {postText}
      </p>
      {imageKey ? (
        <div className="w-full flex justify-center mt-2">
          <div className="overflow-hidden rounded-lg">
            <img
              src={`${import.meta.env.VITE_CLOUDFRONT_URL}/${imageKey}`}
              className="w-max"
            />
          </div>
        </div>
      ) : null}

      <div className="flex mt-2">
        <button className="flex items-center justify-center gap-2 h-10 flex-1 hover:bg-slate-200 rounded-md">
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
              d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
            />
          </svg>
          <p>Like</p>
        </button>
        <button className="flex items-center justify-center gap-2 h-10 flex-1 hover:bg-slate-200 rounded-md">
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
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          <p>Comment</p>
        </button>
      </div>
    </div>
  );
}
