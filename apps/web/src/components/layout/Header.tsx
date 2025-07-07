import * as React from "react"
import { useState } from "react";
import { Menu, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between bg-primary px-4 shadow-sm">
      {/* Brand */}
      <span className="text-lg font-semibold text-primary-foreground">
        Employees&nbsp;App
      </span>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-4">
        <Link to="/dashboard">
          <Button
            variant="ghost"
            className={`text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80 ${
              location.pathname === "/dashboard" ? "bg-primary/20" : ""
            }`}
          >
            Dashboard
          </Button>
        </Link>
        <Link to="/employees">
          <Button
            variant="ghost"
            className={`text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80 ${
              location.pathname === "/employees" ? "bg-primary/20" : ""
            }`}
          >
            Employees
          </Button>
        </Link>

        {/* User dropdown */}
        <div className="relative group">
          <Button
            variant="ghost"
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80"
          >
            <User className="mr-2 h-4 w-4" />
            {user?.name}
            <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
          </Button>
          
          {/* Hover dropdown */}
          <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-1">
              <div className="px-3 py-2 text-sm text-muted-foreground border-b">
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs">{user?.email}</div>
                <div className="text-xs capitalize">{user?.role}</div>
              </div>
              <button
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
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
            <Link to="/dashboard" className="text-lg font-medium text-foreground hover:text-primary">
              Dashboard
            </Link>
            <Link to="/employees" className="text-lg font-medium text-foreground hover:text-primary">
              Employees
            </Link>
            <div className="border-t pt-4">
              <div className="text-sm text-muted-foreground mb-2">
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs">{user?.email}</div>
                <div className="text-xs capitalize">{user?.role}</div>
              </div>
              <button
                className="text-lg font-medium text-foreground hover:text-primary flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

