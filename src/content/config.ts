import { defineCollection, z } from "astro:content";

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
  draft: z.boolean().optional()
})

const postCollection = defineCollection({
  schema: postSchema
})

export type PostSchema = z.infer<typeof postSchema>;


export const collections = {
  'projects': projectCollection,
  'posts': postCollection
}