import db from "@/lib/prismadb";

export const getProfile = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      profile: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      comment: {
        include: {
          replyComment: true,
        },
      },
      replyComment: true,
    },
  });

  return user;
};
