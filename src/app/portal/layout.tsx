import { auth } from "@/app/api/auth/[...nextauth]/route";
import ForcePasswordModal from "@/components/portal/ForcePasswordModal";
import { redirect } from "next/navigation";
import PortalNavbar from "@/components/portal/PortalNavbar";
import PortalFooter from "@/components/portal/PortalFooter";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  const user = session.user as any;
  const mustChangePassword = user?.mustChangePassword === true;

  return (
    <div className="min-h-screen bg-zinc-50 font-noto-thai flex flex-col">
      <PortalNavbar user={user} />
      {mustChangePassword && <ForcePasswordModal />}
      <main className="flex-1 shrink-0 pb-12">{children}</main>
      <PortalFooter />
    </div>
  );
}
