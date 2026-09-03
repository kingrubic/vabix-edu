import Link from "next/link";

export function Breadcrumb({ items, light = false }: { items: { name: string; href?: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Đường dẫn" className={`text-sm ${light ? "text-white/70" : "text-vabix-muted"}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={`${item.name}-${i}`} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className={light ? "hover:text-white" : "hover:text-vabix-deep-teal"}>
                {item.name}
              </Link>
            ) : (
              <span className={light ? "text-white" : "text-vabix-ink"}>{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
