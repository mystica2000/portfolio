import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

// projects
const projectSchema = z.object({
    id: z.number(),
    emoji: z.string(),
    name: z.string(),
    url: z.string().url(),
    description: z.array(z.string()),
    live: z.string().url().optional()
});

const projects = defineCollection({
    loader: file("./src/content/projects/projects.json"),
    schema: projectSchema
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

const posts = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
    schema: postSchema
})

// bytes
const byteSchema = z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
});

const bytes = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/bytes" }),
    schema: byteSchema
})

// skill
const individualSkillSchema = z.object({
    name: z.string(),
    url: z.string().url(),
})

const skillGroupSchema = z.array(individualSkillSchema);

const skills = defineCollection({
    loader: file("./src/content/skills/skills.json"),
    schema: skillGroupSchema
});

// slide
const slides = defineCollection({
    loader: file("./src/content/slides/slides.json"),
    schema: z.object({
        description: z.string(),
        link: z.string(),
    })
});

// end of slide
export const collections = {
    projects,
    posts,
    bytes,
    skills,
    slides
}