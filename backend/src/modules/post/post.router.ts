import { FastifyInstance } from "fastify";
import {
  createPost,
  getPosts,
  createPostWithImage,
  getAllPosts,
} from "@/modules/post/post.service";
import { Integer, Type } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { PostWithImage, PostWithText } from "@/modules/post/post.dto";

export default function (fastify: FastifyInstance, opts, done) {
  /** returns a user's posts from most recent */
  fastify.get<{
    Body: { limit: number; offset: number };
    Params: { resultsPerPage: number; pageNumber: number };
  }>("/", async function (request, reply) {
    const userId = request.userId;
    const { resultsPerPage, pageNumber } = request.params;

    const posts = getPosts(
      { userId, resultsPerPage, pageNumber },
      this.postRepository,
    );

    return reply.status(200).send(posts);
  });

  /** allow a user to create a post with text only
   */
  fastify.post<{ Body: PostWithText }>(
    "/",
    {
      schema: {
        body: PostWithText,
      },
    },
    async function (request, reply) {
      const data = { userId: request.userId, text: request.body.text };
      await createPost(data, this.postRepository);

      return reply.status(201).send({ message: "success" });
    },
  );

  /** allow a user to create a post with an image, and optionally text. For
   * the image upload, return a pre-signed URL that allows PUT requests
   */
  fastify.post<{ Body: PostWithImage }>(
    "/image",
    {
      schema: {
        body: PostWithImage,
      },
    },
    async function (request, reply) {
      const userId = request.userId;
      const { text, imageSizeInBytes, mimeType } = request.body;

      const presignedUrl = await createPostWithImage(
        { userId, text: text ?? "" },
        this.postRepository,
      );

      return reply
        .status(201)
        .send({ message: "success", data: { presignedUrl } });
    },
  );

  /** returns a user's homepage feed which consists of their own posts, as well
   *  as their friends posts
   */
  fastify.get<{ Querystring: { resultsPerPage: number; pageNumber: number } }>(
    "/home",
    async function (request, reply) {
      const userId = request.userId;
      const { resultsPerPage, pageNumber } = request.query;

      const posts = await getAllPosts(
        { userId, resultsPerPage, pageNumber },
        this.postRepository,
      );

      const numberOfPosts = posts[0]?.numberOfPosts;
      const numberOfPages = numberOfPosts
        ? Math.ceil(numberOfPosts / resultsPerPage)
        : 0;

      return reply.status(200).send({
        message: "success",
        data: {
          numberOfPages,
          posts,
        },
      });
    },
  );

  done();
}
