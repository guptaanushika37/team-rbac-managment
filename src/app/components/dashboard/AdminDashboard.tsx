"use client";

import { useTransition } from "react";
import { Role, Team, User } from "@/app/types";
import apiClient from "@/app/lib/apiClient";

interface AdminDashboardProps {
  users: User[];
  teams: Team[];
  currentUser: User;
}

const AdminDashboard = ({
  users,
  teams,
  currentUser,
}: AdminDashboardProps) => {
  const [isPending, startTransition] = useTransition();

  // Change user's role
  const handleRoleChange = (
    userId: string,
    role: Role
  ) => {
    if (userId === currentUser.id) {
      alert("You cannot change your own role.");
      return;
    }

    startTransition(async () => {
      try {
        await apiClient.updateUserRole(userId, role);

        window.location.reload();
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Failed to update user role"
        );
      }
    });
  };

  // Assign or remove user from team
  const handleTeamChange = (
    userId: string,
    teamId: string | null
  ) => {
    startTransition(async () => {
      try {
        await apiClient.assignUserToTeam(
          userId,
          teamId
        );

        window.location.reload();
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Failed to update team"
        );
      }
    });
  };

  // Find team name
  const getTeamName = (
    teamId?: string
  ): string => {
    if (!teamId) {
      return "No Team";
    }

    const team = teams.find(
      (item) => item.id === teamId
    );

    return team?.name ?? "No Team";
  };

  // Count managers
  const managerCount = users.filter(
    (user) => user.role === Role.MANAGER
  ).length;

  // Count unassigned users
  const unassignedCount = users.filter(
    (user) => !user.teamId
  ).length;

  return (
    <div className="space-y-8">

      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Manage users, roles and teams.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Logged in as{" "}
          <span className="font-medium text-white">
            {currentUser.name}
          </span>{" "}
          ·{" "}
          <span className="text-blue-400">
            {currentUser.role}
          </span>
        </p>
      </div>

      {/* ============================= */}
      {/* STATISTICS */}
      {/* ============================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Users
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {users.length}
          </p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Teams
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {teams.length}
          </p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Managers
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {managerCount}
          </p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Unassigned Users
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {unassignedCount}
          </p>
        </div>

      </div>

      {/* ============================= */}
      {/* USER MANAGEMENT */}
      {/* ============================= */}

      <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">

        <div className="border-b border-slate-700 p-5">

          <h2 className="text-xl font-semibold text-white">
            User Management
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage user roles and team assignments.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-700 text-left">

                <th className="px-5 py-4 text-sm font-medium text-slate-300">
                  Name
                </th>

                <th className="px-5 py-4 text-sm font-medium text-slate-300">
                  Email
                </th>

                <th className="px-5 py-4 text-sm font-medium text-slate-300">
                  Role
                </th>

                <th className="px-5 py-4 text-sm font-medium text-slate-300">
                  Team
                </th>

                <th className="px-5 py-4 text-sm font-medium text-slate-300">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {users.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No users found.
                  </td>

                </tr>

              ) : (

                users.map((user) => {

                  const isCurrentUser =
                    user.id === currentUser.id;

                  return (

                    <tr
                      key={user.id}
                      className="border-b border-slate-700"
                    >

                      {/* NAME */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                            {user.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <p className="font-medium text-white">
                              {user.name}
                            </p>

                            {isCurrentUser && (
                              <p className="text-xs text-blue-400">
                                You
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {user.email}
                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-4">

                        <select
                          value={user.role}
                          disabled={
                            isPending ||
                            isCurrentUser
                          }
                          onChange={(event) =>
                            handleRoleChange(
                              user.id,
                              event.target.value as Role
                            )
                          }
                          className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          <option value={Role.ADMIN}>
                            ADMIN
                          </option>

                          <option value={Role.MANAGER}>
                            MANAGER
                          </option>

                          <option value={Role.USER}>
                            USER
                          </option>

                          <option value={Role.GUEST}>
                            GUEST
                          </option>

                        </select>

                      </td>

                      {/* TEAM */}

                      <td className="px-5 py-4">

                        <select
                          value={user.teamId ?? ""}
                          disabled={isPending}
                          onChange={(event) =>
                            handleTeamChange(
                              user.id,
                              event.target.value === ""
                                ? null
                                : event.target.value
                            )
                          }
                          className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          <option value="">
                            No Team
                          </option>

                          {teams.map((team) => (

                            <option
                              key={team.id}
                              value={team.id}
                            >
                              {team.name}
                            </option>

                          ))}

                        </select>

                        <p className="mt-1 text-xs text-slate-500">
                          {getTeamName(user.teamId)}
                        </p>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">

                        {user.teamId ? (

                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() =>
                              handleTeamChange(
                                user.id,
                                null
                              )
                            }
                            className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                          >
                            Remove Team
                          </button>

                        ) : (

                          <span className="text-xs text-slate-600">
                            No team
                          </span>

                        )}

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ============================= */}
      {/* TEAM OVERVIEW */}
      {/* ============================= */}

      <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">

        <div className="border-b border-slate-700 p-5">

          <h2 className="text-xl font-semibold text-white">
            Team Overview
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            View team members and managers.
          </p>

        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-3">

          {teams.length === 0 ? (

            <p className="text-sm text-slate-500">
              No teams found.
            </p>

          ) : (

            teams.map((team) => {

              const members = users.filter(
                (user) =>
                  user.teamId === team.id
              );

              const managers = members.filter(
                (user) =>
                  user.role === Role.MANAGER
              );

              return (

                <div
                  key={team.id}
                  className="rounded-lg border border-slate-700 bg-slate-900 p-5"
                >

                  <h3 className="text-lg font-semibold text-white">
                    {team.name}
                  </h3>

                  <p className="mt-1 text-xs text-blue-400">
                    {team.code}
                  </p>

                  {team.description && (
                    <p className="mt-3 text-sm text-slate-400">
                      {team.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-2">

                    <p className="text-sm text-slate-300">
                      Members:{" "}
                      <span className="font-semibold text-white">
                        {members.length}
                      </span>
                    </p>

                    <p className="text-sm text-slate-300">
                      Managers:{" "}
                      <span className="font-semibold text-white">
                        {managers.length}
                      </span>
                    </p>

                  </div>

                  {members.length > 0 && (

                    <div className="mt-5 border-t border-slate-700 pt-4">

                      <p className="mb-2 text-xs font-medium uppercase text-slate-500">
                        Members
                      </p>

                      <div className="space-y-2">

                        {members.map((member) => (

                          <div
                            key={member.id}
                            className="flex items-center justify-between"
                          >

                            <span className="text-sm text-slate-300">
                              {member.name}
                            </span>

                            <span className="text-xs text-slate-500">
                              {member.role}
                            </span>

                          </div>

                        ))}

                      </div>

                    </div>

                  )}

                </div>

              );

            })

          )}

        </div>

      </div>

      {/* ============================= */}
      {/* UPDATING INDICATOR */}
      {/* ============================= */}

      {isPending && (

        <div className="fixed bottom-5 right-5 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
          Updating...
        </div>

      )}

    </div>
  );
};

export default AdminDashboard;