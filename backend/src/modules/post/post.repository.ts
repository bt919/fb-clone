import { PrismaClient } from "@prisma/client";
import {
  getPosts,
  getAllPosts,
  createPost,
  createPostWithImage,
} from "@prisma/client/sql";

export type GetPostsType = {
  userId: string;
  resultsPerPage: number;
  pageNumber: number;
};

export type CreatePostType = {
  userId: string;
  text: string;
};

export type CreatePostWithImageType = {
  userId: string;
  text: string;
  imageKey: string;
};

export class PostRepository {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async create(data: CreatePostType) {
    const { userId, text } = data;
    await this.db.$queryRawTyped(createPost(userId, text));
  }

  async createWithImage(data: CreatePostWithImageType) {
    const { userId, text, imageKey } = data;
    await this.db.$queryRawTyped(createPostWithImage(userId, text, imageKey));
  }

  async get({ userId, resultsPerPage, pageNumber }: GetPostsType) {
    const limit = resultsPerPage;
    const offset = pageNumber * resultsPerPage;

    const posts = await this.db.$queryRawTyped(getPosts(userId, limit, offset));

    return posts;
  }

  async getAll({ userId, resultsPerPage, pageNumber }: GetPostsType) {
    const limit = resultsPerPage;
    const offset = pageNumber * resultsPerPage;

    const posts = await this.db.$queryRawTyped(
      getAllPosts(userId, BigInt(limit) as any, BigInt(offset) as any),
    );

    return posts;
  }
}
