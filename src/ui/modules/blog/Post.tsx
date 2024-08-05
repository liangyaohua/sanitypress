import { fetchSanity, groq } from '@/lib/sanity/fetch'
import Breadcrumbs from '@/ui/modules/Breadcrumbs'
import PostContent from './PostContent'

export default async function Post({ post }: { post: Sanity.BlogPost }) {
	const crumbs = await fetchSanity<Sanity.Page[]>(
		groq`*[_type == 'page' && metadata.slug.current in ['index', 'blog']]{
			title,
			metadata
		}`,
	)

	return (
		<>
			<PostContent post={post} />

			<Breadcrumbs
				crumbs={
					crumbs?.map((crumb) => ({
						type: 'internal',
						internal: crumb,
					})) as Omit<Sanity.Link[], '_type' | 'label'>
				}
				currentPage={post}
			/>
		</>
	)
}
