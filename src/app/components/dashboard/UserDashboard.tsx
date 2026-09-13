"use client";

import { Team, User } from "@/app/types";

interface UserDashboardProps {
  currentUser: User;
  teams?: Team[];
}

const UserDashboard = ({
  currentUser,
  teams = [],
}: UserDashboardProps) => {

  const userTeam = teams.find(
    (team) => team.id === currentUser.teamId
  );

  return (
    <div className="space-y-8">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          User Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          View your profile and team information.
        </p>

      </div>

      {/* ====================================== */}
      {/* PROFILE */}
      {/* ====================================== */}

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
            {currentUser.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <h2 className="text-xl font-semibold text-white">
              {currentUser.name}
            </h2>

            <p className="text-sm text-slate-400">
              {currentUser.email}
            </p>

          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* ACCOUNT INFORMATION */}
      {/* ====================================== */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* ROLE */}

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">

          <p className="text-sm text-slate-400">
            Your Role
          </p>

          <div className="mt-3">

            <span className="rounded bg-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-300">
              {currentUser.role}
            </span>

          </div>

        </div>

        {/* TEAM */}

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">

          <p className="text-sm text-slate-400">
            Your Team
          </p>

          {userTeam ? (

            <div className="mt-3">

              <p className="font-semibold text-white">
                {userTeam.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Code: {userTeam.code}
              </p>

            </div>

          ) : (

            <p className="mt-3 text-sm text-slate-500">
              You are not assigned to a team.
            </p>

          )}

        </div>

      </div>

      {/* ====================================== */}
      {/* TEAM DETAILS */}
      {/* ====================================== */}

      {userTeam && (

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">

          <h2 className="text-lg font-semibold text-white">
            Team Information
          </h2>

          {userTeam.description && (
            <p className="mt-2 text-sm text-slate-400">
              {userTeam.description}
            </p>
          )}

          <div className="mt-5">

            <p className="text-sm text-slate-400">
              Team Code
            </p>

            <span className="mt-2 inline-block rounded bg-blue-500/20 px-3 py-1.5 text-sm text-blue-300">
              {userTeam.code}
            </span>

          </div>

        </div>

      )}

      {/* ====================================== */}
      {/* ACCOUNT STATUS */}
      {/* ====================================== */}

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">

        <h2 className="text-lg font-semibold text-white">
          Account
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">

          <div>

            <p className="text-xs text-slate-500">
              User ID
            </p>

            <p className="mt-1 break-all text-sm text-slate-300">
              {currentUser.id}
            </p>

          </div>

          <div>

            <p className="text-xs text-slate-500">
              Account Role
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {currentUser.role}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserDashboard;