"use server";

import z from "zod";
import db from "@/lib/prismadb";
import getUser from "@/utils/user";
import { revalidatePath } from "next/cache";

const schema = z.object({
  username: z.string().min(1, { message: "Please provide a username" }),
  email: z.string().email(),
});

export default async function actionEditProfile(
  state: any,
  formData: FormData
) {
  const user = await getUser();
  const username = formData.get("username");
  const email = formData.get("email");

  const validatedFields = schema.safeParse({
    username,
    email,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const d = await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        username: validatedFields.data.username,
        email: validatedFields.data.email,
      },
    });

    revalidatePath("/");
    return {
      message: d,
    };
  } catch {
    return {
      message: "Editing profile error",
    };
  }
}
