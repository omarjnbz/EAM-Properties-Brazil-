import { notFound } from "next/navigation";

/** Any unknown address renders the site's own 404 page, inside the normal layout. */
export default function UnknownPage() {
  notFound();
}
