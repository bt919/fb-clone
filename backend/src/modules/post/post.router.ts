import { FastifyInstance } from "fastify";
import {
  createPost,
  getPosts,
  createPostWithImage,
} from "@/modules/post/post.service";
import { Type } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { PostWithImage, PostWithText } from "@/modules/post/post.dto";

export default function (fastify: FastifyInstance, opts, done) {
  /** returns a user's posts from most recent */
  fastify.get<{ Body: { limit: number; offset: number } }>(
    "/",
    async function (request, reply) {
      const userId = request.userId;
      const { limit, offset } = request.body;

      const posts = getPosts({ userId, limit, offset }, this.postRepository);

      return reply.status(200).send(posts);
    },
  );

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
  fastify.get("/home", async function (request, reply) {
    return reply.status(200).send({});
  });

  done();
}
