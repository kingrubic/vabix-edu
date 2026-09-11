"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { programs as filePrograms, programGroups } from "@/content/programs";
import { topicCategories } from "@/content/training";
import type { ProgramGroupId, TopicCategoryId, TrainingProgram } from "@/content/types";

export function ProgramCatalog({ programs = filePrograms }: { programs?: TrainingProgram[] }) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<ProgramGroupId | "all">("all");
  const [topic, setTopic] = useState<TopicCategoryId | "all">("all");

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return programs.filter((p) => {
      if (p.status !== "published") return false;
      if (group !== "all" && p.group !== group) return false;
      if (topic !== "all" && !p.topicCategories.includes(topic)) return false;
      if (!query) return true;
      const hay = [p.title, p.shortTitle, p.audience, p.problem, ...p.topics].join(" ").toLowerCase();
      return hay.includes(query);
    });
  }, [q, group, topic, programs]);

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-vabix-deep-teal">Tìm chương trình</span>
          <input
            className="input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tên, đối tượng, chuyên đề…"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-vabix-deep-teal">Nhóm</span>
          <select className="input" value={group} onChange={(e) => setGroup(e.target.value as ProgramGroupId | "all")}>
            <option value="all">Tất cả nhóm</option>
            {programGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-vabix-deep-teal">Lĩnh vực chuyên đề</span>
          <select className="input" value={topic} onChange={(e) => setTopic(e.target.value as TopicCategoryId | "all")}>
            <option value="all">Tất cả lĩnh vực</option>
            {topicCategories.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm text-vabix-muted">{list.length} chương trình phù hợp</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {list.map((p) => (
          <Link key={p.slug} href={`/chuong-trinh/${p.slug}`} className="flex h-full flex-col border border-vabix-deep-teal/10 bg-white p-6 hover:border-vabix-gold">
            <p className="eyebrow">{programGroups.find((g) => g.id === p.group)?.label}</p>
            <h2 className="mt-2 text-lg font-semibold text-vabix-deep-teal">{p.title}</h2>
            <p className="mt-3 flex-1 text-sm text-vabix-muted">{p.audience}</p>
            <p className="mt-4 text-sm font-semibold text-vabix-gold">{p.duration ?? p.durationNote ?? "Liên hệ tư vấn chương trình"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
