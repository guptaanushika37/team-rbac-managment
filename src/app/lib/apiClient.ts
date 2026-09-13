import { Role } from "@/app/types";

const apiClient = {
  // =========================
  // LOGIN
  // =========================

  login: async (
    email: string,
    password: string
  ) => {
    const response = await fetch(
      "/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Login failed"
      );
    }

    return data;
  },

  // =========================
  // REGISTER
  // =========================

  register: async ({
    name,
    email,
    password,
    teamCode,
  }: {
    name: string;
    email: string;
    password: string;
    teamCode?: string | null;
  }) => {
    const response = await fetch(
      "/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          teamCode: teamCode || null,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Registration failed"
      );
    }

    return data;
  },

  // =========================
  // GET CURRENT USER
  // =========================

  getCurrentUser: async () => {
    const response = await fetch(
      "/api/auth/me",
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Failed to fetch current user"
      );
    }

    return data;
  },

  // =========================
  // LOGOUT
  // =========================

  logout: async () => {
    const response = await fetch(
      "/api/auth/logout",
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Logout failed"
      );
    }

    return data;
  },

  // =========================
  // GET USERS
  // =========================

  getUsers: async () => {
    const response = await fetch(
      "/api/users",
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to fetch users"
      );
    }

    return data;
  },

  // =========================
  // ASSIGN USER TO TEAM
  // =========================

  assignUserToTeam: async (
    userId: string,
    teamId: string | null
  ) => {
    const response = await fetch(
      `/api/user/${userId}/team`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Failed to update team assignment"
      );
    }

    return data;
  },

  // =========================
  // UPDATE USER ROLE
  // =========================

  updateUserRole: async (
    userId: string,
    role: Role
  ) => {
    const response = await fetch(
      `/api/user/${userId}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Failed to update user role"
      );
    }

    return data;
  },
};

export default apiClient;