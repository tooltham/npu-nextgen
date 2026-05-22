import { redirect } from "next/navigation";

export default function ClassroomIndexPage() {
  // Redirect to dashboard so the user can select a module
  redirect("/portal");
}
