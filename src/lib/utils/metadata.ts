import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/utils/constants";
import { createAbsoluteUrl } from "@/lib/utils/runtime";

export function createSeoMetadata(input?: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const title = input?.title ? `${input.title} | ${APP_NAME}` : APP_NAME;
  const description = input?.description ?? APP_DESCRIPTION;
  const path = input?.path ?? "/";

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: createAbsoluteUrl(path),
      type: "article",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
