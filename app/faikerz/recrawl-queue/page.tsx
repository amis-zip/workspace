"use client";

import { useEffect, useRef } from "react";

export default function RecrawlQueuePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = "/recrawl_queue_v6.html";
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-screen border-0"
      title="Recrawl Queue"
    />
  );
}