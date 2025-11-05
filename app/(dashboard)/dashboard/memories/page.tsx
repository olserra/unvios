import MemoriesPanel from "@/components/dashboard/MemoriesPanel";

export const metadata = {
  title: "Memories",
  description: "Manage your personal memories with Unvios.",
  openGraph: {
    title: "Memories — Unvios",
    description: "Manage your personal memories with Unvios.",
    type: "website",
    images: [
      {
        url: "/metadata-img.png",
        width: 1200,
        height: 630,
        alt: "Unvios - Your Personal Memory Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memories — Unvios",
    description: "Manage your personal memories with Unvios.",
    images: ["/metadata-img.png"],
  },
};

export default function Page() {
  return <MemoriesPanel />;
}
