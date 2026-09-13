import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ userId: string }>;
  }
) {
  try {
    // Get user ID from URL
    const { userId } = await context.params;

    // Check logged-in user
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          error: "You are not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    // Only ADMIN can assign teams
    if (currentUser.role !== Role.ADMIN) {
      return NextResponse.json(
        {
          error:
            "You are not authorized to assign teams",
        },
        {
          status: 403,
        }
      );
    }

    // Check target user
    const existingUser =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Read request body
    const body = await request.json();

    const teamId = body.teamId;

    console.log("Team assignment request:", {
      userId,
      teamId,
    });

    // =========================
    // REMOVE FROM TEAM
    // =========================

    if (
      teamId === null ||
      teamId === "" ||
      teamId === undefined
    ) {
      const updatedUser =
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            teamId: null,
          },
          include: {
            team: true,
          },
        });

      const {
        password: _password,
        ...userWithoutPassword
      } = updatedUser;

      return NextResponse.json(
        {
          user: userWithoutPassword,
          message:
            "User removed from team successfully",
        },
        {
          status: 200,
        }
      );
    }

    // =========================
    // VALIDATE TEAM ID
    // =========================

    if (typeof teamId !== "string") {
      return NextResponse.json(
        {
          error: "Invalid team ID",
        },
        {
          status: 400,
        }
      );
    }

    // Check if team exists
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      console.log(
        "Team not found:",
        teamId
      );

      return NextResponse.json(
        {
          error: "Team not found",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // UPDATE USER TEAM
    // =========================

    const updatedUser =
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          teamId: team.id,
        },
        include: {
          team: true,
        },
      });

    // Don't return password
    const {
      password: _password,
      ...userWithoutPassword
    } = updatedUser;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message:
          "User assigned to team successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Team assignment error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error, something went wrong!",
      },
      {
        status: 500,
      }
    );
  }
}