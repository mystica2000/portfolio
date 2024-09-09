import type { Post } from "@content/config";

interface Frontmatter {
    frontmatter: {
        title: string;
        minutesRead: string;
    };
}

const regex = /\/([a-zA-Z0-9-]{12,})\.mdx$/;
const extractSlug = (str: string): string => {
    const match = regex.exec(str);
    return match?.[1] ?? "";
}


export const getReadingTimeForPosts = async (postCollection: Post[]) => {
    const posts = await import.meta.glob<Frontmatter>('@content/posts/*.mdx');

    const slugMap = new Map<string, string>();
    Object.keys(posts).forEach((path) => {
        const slug = extractSlug(path);
        if (slug) slugMap.set(slug, path);
    })

    await Promise.all(
        postCollection.map(async post => {
            const path = slugMap.get(post.slug);
            if (path) {
                const { frontmatter } = await posts[path]();
                post.data.readingTime = frontmatter.minutesRead;
            }
        })
    );

    return postCollection
}