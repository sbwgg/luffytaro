"use server";

import db from "@/lib/prismadb";
import getUser from "@/utils/user";
import { revalidatePath } from "next/cache";
import z from "zod";
import bcrypt from "bcrypt";

const schema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(4),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and Confirm password dont match!",
    path: ["confirmPassword"],
  });

export async function actionChangePassword(prevState: any, formData: FormData) {
  const user = await getUser();
  const { currentPassword, newPassword, confirmPassword } = Object.fromEntries(
    formData.entries()
  );

  const validatedFields = schema.safeParse({
    currentPassword,
    newPassword,
    confirmPassword,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const currentUser = await db.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  const comparePassword = await bcrypt.compare(
    currentPassword as string,
    currentUser?.password as string
  );

  if (currentPassword === newPassword) {
    return {
      errors: { newPassword: ["Please provide a stronger password!"] },
    };
  }

  if (!comparePassword) {
    return {
      errors: { currentPassword: ["Wrong password!"] },
    };
  }

  const hashPassword = await bcrypt.hash(newPassword as string, 10);

  try {
    const updatedPassword = await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        password: hashPassword,
      },
    });

    return {
      message: updatedPassword,
    };
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/profile");
}
