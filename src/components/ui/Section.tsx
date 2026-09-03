import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
  id?: string;
}) {
  return <Tag id={id} className={`mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8 ${className}`}>{children}</Tag>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2
        className={`text-balance text-[1.75rem] font-semibold leading-[1.2] sm:text-4xl ${
          light ? "text-white" : "text-vabix-deep-teal"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`measure mt-4 text-base sm:text-[17px] ${light ? "text-white/80" : "text-vabix-muted"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
