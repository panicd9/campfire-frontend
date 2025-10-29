"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import WalletAdapter from "./WalletAdapter";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "navbar-link-active" : "";
  };

  const isMobileActive = (path: string) => {
    return pathname === path ? "navbar-link-active" : "";
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-wrapper">
            <Link href="/">
              <img
                src="/assets/532231e812bd08956634e20dcd30db9d_30726.png"
                loading="eager"
                alt="Campfire Logo"
                className="navbar-logo"
              />
            </Link>
            <div className="navbar-links-wrapper">
              <Link href="/" className={`navbar-link ${isActive("/")}`}>
                Dashboard
              </Link>
              <Link
                href="/portfolio"
                className={`navbar-link ${isActive("/portfolio")}`}
              >
                Portfolio
              </Link>
              <Link href="/swap" className={`navbar-link ${isActive("/swap")}`}>
                Swap
              </Link>
              <Link
                href="/funding-pool"
                className={`navbar-link ${isActive("/funding-pool")}`}
              >
                Funding Pools
              </Link>
              <Link
                href="/liquidity"
                className={`navbar-link ${isActive("/liquidity")}`}
              >
                Liquidity
              </Link>
            </div>
            <div className="cta-flex">
              <WalletAdapter />
            </div>
          </div>
        </div>
      </nav>
      <div className="navbar-mobile">
        <div className="container">
          <div className="navbar-wrapper-mobile">
            <Link
              href="/"
              className={`mobile-navbar-link ${isMobileActive("/")}`}
            >
              <img
                src="/assets/b6bd938314ce99754c4c23b6f74d224e_594.svg"
                loading="eager"
                alt="Dashboard"
                className="navbar-icon"
              />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/portfolio"
              className={`mobile-navbar-link ${isMobileActive("/portfolio")}`}
            >
              <img
                src="/assets/51c43f2f4ec357f6cc2f34bd36dfeffb_1234.svg"
                loading="eager"
                alt="Portfolio"
                className="navbar-icon"
              />
              <span>Portfolio</span>
            </Link>
            <Link
              href="/swap"
              className={`mobile-navbar-link ${isMobileActive("/swap")}`}
            >
              <img
                src="/assets/ed8cbc2a9807130d9281a4f8b1edf911_2376.svg"
                loading="eager"
                alt="Swap"
                className="navbar-icon"
              />
              <span>Swap</span>
            </Link>
            <Link
              href="/funding-pool"
              className={`mobile-navbar-link ${isMobileActive(
                "/funding-pool"
              )}`}
            >
              <img
                src="/assets/26d20f15f5c6d55baf8e69931a24fb8b_2356.svg"
                loading="eager"
                alt="Funding Pool"
                className="navbar-icon"
              />
              <span>Funding Pool</span>
            </Link>
            <Link
              href="/liquidity"
              className={`mobile-navbar-link ${isMobileActive("/liquidity")}`}
            >
              <img
                src="/assets/061653fadb5212e8de611c3e94d9ca21_1782.svg"
                loading="eager"
                alt="Liquidity"
                className="navbar-icon"
              />
              <span>Liquidity</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
