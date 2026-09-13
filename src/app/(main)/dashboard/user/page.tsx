// import {
//   getCurrentUser,
// } from "@/app/lib/auth";
// import { prisma } from "@/app/lib/db";
// import { redirect } from "next/navigation";

// const UserPage = async () => {
//   const user = await getCurrentUser();

//   if (!user) {
//     redirect("/login");
//   }

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
//           members: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               role: true,
//             },
//           },
//         },
//       })
//     : null;

//   return (
//     <div className="space-y-8">

//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-white">
//           User Dashboard
//         </h1>

//         <p className="mt-2 text-slate-400">
//           Welcome back, {user.name}
//         </p>
//       </div>

//       {/* Profile */}
//       <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">

//         <h2 className="text-xl font-semibold text-white">
//           My Profile
//         </h2>

//         <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

//           <div>
//             <p className="text-sm text-slate-500">
//               Name
//             </p>

//             <p className="text-white mt-1">
//               {user.name}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-slate-500">
//               Email
//             </p>

//             <p className="text-white mt-1">
//               {user.email}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-slate-500">
//               Role
//             </p>

//             <p className="text-white mt-1">
//               {user.role}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-slate-500">
//               Team
//             </p>

//             <p className="text-white mt-1">
//               {team?.name || "No Team"}
//             </p>
//           </div>

//         </div>

//       </div>

//       {/* Team */}
//       <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">

//         <div className="p-6 border-b border-slate-700">

//           <h2 className="text-xl font-semibold text-white">
//             My Team
//           </h2>

//           {team && (
//             <p className="text-slate-400 mt-1">
//               {team.name} · {team.code}
//             </p>
//           )}

//         </div>

//         {team ? (
//           <div className="overflow-x-auto">

//             <table className="w-full">

//               <thead>
//                 <tr className="border-b border-slate-700">

//                   <th className="text-left px-6 py-4 text-slate-300">
//                     Name
//                   </th>

//                   <th className="text-left px-6 py-4 text-slate-300">
//                     Email
//                   </th>

//                   <th className="text-left px-6 py-4 text-slate-300">
//                     Role
//                   </th>

//                 </tr>
//               </thead>

//               <tbody>

//                 {team.members.map((member) => (
//                   <tr
//                     key={member.id}
//                     className="border-b border-slate-700"
//                   >

//                     <td className="px-6 py-4 text-white">
//                       {member.name}
//                     </td>

//                     <td className="px-6 py-4 text-slate-400">
//                       {member.email}
//                     </td>

//                     <td className="px-6 py-4">
//                       <span className="px-3 py-1 rounded bg-slate-900 text-slate-200 text-sm">
//                         {member.role}
//                       </span>
//                     </td>

//                   </tr>
//                 ))}

//               </tbody>

//             </table>

//           </div>
//         ) : (
//           <div className="p-6">
//             <p className="text-slate-400">
//               You are currently not assigned to a team.
//             </p>
//           </div>
//         )}

//       </div>

//     </div>
//   );
// };

// export default UserPage;












import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";

import UserDashboard from "@/app/components/dashboard/UserDashboard";

import { redirect } from "next/navigation";

const UserPage = async () => {

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "USER") {
    redirect("/dashboard");
  }

  const prismaTeams =
    await prisma.team.findMany({
      orderBy: {
        name: "asc",
      },
    });

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
    <UserDashboard
      currentUser={user}
      teams={teams}
    />
  );
};

export default UserPage;