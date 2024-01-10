import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ScrollToTop from "@/components/scrollToTop";
import getUser from "@/utils/user";
import React from "react";
import { Toaster } from "@/components/ui/sonner";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-[85rem] mx-auto">
        <Navbar user={user} />
        <ScrollToTop />
        <Toaster richColors />
        <div>{children}</div>
        <Footer />
      </div>
    </main>
  );
}
