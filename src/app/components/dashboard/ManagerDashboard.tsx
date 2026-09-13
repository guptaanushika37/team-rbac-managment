"use client";

import { useTransition } from "react";
import { Role, Team, User } from "@/app/types";
import apiClient from "@/app/lib/apiClient";

interface ManagerDashboardProps {
  users: User[];
  teams: Team[];
  currentUser: User;
}

const ManagerDashboard = ({
  users,
  teams,
  currentUser,
}: ManagerDashboardProps) => {
  const [isPending, startTransition] = useTransition();

  // ==========================================
  // CHANGE ROLE
  // ==========================================

  const handleRoleAssignment = (
    userId: string,
    newRole: Role
  ) => {
    if (userId === currentUser.id) {
      alert("You cannot change your own role.");
      return;
    }

    startTransition(async () => {
      try {
        await apiClient.updateUserRole(
          userId,
          newRole
        );

        window.location.reload();
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Failed to update role"
        );
      }
    });
  };

  // ==========================================
  // MY TEAM
  // ==========================================

  const myTeamMembers = currentUser.teamId
    ? users.filter(
        (user) =>
          user.teamId === currentUser.teamId
      )
    : [];

  // ==========================================
  // MY TEAM
  // ==========================================

  const myTeam = teams.find(
    (team) => team.id === currentUser.teamId
  );

  // ==========================================
  // ROLE OPTIONS FOR MANAGER
  // ==========================================

  const getRoleOptions = (user: User) => {
    if (user.id === currentUser.id) {
      return [user.role];
    }

    // Manager can only assign USER/GUEST.
    if (
      user.role === Role.ADMIN ||
      user.role === Role.MANAGER
    ) {
      return [user.role];
    }

    return [
      Role.USER,
      Role.GUEST,
    ];
  };

  return (
    <div className="space-y-8">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          Manager Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Manage and view your team members.
        </p>

        <div className="mt-3 text-sm text-slate-500">
          Logged in as{" "}
          <span className="font-medium text-white">
            {currentUser.name}
          </span>{" "}
          ·{" "}
          <span className="text-blue-400">
            MANAGER
          </span>
        </div>

      </div>

      {/* ====================================== */}
      {/* SUMMARY */}
      {/* ====================================== */}

      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">

          <p className="text-sm text-slate-400">
            My Team
          </p>

          <p className="mt-2 text-xl font-bold text-white">
            {myTeam?.name ?? "No Team"}
          </p>

        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">

          <p className="text-sm text-slate-400">
            Team Members
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {myTeamMembers.length}
          </p>

        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">

          <p className="text-sm text-slate-400">
            Users
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {
              myTeamMembers.filter(
                (user) =>
                  user.role === Role.USER
              ).length
            }
          </p>

        </div>

      </div>

      {/* ====================================== */}
      {/* TEAM INFORMATION */}
      {/* ====================================== */}

      {myTeam && (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">

          <h2 className="text-lg font-semibold text-white">
            {myTeam.name}
          </h2>

          {myTeam.description && (
            <p className="mt-2 text-sm text-slate-400">
              {myTeam.description}
            </p>
          )}

          <div className="mt-3">
            <span className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-300">
              Team Code: {myTeam.code}
            </span>
          </div>

        </div>
      )}

      {/* ====================================== */}
      {/* TEAM MEMBERS */}
      {/* ====================================== */}

      <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">

        <div className="border-b border-slate-700 p-5">

          <h2 className="text-lg font-semibold text-white">
            My Team Members ({myTeamMembers.length})
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            You can manage roles below your own role.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-slate-700 text-left">

                <th className="px-5 py-4 text-slate-300">
                  Name
                </th>

                <th className="px-5 py-4 text-slate-300">
                  Email
                </th>

                <th className="px-5 py-4 text-slate-300">
                  Role
                </th>

                <th className="px-5 py-4 text-slate-300">
                  Team
                </th>

              </tr>

            </thead>

            <tbody>

              {myTeamMembers.length === 0 ? (

                <tr>

                  <td
                    colSpan={4}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No members in your team.
                  </td>

                </tr>

              ) : (

                myTeamMembers.map((user) => {

                  const isCurrentUser =
                    user.id === currentUser.id;

                  const roleOptions =
                    getRoleOptions(user);

                  const canChangeRole =
                    !isCurrentUser &&
                    user.role !== Role.ADMIN &&
                    user.role !== Role.MANAGER;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-slate-700"
                    >

                      {/* NAME */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                            {user.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <div className="font-medium text-white">
                              {user.name}
                            </div>

                            {isCurrentUser && (
                              <div className="text-xs text-blue-400">
                                You
                              </div>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td className="px-5 py-4 text-slate-400">
                        {user.email}
                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-4">

                        <select
                          value={user.role}
                          disabled={
                            isPending ||
                            !canChangeRole
                          }
                          onChange={(e) =>
                            handleRoleAssignment(
                              user.id,
                              e.target.value as Role
                            )
                          }
                          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {roleOptions.map(
                            (role) => (
                              <option
                                key={role}
                                value={role}
                              >
                                {role}
                              </option>
                            )
                          )}

                        </select>

                      </td>

                      {/* TEAM */}

                      <td className="px-5 py-4">

                        <span className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300">
                          {myTeam?.name ??
                            "No Team"}
                        </span>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>

      {isPending && (
        <div className="fixed bottom-5 right-5 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          Updating...
        </div>
      )}

    </div>
  );
};

export default ManagerDashboard;