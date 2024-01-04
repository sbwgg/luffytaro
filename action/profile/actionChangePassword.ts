"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import db from "@/lib/prismadb";
import getUser from "@/utils/user";
import bcrypt from "bcrypt";

const schema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(4),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password and New password did not match",
    path: ["confirmPassword", "newPassword"],
  });

export async function actionChangePassword(state: any, formData: FormData) {
  const user = await getUser();
  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

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

  const userPassword = await db.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  const passwordConfirm = await bcrypt.compare(
    validatedFields.data.currentPassword,
    userPassword?.password as string
  );

  if (!passwordConfirm)
    return { errors: { currentPassword: ["Wrong password"] } };

  if (currentPassword === newPassword)
    return { errors: { newPassword: ["Please provide a stronger password!"] } };

  const hashPassword = await bcrypt.hash(newPassword as string, 10);

  try {
    const d = await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        password: hashPassword,
      },
    });

    revalidatePath("/");
    return {
      message: d,
    };
  } catch (error) {
    console.log(error);
  }
}
