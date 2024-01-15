import React from "react";
import NotificationsRow from "./_components/notificationsRow";
import getUser from "@/utils/user";

const NotificationPage = async () => {
  const user = await getUser();

  return (
    <>
      <div className="flex justify-center pt-28">
        <div className="flex-1 max-w-[55rem] min-h-[50vh] mx-3">
          <h1 className="sm:text-xl cursor-pointer">Notifications</h1>

          <div className="mt-3">
            <NotificationsRow user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
