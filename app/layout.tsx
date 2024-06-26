import type { Metadata } from "next";
import { Pathway_Extreme } from "next/font/google";
import { Analytics } from "@vercel/analytics/react" 
import "./globals.css";
import ReactQueryProvider from "@/utils/reactquery";
import ProgressbarProvider from "@/utils/progressbar";
import Signin from "@/components/signin";
import SocketProvider from "@/utils/socketProvider";
import getUser from "@/lib/user";

const pathway_extreme = Pathway_Extreme({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Watch Sub/Dub Anime Online For Free Without Ads on bertoo.pro",
  description: "Anime streaming app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <html lang="en">
      <body className={pathway_extreme.className}>
        <ReactQueryProvider>
          <SocketProvider user={user}>
            <Signin />
            <ProgressbarProvider>{children}</ProgressbarProvider>
          </SocketProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
