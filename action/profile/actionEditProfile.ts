"use server";

import db from "@/lib/prismadb";
import getUser from "@/utils/user";
import { revalidatePath } from "next/cache";
import z from "zod";

const schema = z.object({
  username: z.string().min(1).max(10),
  email: z.string().email(),
});

export default async function actionEditProfile(
  prevState: any,
  formData: FormData
) {
  const user = await getUser();
  const { username, email } = Object.fromEntries(formData.entries());

  const validatedFields = schema.safeParse({
    username,
    email,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const updatedProfile = await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        username: data.username,
        email: data.email,
      },
    });

    return {
      message: updatedProfile,
    };
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/");
}
