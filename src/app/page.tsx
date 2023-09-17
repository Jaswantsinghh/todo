"use client"
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { SideBar, Tasks } from '@/components/home';
import { useUserStore } from "@/lib/useUserStore";

export default function Home() {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if(user.accessToken === '') {
      router.push("/login");
    }
  }, [router, user.accessToken])
  return (
    <main className="home">
      <SideBar />
      <div className="home-main">
        <Tasks />
      </div>
    </main>
  )
}
