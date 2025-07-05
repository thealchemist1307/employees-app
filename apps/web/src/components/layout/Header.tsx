import * as React from "react"

import { useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";



export function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const desktopLinks = ["Dashboard", "Employees"] as const;
  const settingsItems = ["Item 1", "Item 2", "Item 3", "Logout"] as const;

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between bg-primary px-4 shadow-sm">
      {/* Brand */}
      <span className="text-lg font-semibold text-primary-foreground">
        Employees&nbsp;App
      </span>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-4">
        {desktopLinks.map((label) => (
          <Button
            key={label}
            variant="ghost"
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80"
          >
            {label}
          </Button>
        ))}

        {/* Settings dropdown */}
        <div className="relative group">
          <Button
            variant="ghost"
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80"
          >
            Settings
            <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
          </Button>
          
          {/* Hover dropdown */}
          <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-1">
              {settingsItems.map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => {
                    if (item === "Logout") {
                      logout();
                      navigate("/login");
                    }
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile hamburger */}
      <Sheet>
        <SheetTrigger className="block md:hidden text-primary-foreground">
          <Menu className="h-5 w-5" />
        </SheetTrigger>

        <SheetContent side="right" className="w-56 pt-10">
          <nav className="flex flex-col space-y-4">
            {["Dashboard", "Employees", ...settingsItems].map((item) => (
              <span
                key={item}
                className="cursor-pointer text-lg font-medium text-foreground hover:text-primary"
              >
                {item}
              </span>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

