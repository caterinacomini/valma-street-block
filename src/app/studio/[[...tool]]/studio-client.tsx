"use client";

import dynamic from "next/dynamic";

/**
 * The Studio config carries functions and React components (tools, icons,
 * structure builders) that cannot cross the server/client boundary, and the
 * Studio is a browser app anyway — so load it client-side only.
 */
const Studio = dynamic(
  () => import("./studio-inner").then((m) => m.StudioInner),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100dvh",
          fontFamily: "system-ui, sans-serif",
          color: "#666",
        }}
      >
        Caricamento dello Studio…
      </div>
    ),
  },
);

export function StudioClient() {
  return <Studio />;
}
