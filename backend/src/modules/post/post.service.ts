import {
  PostRepository,
  GetPostsType,
  CreatePostType,
} from "@/modules/post/post.repository";
import { v4 as uuidv4 } from "uuid";
import { getPresignedPutUrl } from "@/shared/aws-utils/cloudfront-sign";
import { BadRequestException } from "@/shared/exceptions/exceptions";

export async function getPosts(
  payload: GetPostsType,
  postRepository: PostRepository,
) {
  const posts = await postRepository.get(payload);
  return posts;
}

export async function getAllPosts(
  { userId, resultsPerPage, pageNumber }: GetPostsType,
  postRepository: PostRepository,
) {
  if (resultsPerPage > 10) {
    throw new BadRequestException("Results per page must not exceed 10.");
  }

  const posts = await postRepository.getAll({
    userId,
    resultsPerPage,
    pageNumber,
  });

  return posts;
}

export async function createPost(
  payload: CreatePostType,
  postRepository: PostRepository,
) {
  await postRepository.create(payload);
}

export async function createPostWithImage(
  payload: CreatePostType,
  postRepository: PostRepository,
) {
  const uuid = uuidv4();
  await postRepository.createWithImage({ imageKey: uuid, ...payload });

  const presignedUrl = getPresignedPutUrl({
    s3ObjectKey: uuid,
    expiresInSeconds: 30,
  });

  return presignedUrl;
}
