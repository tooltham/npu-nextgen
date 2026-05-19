"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="font-noto-thai border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
    >
      <LogOut className="mr-2 h-4 w-4" />
      ออกจากระบบ
    </Button>
  );
}
