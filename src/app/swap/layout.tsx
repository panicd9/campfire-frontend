import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swap | Campfire",
};

export default function SwapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
