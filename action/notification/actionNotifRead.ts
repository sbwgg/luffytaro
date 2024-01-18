"use server";

import db from "@/lib/prismadb";

export async function actionNotifRead(notifId: string) {
  try {
    await db.notification.update({
      where: {
        id: notifId,
      },
      data: {
        markAllAsRead: true,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
