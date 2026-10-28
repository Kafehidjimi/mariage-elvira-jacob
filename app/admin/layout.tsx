import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration RSVP",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="paper min-h-svh">{children}</div>;
}
