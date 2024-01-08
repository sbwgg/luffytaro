import db from "@/lib/prismadb";
import getUser from "@/utils/user";

export default async function getWatchList() {
  const user = await getUser();

  try {
    const data = await db.watchList.findMany({
      where: {
        userId: user?.id,
      },
    });

    return data;
  } catch {
    return null;
  }
}
