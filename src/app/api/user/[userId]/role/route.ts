import {
  checkUserPermission,
  getCurrentUser,
} from "@/app/lib/auth";

import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    // Get target user ID from URL
    const { userId } = await context.params;

    // Get currently logged-in user
    const currentUser = await getCurrentUser();

    // Check authentication
    if (!currentUser) {
      return NextResponse.json(
        {
          error: "You are not authorized to change user roles",
        },
        {
          status: 401,
        }
      );
    }

    // User cannot change their own role
    if (currentUser.id === userId) {
      return NextResponse.json(
        {
          error: "You cannot change your own role",
        },
        {
          status: 403,
        }
      );
    }

    // Find the user whose role we want to change
    const targetUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Check if target user exists
    if (!targetUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Get new role from request body
    const { role } = await request.json();

    // Validate role
    if (!Object.values(Role).includes(role)) {
      return NextResponse.json(
        {
          error: "Invalid role",
        },
        {
          status: 400,
        }
      );
    }

    // Tell TypeScript that role is a valid Role
    const newRole = role as Role;

    // Role hierarchy
    const roleHierarchy: Record<Role, number> = {
      [Role.GUEST]: 0,
      [Role.USER]: 1,
      [Role.MANAGER]: 2,
      [Role.ADMIN]: 3,
    };

    // Current user must have a higher role
    // than the role they are assigning
    if (
      roleHierarchy[currentUser.role] <=
      roleHierarchy[newRole]
    ) {
      return NextResponse.json(
        {
          error:
            "You can only assign a role lower than your own role",
        },
        {
          status: 403,
        }
      );
    }

    // Current user cannot change someone
    // who has an equal or higher role
    if (
      roleHierarchy[targetUser.role] >=
      roleHierarchy[currentUser.role]
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot change the role of a user with equal or higher role",
        },
        {
          status: 403,
        }
      );
    }

    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
      include: {
        team: true,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } =
      updatedUser;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "User role updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Update role error:", error);

    return NextResponse.json(
      {
        error: "Internal server error, Something went wrong!",
      },
      {
        status: 500,
      }
    );
  }
}