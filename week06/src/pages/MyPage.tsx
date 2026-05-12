import { useEffect, useState } from "react";
import { getMyInfo } from "../api/auth";
import type { ResponseMyInfoDto } from "../types/auth";

export default function MyPage() {
  const [me, setMe] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    getMyInfo().then(setMe);
  }, []);

  return <div>My Page {me && `- ${me.data.name}`}</div>;
}
