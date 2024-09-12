import { defineCollection, z } from "astro:content";

// projects
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

// posts
const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  pubDate: z.date(),
  draft: z.boolean().optional(),
  readingTime: z.string().optional(),
  lastModified: z.date().optional()
})

export const postCollection = defineCollection({
  schema: postSchema
})

export type PostSchema = z.infer<typeof postSchema>;

export type Post = {
  id: string;
  slug: string;
  body: string;
  collection: "posts";
  data: z.infer<typeof postSchema>;
} & { render(): any };

// bytes
const byteSchema = z.object({
  title: z.string(),
  pubDate: z.date(),
});

const byteCollection = defineCollection({
  schema: byteSchema
})

export type ByteSchema = z.infer<typeof byteSchema>;


// skill
const individualSkillSchema = z.object({
  name: z.string(),
  url: z.string().url(),
})

const skillGroupSchema = z.record(z.array(individualSkillSchema));

const skillCollection = defineCollection({
  type: 'data',
  schema: skillGroupSchema
});

export type SkillSchema = z.infer<typeof skillGroupSchema>;

// slide
const slideSchema = z.object({
  description: z.string(),
  link: z.string(),
})

const slideCollection = defineCollection({
  type: 'data',
  schema: z.array(slideSchema)
});

export type SlideSchema = z.infer<typeof slideSchema>;
// end of slide

export const collections = {
  'projects': projectCollection,
  'posts': postCollection,
  'bytes': byteCollection,
  'skills': skillCollection,
  'slides': slideCollection
}