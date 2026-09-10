import { createElement, type ComponentProps } from "react";
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

const nav = createNavigation(routing);

export const { redirect, usePathname, useRouter, getPathname } = nav;

/** Prefetch off by default so each page view does not fan out RSC/ISR cache reads. */
export function Link(props: ComponentProps<typeof nav.Link>) {
  return createElement(nav.Link, { ...props, prefetch: false });
}
