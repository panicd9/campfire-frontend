import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funding Pools | Campfire",
};

export default function FundingPoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
