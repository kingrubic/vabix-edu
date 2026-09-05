import { EngineLanding } from "@/components/bizcar/EngineLanding";

export const metadata = {
  title: "MyBizCar 3D — Động cơ doanh nghiệp MTUA",
  description: "Không gian đánh giá và hình dung quản trị MTUA, tách khỏi website doanh nghiệp VABIX.",
  robots: { index: false, follow: false },
};

export default function BizcarHomePage() {
  return <EngineLanding />;
}
