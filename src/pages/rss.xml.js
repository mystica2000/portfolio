import rss from '@astrojs/rss';

import { getCollection } from 'astro:content';

export async function GET(context) {
    const posts = await getCollection('posts');
    const bytes = await getCollection('bytes');

    let combineRSSFeed = [...posts, ...bytes];
    combineRSSFeed.sort((a, b) => Date.parse(b.data.pubDate) - Date.parse(a.data.pubDate));
    console.log(combineRSSFeed);

    let items = combineRSSFeed.map(async (post) => {
        const data = {
            link: `/${post.collection}/${post.slug}/`,
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
        }
        return data;
    });

    return rss({
        title: 'Mystica',
        description: 'Checkout my content around all things tech',
        site: context.site,
        items: await Promise.all(items),
        customData: "<language>en</language> <copyright>All rights reserved 2024, Mystica</copyright>",
    });
}