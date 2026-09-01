import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * The way out. Draft Mode is a cookie, so it follows you off the Studio and on
 * to the ordinary site, where it keeps the preview overlay running and leaves
 * stega characters inside every string — with no way to notice or undo it.
 */
export async function GET() {
  (await draftMode()).disable();
  redirect("/");
}
