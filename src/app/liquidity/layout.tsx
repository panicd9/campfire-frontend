import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liquidity | Campfire",
};

export default function LiquidityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
