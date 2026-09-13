// import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
// import { prisma } from "@/app/lib/db";
// import { transformTeams, transformUsers } from "@/app/lib/utils";
// import { Role } from "@/app/types";
// import { redirect } from "next/navigation";
// import AdminDashboard from "@/app/components/dashboard/AdminDashboard";

// const AdminPage = async () => {
//   // Get currently logged-in user
//   const currentUser = await getCurrentUser();

//   // If user is not logged in
//   if (!currentUser) {
//     redirect("/login");
//   }

//   // Only ADMIN can access admin dashboard
//   if (!checkUserPermission(currentUser, Role.ADMIN)) {
//     redirect("/unauthorized");
//   }

//   // Fetch users and teams from database
//   const [prismaUsers, prismaTeams] = await Promise.all([
//     prisma.user.findMany({
//       include: {
//         team: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     }),

//     prisma.team.findMany({
//       include: {
//         members: {
//           select: {
//             id: true,
//             name: true,
//             role: true,
//             email: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     }),
//   ]);

//   // Convert Prisma data to application types
//   const users = transformUsers(prismaUsers);
//   const teams = transformTeams(prismaTeams);

//   // Render dashboard
//   return (
//     <AdminDashboard
//       users={users}
//       teams={teams}
//       currentUser={currentUser}
//     />
//   );
// };

// export default AdminPage;



import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";

import {
  transformUsers,
  transformTeams,
} from "@/app/lib/utils";

import AdminDashboard from "@/app/components/dashboard/AdminDashboard";

import { redirect } from "next/navigation";

const AdminPage = async () => {

  // ==========================================
  // CURRENT USER
  // ==========================================

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // ==========================================
  // ADMIN ONLY
  // ==========================================

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // ==========================================
  // GET USERS
  // ==========================================

  const prismaUsers =
    await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        team: true,
      },
    });

  // ==========================================
  // GET TEAMS
  // ==========================================

  const prismaTeams =
    await prisma.team.findMany({
      orderBy: {
        name: "asc",
      },

      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            teamId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

  // ==========================================
  // TRANSFORM DATABASE DATA
  // ==========================================

  const users =
    transformUsers(prismaUsers);

  const teams =
    transformTeams(prismaTeams);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <AdminDashboard
      users={users}
      teams={teams}
      currentUser={user}
    />
  );
};

export default AdminPage;