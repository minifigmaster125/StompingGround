import { error } from "@sveltejs/kit"
import { Post } from "../types.ts"

const name = 'such is life'
const website='https://suchaaverchahal.com'
const description='Contemplations during creation - art, engineering, etc.'

async function getPosts() {
	try {
        let posts: Post[] = []

	const paths = import.meta.glob('../../../posts/*.md', { eager: true })

	for (const path in paths) {
		const file = paths[path]
		const slug = path.split('/').at(-1)?.replace('.md', '')

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>
            const tags = metadata.tags
			const post = { ...metadata, slug } satisfies Post
			posts.push(post)
		}
	}

	posts = posts.sort((first, second) =>
    new Date(second.date).getTime() - new Date(first.date).getTime()
	)

	return posts
	} catch (e) {
		error(500, `Error getting posts ${e}`)
	}
  }

  export const prerender = true

  export async function GET() {
    const posts = await getPosts()
    const body = xml(posts)
  
    const headers = {
      'Cache-Control': 'max-age=0, s-maxage=3600',
      'Content-Type': 'application/xml',
    }
    return new Response(body, {headers})
  }
  
  const xml =
    posts => `<rss xmlns:dc="https://purl.org/dc/elements/1.1/" xmlns:content="https://purl.org/rss/1.0/modules/content/" xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
    <channel>
      <title>${name}</title>
      <link>${website}</link>
      <description>${description}</description>
      ${posts
        .map(
          post =>
            `
          <item>
            <title>${post.title}</title>
            <description>${post.description}</description>
            <link>${website}/posts/${post.slug}/</link>
            <pubDate>${new Date(post.date)}</pubDate>
            <content:encoded>
              <div style="margin-top: 50px; font-style: italic;">
                <strong>
                  <a href="${website}/posts/${post.slug}">
                    Keep reading
                  </a>
                </strong>  
              </div>
              </content:encoded>
          </item>
        `,
        )
        .join('')}
    </channel>
  </rss>`