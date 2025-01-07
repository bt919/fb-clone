import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, Fragment } from "react";

import apiUrl from "@/src/lib/api-url";
import { Post } from "@/src/components/post";
import { useAuth } from "@/src/components/auth/auth-context";

type PostType = {
  userId: string;
  fullName: string;
  profileImageKey: string;
  postId: number;
  postedAt: string;
  isLikedByUser: boolean;
  numberOfLikes: number;
  numberOfComments: number;
  numberOfPosts: number;
  imageKey: string;
  postText: string;
};

export function Posts() {
  const { authData } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);

  const resultsPerPage = 1;
  const fetchPosts = async ({ pageParam }: { pageParam: number }) => {
    const token = authData?.token;
    console.log("token --- ", token);
    const res = await fetch(
      `${apiUrl}/post/home?resultsPerPage=${resultsPerPage}&pageNumber=${pageParam}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return res.json();
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.data.numberOfPages <= lastPageParam + 1) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => {
        return (
          <Fragment key={i}>
            {group.data.posts.map((post: PostType, j: number) => {
              return <Post key={j} {...post} />;
            })}
          </Fragment>
        );
      })}
      <button onClick={() => fetchNextPage()}>Fetch</button>
    </>
  );
}
