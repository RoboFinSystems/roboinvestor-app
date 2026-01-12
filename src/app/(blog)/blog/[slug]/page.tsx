import VideoErrorBoundary from '@/components/common/VideoErrorBoundary'
import { getAllPosts, getPostBySlug, getPostSlugs } from '@/lib/blog'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found | RoboSystems',
    }
  }

  return {
    title: `${post.title} | RoboSystems Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Get all posts for "More posts" section
  const allPosts = getAllPosts()
  const morePosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.date,
    dateModified: post.date,
    publisher: {
      '@type': 'Organization',
      name: 'RoboSystems',
      logo: {
        '@type': 'ImageObject',
        url: 'https://robosystems.ai/images/logo_black.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://robosystems.ai/blog/${post.slug}`,
    },
    image:
      post.coverImage ||
      post.coverVideo ||
      'https://robosystems.ai/images/logo_black.png',
    keywords: post.tags?.join(', '),
  }

  return (
    <article className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section with RoboSystems theme */}
      <div className="relative overflow-hidden">
        {/* Animated background matching landing page */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Navigation with Logo */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/blog"
              className="group inline-flex items-center text-gray-400 transition-colors hover:text-cyan-400"
            >
              <svg
                className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/RoboFinSystems/robosystems"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400 transition-all hover:border-cyan-400 hover:bg-cyan-500/20"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>View on GitHub</span>
              </Link>
            </div>
          </div>

          {post.featured && (
            <span className="mb-4 inline-block rounded-full bg-cyan-500/20 px-4 py-1 text-sm font-semibold text-cyan-400">
              Featured Post
            </span>
          )}

          <h1 className="font-heading mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-400">
            <span className="text-cyan-400">{post.author}</span>
            <span className="text-gray-600">•</span>
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
            <span className="text-gray-600">•</span>
            <span>{post.readingTime}</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-800/50 px-3 py-1 text-sm text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cover Video or Image */}
      {post.coverVideo ? (
        <div className="mx-auto -mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-black">
            <VideoErrorBoundary
              fallbackImage={post.coverImage}
              fallbackAlt={`Cover for ${post.title}`}
            >
              <video
                src={post.coverVideo}
                className="h-auto max-h-[500px] w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </VideoErrorBoundary>
          </div>
        </div>
      ) : post.coverImage ? (
        <div className="mx-auto -mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative h-96 overflow-hidden rounded-xl border border-gray-800">
            <Image
              src={post.coverImage}
              alt={`${post.title} - detailed article header image`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      ) : null}

      {/* Content with dark theme styling */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="prose prose-lg prose-invert prose-headings:font-heading prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300 prose-strong:text-white prose-strong:font-semibold prose-code:text-cyan-400 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-blockquote:border-l-cyan-500 prose-blockquote:text-gray-400 prose-blockquote:italic prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:marker:text-cyan-500 prose-table:border-gray-700 prose-th:bg-gray-900 prose-th:text-white prose-td:text-gray-300 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </div>

      {/* Author Bio Section */}
      <div className="mx-auto max-w-4xl border-t border-gray-800 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-xl font-bold text-white">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-white">{post.author}</h3>
            <p className="mt-1 text-gray-400">
              Contributing to the future of graph databases and AI-powered
              business intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-8 text-center">
          <h3 className="mb-4 text-2xl font-bold text-white">
            Ready to Build Your Knowledge Graph?
          </h3>
          <p className="mb-6 text-gray-300">
            Experience the power of graph databases with RoboSystems.
          </p>
          <Link
            href="https://github.com/RoboFinSystems/robosystems"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <span>Get Started on GitHub</span>
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* More Posts Section */}
      {morePosts.length > 0 && (
        <div className="border-t border-gray-800 bg-gray-900/30 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-white">
              More from RoboSystems Blog
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {morePosts.map((morePost) => (
                <Link
                  key={morePost.slug}
                  href={`/blog/${morePost.slug}`}
                  className="group rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-cyan-500/50 hover:bg-gray-900/70"
                >
                  <h3 className="mb-2 font-bold text-white transition-colors group-hover:text-cyan-400">
                    {morePost.title}
                  </h3>
                  <p className="mb-2 text-sm text-gray-500">
                    {format(new Date(morePost.date), 'MMM d, yyyy')}
                  </p>
                  <p className="line-clamp-2 text-sm text-gray-400">
                    {morePost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
