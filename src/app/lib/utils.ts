import { Team, User } from "@/app/types";

/**
 * Convert a Prisma User object into the application's User type.
 */
export function transformUser(user: any): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    teamId: user.teamId ?? undefined,
    team: user.team ?? undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Convert multiple Prisma User objects.
 */
export function transformUsers(users: any[]): User[] {
  return users.map(transformUser);
}

/**
 * Convert a Prisma Team object into the application's Team type.
 */
export function transformTeam(team: any): Team {
  return {
    id: team.id,
    name: team.name,
    description: team.description ?? null,
    code: team.code,
    members: team.members ?? [],
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
  };
}

/**
 * Convert multiple Prisma Team objects.
 */
export function transformTeams(teams: any[]): Team[] {
  return teams.map(transformTeam);
}