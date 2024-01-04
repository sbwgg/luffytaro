"use server";

import z from "zod";
import db from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

const schema = z.object({
  username: z.string(),
  email: z.string({ invalid_type_error: "Invalid Email" }),
  password: z.string(),
});

export default async function actionSignUp(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = validatedFields.data;

  const user = await db.user.findFirst({
    where: {
      username,
    },
  });
  const userEmail = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    return {
      errors: { username: ["Username is already exist"] },
    };
  }

  if (userEmail) {
    return {
      errors: { email: ["Email is already exist"] },
    };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const d = await db.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });

    return {
      message: d,
    };
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/");
}
