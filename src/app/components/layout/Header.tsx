"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/app/types";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const pathname = usePathname();
  

  const navigation = [
    {
      name: "Home",
      href: "/",
      show: true,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      show: true,
    },
  ].filter((item) => item.show);

  const getNavItemClass = (href: string) => {
    let isActive = false;

    if (href === "/") {
      isActive = pathname === "/";
    } else {
      isActive = pathname.startsWith(href);
    }

    return `px-3 py-2 rounded text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl text-white"
          >
            TeamAccess
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={getNavItemClass(item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-slate-300">
                  {user.name}
                </span>

                <button
                  type="button"
                  // onClick={handleLogout}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-slate-300 text-sm hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;