import Link from "next/link";
import { notFound } from "next/navigation";
import MediaPlaceholder from "@/components/MediaPlaceholder";
import { stories } from "@/lib/data";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }) {
  const story = stories.find((s) => s.slug === params.slug);
  if (!story) return {};
  return { title: story.couple, description: story.excerpt };
}

export default function StoryDetail({ params }) {
  const index = stories.findIndex((s) => s.slug === params.slug);
  if (index === -1) notFound();
  const story = stories[index];
  const related = stories.filter((s) => s.slug !== story.slug).slice(0, 2);

  return (
    <article className="pt-24 md:pt-28">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <MediaPlaceholder label={`Hero image — ${story.couple}`} tone={index} ratio="aspect-[16/9]" />
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-10 py-16">
        <p className="text-sm text-stone mb-2">{story.location} · {story.date}</p>
        <h1 className="font-serif italic text-4xl md:text-5xl mb-10">{story.couple}</h1>

        {story.body.map((para, i) => (
          <div key={i}>
            <p className="text-stone leading-relaxed mb-8">{para}</p>
            {i === Math.floor(story.body.length / 2) - 1 && story.body.length > 1 && (
              <div className="my-10">
                <MediaPlaceholder label="In-story image break" tone={(index + 1) % 4} ratio="aspect-[4/3]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {related.length > 0 && (
        <div className="border-t border-charcoal/15">
          <div className="max-w-content mx-auto px-6 md:px-10 py-16">
            <p className="text-sm text-stone mb-8">Related stories</p>
            <div className="grid md:grid-cols-2 gap-10">
              {related.map((s, i) => (
                <Link key={s.slug} href={`/stories/${s.slug}`} className="group block">
                  <MediaPlaceholder label={s.couple} tone={i + 1} ratio="aspect-[16/10]" />
                  <p className="font-serif italic text-xl mt-4">{s.couple}</p>
                  <p className="text-sm text-stone mt-1">{s.location}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
