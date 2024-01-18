"use server";

import db from "@/lib/prismadb";

export async function actionDeleteSelected(notifId: string) {
  try {
    await db.notification.delete({
      where: {
        id: notifId,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
