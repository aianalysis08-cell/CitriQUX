"use client";

import React from "react";
import { Search, Bell, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import Image from "next/image";

export function Topbar() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 glass border-b border-white/5 z-20 px-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full w-96 group focus-within:ring-2 focus-within:ring-primary-500/50 transition-all">
        <Search className="text-white/30 w-4 h-4 group-focus-within:text-primary-400" />
        <input
          type="text"
          placeholder="Search projects or designs..."
          className="bg-transparent border-none text-xs text-white placeholder:text-white/20 focus:outline-none w-full"
        />
        <span className="text-[10px] font-mono text-white/20 border border-white/10 px-1.5 py-0.5 rounded capitalize">⌘K</span>
      </div>

      <div className="flex-1 md:hidden" />

      {/* Right side tools */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all relative">
          <Bell className="w-5 h-5" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error border-2 border-surface-900" />
        </button>

        <div className="h-6 w-px bg-white/5" />

        <div className="flex items-center gap-3 pl-2 group cursor-pointer relative">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-tight">
              {profile?.name || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-[10px] text-white/30 capitalize">{profile?.subscription_plan || "Free"} Plan</p>
          </div>
          <div className="w-9 h-9 rounded-full gradient-primary p-0.5 glow-primary transition-transform group-hover:scale-105">
            {profile?.avatar_url ? (
              <div className="relative w-full h-full">
                <Image src={profile.avatar_url} fill className="rounded-full object-cover" alt="Avatar" />
              </div>
            ) : (
              <div className="w-full h-full rounded-full bg-surface-900 flex items-center justify-center text-xs font-bold text-white">
                {profile?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* User Menu Dropdown (Simplified for now) */}
          <div className="absolute top-full right-0 mt-2 w-48 glass-strong rounded-2xl border border-white/10 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all shadow-2xl">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-xs font-medium">
              <UserIcon className="w-4 h-4" />
              Profile Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-error/70 hover:text-error hover:bg-error/5 transition-all text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
