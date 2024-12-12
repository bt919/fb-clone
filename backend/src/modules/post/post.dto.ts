import { Static, Type } from "@sinclair/typebox";

export const PostWithImage = Type.Object({
  text: Type.Optional(Type.String()),
  imageSizeInBytes: Type.Number({ maximum: 1000000 }),
  mimeType: Type.Union([
    Type.Literal("image/jpeg"),
    Type.Literal("image/jpg"),
    Type.Literal("image/png"),
    Type.Literal("image/webp"),
  ]),
});

export const PostWithText = Type.Object({
  text: Type.String({ minLength: 1, maxLength: 10000 }),
});

export type PostWithImage = Static<typeof PostWithImage>;
export type PostWithText = Static<typeof PostWithText>;
