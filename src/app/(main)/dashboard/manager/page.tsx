// import {
//   checkUserPermission,
//   getCurrentUser,
// } from "@/app/lib/auth";
// import { prisma } from "@/app/lib/db";
// import { Role } from "@/app/types";
// import { redirect } from "next/navigation";

// const ManagerPage = async () => {
//   const user = await getCurrentUser();

//   if (!user) {
//     redirect("/login");
//   }

//   if (!checkUserPermission(user, Role.MANAGER)) {
//     redirect("/unauthorized");
//   }

//   const myTeamMembers = user.teamId
//     ? await prisma.user.findMany({
//         where: {
//           teamId: user.teamId,
//         },
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
//           teamId: true,
//           createdAt: true,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       })
//     : [];

//   const allTeamMembers = await prisma.user.findMany({
//     where: {
//       role: {
//         not: Role.ADMIN,
//       },
//     },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       role: true,
//       teamId: true,
//     },
//     orderBy: {
//       name: "asc",
//     },
//   });

//   const team = user.teamId
//     ? await prisma.team.findUnique({
//         where: {
//           id: user.teamId,
//         },
//         select: {
//           id: true,
//           name: true,
//           code: true,
//           description: true,
//         },
//       })
//     : null;

//   return (
//     <div className="space-y-8">

//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-white">
//           Manager Dashboard
//         </h1>

//         <p className="mt-2 text-slate-400">
//           Manage your team and view team members
//         </p>
//       </div>

//       {/* Team Information */}
//       <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">

//         <h2 className="text-xl font-semibold text-white">
//           My Team
//         </h2>

//         {team ? (
//           <div className="mt-4">

//             <div className="flex items-center justify-between">

//               <div>
//                 <h3 className="text-2xl font-semibold text-white">
//                   {team.name}
//                 </h3>

//                 <p className="text-slate-400 mt-1">
//                   {team.description || "No description"}
//                 </p>
//               </div>

//               <span className="px-3 py-2 rounded bg-blue-900/50 text-blue-300">
//                 {team.code}
//               </span>

//             </div>

//           </div>
//         ) : (
//           <p className="text-slate-400 mt-4">
//             You are not assigned to a team.
//           </p>
//         )}

//       </div>

//       {/* Team Members */}
//       <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">

//         <div className="p-6 border-b border-slate-700">
//           <h2 className="text-xl font-semibold text-white">
//             My Team Members ({myTeamMembers.length})
//           </h2>

//           <p className="text-slate-400 text-sm mt-1">
//             Members assigned to your team
//           </p>
//         </div>

//         <div className="overflow-x-auto">

//           <table className="w-full">

//             <thead>
//               <tr className="border-b border-slate-700">
//                 <th className="text-left px-6 py-4 text-slate-300">
//                   Name
//                 </th>

//                 <th className="text-left px-6 py-4 text-slate-300">
//                   Email
//                 </th>

//                 <th className="text-left px-6 py-4 text-slate-300">
//                   Role
//                 </th>
//               </tr>
//             </thead>

//             <tbody>

//               {myTeamMembers.map((member) => (
//                 <tr
//                   key={member.id}
//                   className="border-b border-slate-700"
//                 >

//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">

//                       <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
//                         {member.name
//                           .charAt(0)
//                           .toUpperCase()}
//                       </div>

//                       <span className="text-white">
//                         {member.name}
//                       </span>

//                     </div>
//                   </td>

//                   <td className="px-6 py-4 text-slate-400">
//                     {member.email}
//                   </td>

//                   <td className="px-6 py-4">
//                     <span className="px-3 py-1 rounded bg-slate-900 text-slate-200 text-sm">
//                       {member.role}
//                     </span>
//                   </td>

//                 </tr>
//               ))}

//             </tbody>

//           </table>

//         </div>
//       </div>

//       {/* Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

//         <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//           <p className="text-3xl font-bold text-white">
//             {myTeamMembers.length}
//           </p>

//           <p className="text-slate-400 mt-2">
//             Team Members
//           </p>
//         </div>

//         <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//           <p className="text-3xl font-bold text-white">
//             {
//               myTeamMembers.filter(
//                 (member) =>
//                   member.role === Role.USER
//               ).length
//             }
//           </p>

//           <p className="text-slate-400 mt-2">
//             Users
//           </p>
//         </div>

//         <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
//           <p className="text-3xl font-bold text-white">
//             {allTeamMembers.length}
//           </p>

//           <p className="text-slate-400 mt-2">
//             Non-admin Users
//           </p>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default ManagerPage;


import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";

import ManagerDashboard from "@/app/components/dashboard/ManagerDashboard";

import { redirect } from "next/navigation";

const ManagerPage = async () => {

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "MANAGER") {
    redirect("/dashboard");
  }

  const prismaUsers =
    await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        team: true,
      },
    });

  const prismaTeams =
    await prisma.team.findMany({
      orderBy: {
        name: "asc",
      },
    });

  const users = prismaUsers.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    role: item.role,
    teamId: item.teamId ?? undefined,
    team: item.team
      ? {
          id: item.team.id,
          name: item.team.name,
          description: item.team.description,
          code: item.team.code,
          members: [],
          createdAt: item.team.createdAt,
          updatedAt: item.team.updatedAt,
        }
      : undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  const teams = prismaTeams.map((team) => ({
    id: team.id,
    name: team.name,
    description: team.description,
    code: team.code,
    members: [],
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
  }));

  return (
    <ManagerDashboard
      users={users}
      teams={teams}
      currentUser={user}
    />
  );
};

export default ManagerPage;