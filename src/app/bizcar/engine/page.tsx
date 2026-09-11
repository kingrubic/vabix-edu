import { redirect } from "next/navigation";
import { bizcarPath } from "@/lib/bizcarPaths";

export default function EngineModulePage() {
  redirect(bizcarPath.home);
}
