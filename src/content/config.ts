import { defineCollection, z, type Render } from "astro:content";

const projectSchema = z.object({
  emoji: z.string(),
  name: z.string(),
  url: z.string().url(),
  description: z.array(z.string()),
  live: z.string().url().optional()
});

export type ProjectSchema = z.infer<typeof projectSchema>;

const projectCollection = defineCollection({
  type: 'data',
  schema: z.array(projectSchema)
});

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  date: z.date(),
  draft: z.boolean().optional(),
  readingTime: z.string().optional(),
})

export const postCollection = defineCollection({
  schema: postSchema
})

export type PostSchema = z.infer<typeof postSchema>;

const byteSchema = z.object({
  title: z.string(),
  date: z.date(),
  draft: z.boolean().optional()
});

const byteCollection = defineCollection({
  schema: byteSchema
})

export type ByteSchema = z.infer<typeof byteSchema>;

export type Post = {
  id: string;
  slug: string;
  body: string;
  collection: "posts";
  data: z.infer<typeof postSchema>;
} & { render(): Render[".md"] };

export const collections = {
  'projects': projectCollection,
  'posts': postCollection,
  'bytes': byteCollection
}