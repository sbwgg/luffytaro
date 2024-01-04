"use server";

import z from "zod";
import db from "@/lib/prismadb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export default async function actionSignIn(prev: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const user = await db.user.findFirst({
    where: {
      username: formData.get("username") as string,
    },
  });

  if (!user) return { errors: { username: ["Username doesn't exist"] } };
  const password = formData.get("password") as string;
  const passwordConfirm = await bcrypt.compare(password, user.password);

  if (!passwordConfirm)
    return { errors: { password: ["Username or password incorrect"] } };

  try {
    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN!, {
      expiresIn: "30d",
    });
    cookies().set("token", token, {
      httpOnly: true,
      secure: true,
    });

    return {
      message: user,
    };
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/");
}
