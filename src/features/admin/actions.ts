"use server";

import { revalidatePath } from "next/cache";
import { STANDARD_VERSION_ID } from "@/standards/bmdo-mds-01-mtua-0.1";
import { mutateStore } from "@/db/store";
import { writeAudit } from "@/db/repo";
import { getCurrentUser } from "@/security/session";
import { isAcademicAdmin, isPlatformAdmin } from "@/security/rbac";
import { z } from "zod";

const weightSchema = z.object({
  connectionCode: z.enum(["MT", "MU", "MA", "TU", "TA", "UA"]),
  weight: z.coerce.number().min(0.1).max(10),
  changeReason: z.string().min(4).max(400),
});

export async function updateCfsWeightAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !isAcademicAdmin(user.access)) return { error: "Chỉ quản trị học thuật." };
  const parsed = weightSchema.safeParse({
    connectionCode: formData.get("connectionCode"),
    weight: formData.get("weight"),
    changeReason: formData.get("changeReason"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  let createdNewVersion = false;
  await mutateStore((store) => {
    const used = store.assessments.some((item) => item.standardVersionId === STANDARD_VERSION_ID);
    if (used) {
      createdNewVersion = true;
      const newId = crypto.randomUUID();
      const current = store.standardVersions.find((item) => item.id === STANDARD_VERSION_ID);
      if (!current) throw new Error("Không tìm thấy chuẩn gốc.");
      store.standardVersions.push({
        ...current,
        id: newId,
        version: "0.1-dev-fork",
        changeReason: parsed.data.changeReason,
        impactNote: "Bản fork để không ghi đè chuẩn đã có đánh giá.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user.id,
      });
      for (const row of store.standardComponents.filter((item) => item.standardVersionId === STANDARD_VERSION_ID)) {
        store.standardComponents.push({ ...row, id: crypto.randomUUID(), standardVersionId: newId });
      }
      const criterionMap = new Map<string, string>();
      for (const row of store.standardCriteria.filter((item) => item.standardVersionId === STANDARD_VERSION_ID)) {
        const id = crypto.randomUUID();
        criterionMap.set(row.id, id);
        store.standardCriteria.push({ ...row, id, standardVersionId: newId });
      }
      for (const row of store.criterionAnchors) {
        const nextCriterion = criterionMap.get(row.criterionId);
        if (nextCriterion) store.criterionAnchors.push({ ...row, id: crypto.randomUUID(), criterionId: nextCriterion });
      }
      for (const row of store.standardCfsConnections.filter((item) => item.standardVersionId === STANDARD_VERSION_ID)) {
        store.standardCfsConnections.push({
          ...row,
          id: crypto.randomUUID(),
          standardVersionId: newId,
          weight: row.code === parsed.data.connectionCode ? parsed.data.weight : row.weight,
        });
      }
      const th = store.standardThresholds.find((item) => item.standardVersionId === STANDARD_VERSION_ID);
      if (th) store.standardThresholds.push({ ...th, id: crypto.randomUUID(), standardVersionId: newId });
    } else {
      const row = store.standardCfsConnections.find(
        (item) => item.standardVersionId === STANDARD_VERSION_ID && item.code === parsed.data.connectionCode,
      );
      if (row) row.weight = parsed.data.weight;
    }
  });

  await writeAudit({
    actorUserId: user.id,
    organizationId: null,
    assessmentId: null,
    action: "UPDATE_STANDARD_WEIGHT",
    entityType: "standard_cfs_connection",
    entityId: parsed.data.connectionCode,
    oldValue: null,
    newValue: String(parsed.data.weight),
    reason: parsed.data.changeReason,
    standardVersionId: STANDARD_VERSION_ID,
    ip: null,
  });
  revalidatePath("/bizcar/admin/standards/mtua");
  return {
    ok: true,
    message: createdNewVersion
      ? "Chuẩn gốc đã có đánh giá — đã tạo phiên bản fork, không ghi đè."
      : "Đã cập nhật trọng số trên phiên bản chưa gắn đánh giá.",
  };
}

export async function toggleUserAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !isPlatformAdmin(user.access)) return { error: "Chỉ quản trị nền tảng." };
  const userId = String(formData.get("userId") ?? "");
  await mutateStore((store) => {
    const row = store.users.find((item) => item.id === userId);
    if (row) row.isActive = !row.isActive;
  });
  revalidatePath("/bizcar/admin/users");
  return { ok: true };
}
