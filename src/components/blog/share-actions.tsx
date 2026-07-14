"use client";

import { useMemo } from "react";
import { Copy, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  url: string;
};

export function ShareActions({ title, url }: Props) {
  const whatsappHref = useMemo(() => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, [title, url]);
  const xHref = useMemo(() => `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, [title, url]);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button type="button" variant="outline" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
        Copy link
      </Button>
      <Button asChild type="button" variant="outline">
        <a href={whatsappHref} target="_blank" rel="noreferrer">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      <Button asChild type="button" variant="outline">
        <a href={xHref} target="_blank" rel="noreferrer">
          <Share2 className="h-4 w-4" />X
        </a>
      </Button>
    </div>
  );
}
