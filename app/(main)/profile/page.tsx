import getUser from "@/utils/user";
import React from "react";

import ProfileRow from "./_components/profileRow";

const ProfilePage = async () => {
  const user = await getUser();

  return (
    <div className="flex justify-center items-center pt-20">
      <ProfileRow user={user} />
    </div>
  );
};

export default ProfilePage;
