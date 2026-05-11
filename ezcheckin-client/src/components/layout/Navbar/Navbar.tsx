"use client"
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { ROUTE_MAIN } from "@/routes/main/main.route";
import ThemeToggle from "@/components/home-client/ThemeToggle";

const navLinks = ["About", "Courses", "Curriculum", "Pricing", "Blog", "FAQ"];

const Navbar = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);



  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card border-b py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <a href="#" className="text-xl font-bold glow-text">
          CyberSec
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle/>
          {/* 
          //region button Checkin
          */}
          <Link href={ROUTE_MAIN.MAIN} className="glow-button text-sm">
            Check in ngay
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
         <ThemeToggle/>
          <button onClick={() => setIsOpenMenu(!isOpenMenu)} className="p-2 text-foreground">
            {isOpenMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpenMenu && (
        <div className="md:hidden glass-card mt-2 mx-4 p-4 rounded-xl">
          {navLinks.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setIsOpenMenu(false)}
              className="block py-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {l}
            </a>
          ))}
          <Link href={ROUTE_MAIN.MAIN} className="glow-button block text-center mt-3 text-sm">
            Check in ngay
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
