import { Role } from "@/app/types";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await getCurrentUser();

  // User is not logged in
  if (!user) {
    redirect("/login");
  }

  // Redirect based on user role
  switch (user.role) {
    case Role.ADMIN:
      redirect("/dashboard/admin");

    case Role.MANAGER:
      redirect("/dashboard/manager");

    case Role.USER:
      redirect("/dashboard/user");

    case Role.GUEST:
      redirect("/dashboard/user");

    default:
      redirect("/login");
  }
};

export default DashboardPage;