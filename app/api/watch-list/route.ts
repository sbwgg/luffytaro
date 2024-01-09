import { NextRequest } from "next/server";
import db from "@/lib/prismadb";

export async function GET(req: NextRequest) {
  const user = req.nextUrl.searchParams.get("User") as string;

  try {
    const getWatchList = await db.watchList.findMany({
      where: {
        userId: user,
      },
    });

    return Response.json(getWatchList, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
