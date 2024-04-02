import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const discordInviteLink = "https://discord.gg/ZkKYPA5VCD"; // Replace with your actual Discord invite link

  return (
    <div className="flex flex-col items-center px-3 py-5 lg:px-10 mt-24 border-t border-zinc-800">
      <div className="flex items-center gap-x-3">
        {/* Your logo or image */}
        <Image
          src="/your-logo.png" // Path to your logo image
          alt="Logo"
          width={100}
          height={100}
          className="w-[2.4rem] h-[2.4rem] md:w-[2.9rem] md:h-[2.9rem] rounded-full"
          priority
        />
        <Link href="/" className="text-sm md:text-xl font-medium">
          bertoo.pro
        </Link>
      </div>

      <div className="mt-5">
        <p className="text-zinc-500 text-center text-sm">
          Bertoo.pro does not store any files on our server, we only link to
          media which is hosted on 3rd party services.
        </p>
      </div>

      <div className="mt-5">
        {/* Discord Invite Button */}
        <a
          href={discordInviteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
        >
          Discord
        </a>
      </div>
    </div>
  );
};

export default Footer;