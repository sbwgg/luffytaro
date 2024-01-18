"use server";

import db from "@/lib/prismadb";

export async function actionMarkAllAsRead() {
  try {
    await db.notification.updateMany({
      where: {
        markAllAsRead: false,
      },
      data: {
        markAllAsRead: true,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
