"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  image: string | null;
  description: string | null;
  slug: string;
  createdAt: Date;
  publishedAt: Date | null;
  author: {
    name: string | null;
    image: string | null;
  } | null;
  tags: Array<{ id: string; name: string }>;
}

interface Tag {
  id: string;
  name: string;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Tag Filter Component
function TagFilterSection({
  tags,
  selectedTags,
}: {
  tags: Tag[];
  selectedTags: string[];
}) {
  return (
    <div className="mb-12">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Filter by Tags
      </h2>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedTags.length === 0
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          All Posts
        </Link>
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.name);
          const newTags = isSelected
            ? selectedTags.filter((t) => t !== tag.name)
            : [...selectedTags, tag.name];
          const href =
            newTags.length > 0 ? `/blog?tags=${newTags.join(",")}` : "/blog";

          return (
            <Link
              key={tag.id}
              href={href}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {tag.name}
              {isSelected && <span className="ml-2 text-xs">×</span>}
            </Link>
          );
        })}
      </div>
      {selectedTags.length > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Showing posts tagged with:{" "}
          <span className="font-medium text-foreground">
            {selectedTags.join(", ")}
          </span>
        </p>
      )}
    </div>
  );
}

// Blog Post Card Component
function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {post.image && (
        <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="p-6">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tags=${tag.name}`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Description */}
        {post.description && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {post.author?.image && (
              <img
                src={post.author.image}
                alt={post.author.name || "Author"}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span>{post.author?.name || "Anonymous"}</span>
          </div>
          <time dateTime={new Date(post.publishedAt ?? post.createdAt).toISOString()}>
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
        </div>
      </div>
    </article>
  );
}

// Empty State Component
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <svg
          className="w-8 h-8 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        {hasFilters ? "No posts found" : "No posts yet"}
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        {hasFilters
          ? "Try adjusting your filters to find more posts."
          : "Check back later for new content!"}
      </p>
      {hasFilters && (
        <Link
          href="/blog"
          className="inline-flex items-center mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Clear filters
        </Link>
      )}
    </div>
  );
}

export default function BlogList({
  posts,
  tags,
}: {
  posts: BlogPost[];
  tags: Tag[];
}) {
  const searchParams = useSearchParams();
  const tagsParam = searchParams.get("tags");
  const selectedTags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];

  const filteredPosts =
    selectedTags.length > 0
      ? posts.filter((post) =>
          selectedTags.every((selectedTag) =>
            post.tags.some((tag) => tag.name === selectedTag)
          )
        )
      : posts;

  return (
    <>
      {/* Tag Filters */}
      {tags.length > 0 && (
        <div className="animate-fade-in-up animation-delay-200">
          <TagFilterSection tags={tags} selectedTags={selectedTags} />
        </div>
      )}

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up animation-delay-400">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="animate-fade-in-up animation-delay-400">
          <EmptyState hasFilters={selectedTags.length > 0} />
        </div>
      )}
    </>
  );
}
