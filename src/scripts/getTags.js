export default function getTags(posts) {
    // Create a tag count dictionary
    const tagCount = {};

    posts.forEach((post) => {
        const postTags = post.frontmatter.tags;
        if (postTags?.length > 0) {
            postTags.forEach((tag) => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        }
    });

    // Sort tags by count in descending order and return as an array of objects
    const sortedTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .reduce((acc, [tag, count]) => {
            acc[tag] = count;
            return acc;
        }, {});

    return sortedTags;
}