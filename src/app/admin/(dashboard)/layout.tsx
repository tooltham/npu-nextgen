import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const userRole = (session.user as { role?: string }).role;
  if (!session || (userRole !== "ADMIN" && userRole !== "STAFF")) {
    redirect("/admin/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-noto-thai flex">
      {/* Sidebar (Desktop) */}
      <AdminSidebar userRole={userRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar user={user} />
        <main className="flex-1 pb-12 w-full">{children}</main>
        <AdminFooter />
      </div>
    </div>
  );
}
