"use client";

import React from "react";
import { DiscussionEmbed } from "disqus-react";

type CommentRowProp = {
  identifier: string;
  title: string;
};

export default function CommentRow({ identifier, title }: CommentRowProp) {
  const url = typeof window !== undefined ? window.location.href : "";

  return (
    <>
      <DiscussionEmbed
        shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!}
        config={{
          url,
          identifier,
          title,
        }}
      />
    </>
  );
}
