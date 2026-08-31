import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import type { CSSProperties } from "react";

import type { HeroPhoto } from "./types";

import { dataset, projectId } from "./runtime-env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: Image) {
  return imageBuilder.image(source).auto("format").fit("max");
}

type Hotspot = { x: number; y: number };

/**
 * A photograph plus the point of it that must survive the crop. Every image on
 * this site is `fill` + `object-cover`, so the editor's hotspot maps onto
 * object-position — which is the whole reason the crop can be trusted at widths
 * nobody previewed.
 */
export function imageProps(
  source: Image | null | undefined,
  width = 2000,
): { src: string; objectPosition: string } | null {
  if (!source?.asset) return null;
  const hotspot = (source as { hotspot?: Hotspot }).hotspot;
  return {
    src: urlForImage(source).width(width).url(),
    objectPosition: hotspot
      ? `${(hotspot.x * 100).toFixed(1)}% ${(hotspot.y * 100).toFixed(1)}%`
      : "50% 50%",
  };
}

type WithAlt = Image & { alt?: string };

/**
 * The props an <Image fill> needs, from whichever source has one. A Sanity
 * photograph brings its own hotspot and alt; the file in /public keeps the
 * object-position class it was tuned with, because those were picked per
 * breakpoint and a hotspot is a single point.
 */
export function photoProps(
  source: WithAlt | null | undefined,
  fallback: { src: string; className: string; alt: string },
  width = 2000,
) {
  const cms = imageProps(source, width);
  if (!cms) return { ...fallback, style: undefined };
  return {
    src: cms.src,
    className: "object-cover",
    alt: source?.alt ?? fallback.alt,
    style: { objectPosition: cms.objectPosition },
  };
}

/**
 * The hero alone gets a focal point per breakpoint, handed to CSS as variables
 * so one element can hold three positions — inline styles cannot carry a media
 * query. Anything left empty falls back to the hotspot.
 */
export function heroPhotoProps(
  source: HeroPhoto | null | undefined,
  fallback: { src: string; className: string; alt: string },
  width = 3200,
) {
  const cms = imageProps(source, width);
  if (!cms) return { ...fallback, style: undefined };

  const [hotspotX, hotspotY] = cms.objectPosition.split(" ");
  const at = (x: number | undefined) =>
    `${x === undefined || x === null ? hotspotX : `${x}%`} ${hotspotY}`;

  return {
    src: cms.src,
    alt: source?.alt ?? fallback.alt,
    className:
      "object-cover object-[var(--focus-phone)] sm:object-[var(--focus-tablet)] lg:object-[var(--focus-desktop)]",
    style: {
      "--focus-phone": at(source?.focusPhone),
      "--focus-tablet": at(source?.focusTablet),
      "--focus-desktop": at(source?.focusDesktop),
    } as CSSProperties,
  };
}
