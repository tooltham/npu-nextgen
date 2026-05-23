import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/admin/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-noto-thai flex flex-col">
      <AdminNavbar user={user} />
      <main className="flex-1 shrink-0 pb-12 w-full">{children}</main>
      <AdminFooter />
    </div>
  );
}
