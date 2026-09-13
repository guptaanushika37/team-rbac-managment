// import {
//   checkUserPermission,
//   getCurrentUser,
// } from "@/app/lib/auth";

// import { prisma } from "@/app/lib/db";
// import { Role } from "@/app/types";
// import { NextRequest, NextResponse } from "next/server";

// export async function PATCH(
//   request: NextRequest,
//   context: { params: Promise<{ userId: string }> }
// ) {
//   try {
//     // Get target user ID
//     const { userId } = await context.params;

//     // Get logged-in user
//     const currentUser = await getCurrentUser();

//     // Check authentication
//     if (!currentUser) {
//       return NextResponse.json(
//         {
//           error: "You are not authenticated",
//         },
//         {
//           status: 401,
//         }
//       );
//     }

//     // Only ADMIN and MANAGER can change roles
//     if (
//       currentUser.role !== Role.ADMIN &&
//       currentUser.role !== Role.MANAGER
//     ) {
//       return NextResponse.json(
//         {
//           error: "You are not authorized to change user roles",
//         },
//         {
//           status: 403,
//         }
//       );
//     }

//     // Prevent user from changing their own role
//     if (userId === currentUser.id) {
//       return NextResponse.json(
//         {
//           error: "You cannot change your own role",
//         },
//         {
//           status: 403,
//         }
//       );
//     }

//     // Check if target user exists
//     const existingUser = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//     });

//     if (!existingUser) {
//       return NextResponse.json(
//         {
//           error: "User not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }

//     // Get requested role
//     const { role } = await request.json();

//     // Validate requested role
//     if (!Object.values(Role).includes(role)) {
//       return NextResponse.json(
//         {
//           error: "Invalid role",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     const newRole = role as Role;

//     // Role hierarchy
//     const roleHierarchy: Record<Role, number> = {
//       [Role.GUEST]: 0,
//       [Role.USER]: 1,
//       [Role.MANAGER]: 2,
//       [Role.ADMIN]: 3,
//     };

//     // Current user must have a higher role
//     // than the role they are assigning
//     if (
//       roleHierarchy[currentUser.role] <=
//       roleHierarchy[newRole]
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "You can only assign a role lower than your own role",
//         },
//         {
//           status: 403,
//         }
//       );
//     }

//     // Current user cannot change someone
//     // with an equal or higher role
//     if (
//       roleHierarchy[existingUser.role] >=
//       roleHierarchy[currentUser.role]
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "You cannot change the role of a user with equal or higher role",
//         },
//         {
//           status: 403,
//         }
//       );
//     }

//     // Update user role
//     const updatedUser = await prisma.user.update({
//       where: {
//         id: userId,
//       },
//       data: {
//         role: newRole,
//       },
//       include: {
//         team: true,
//       },
//     });

//     // Remove password from response
//     const { password: _, ...userWithoutPassword } =
//       updatedUser;

//     return NextResponse.json(
//       {
//         user: userWithoutPassword,
//         message: `User role updated to ${newRole} successfully`,
//       },
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     console.error("Role assignment error:", error);

//     return NextResponse.json(
//       {
//         error: "Internal server error, Something went wrong!",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }








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
    const { userId } = await context.params;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          error: "You are not authenticated",
        },
        { status: 401 }
      );
    }

    // -----------------------------------------
    // ADMIN OR MANAGER
    // -----------------------------------------

    if (
      currentUser.role !== Role.ADMIN &&
      currentUser.role !== Role.MANAGER
    ) {
      return NextResponse.json(
        {
          error:
            "You are not authorized to change user roles",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // CANNOT CHANGE OWN ROLE
    // -----------------------------------------

    if (currentUser.id === userId) {
      return NextResponse.json(
        {
          error:
            "You cannot change your own role",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // FIND TARGET USER
    // -----------------------------------------

    const targetUser =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!targetUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // GET NEW ROLE
    // -----------------------------------------

    const body = await request.json();

    const role = body.role;

    if (!Object.values(Role).includes(role)) {
      return NextResponse.json(
        {
          error: "Invalid role",
        },
        { status: 400 }
      );
    }

    const newRole = role as Role;

    // -----------------------------------------
    // ROLE HIERARCHY
    // -----------------------------------------

    const hierarchy: Record<Role, number> = {
      [Role.GUEST]: 0,
      [Role.USER]: 1,
      [Role.MANAGER]: 2,
      [Role.ADMIN]: 3,
    };

    // -----------------------------------------
    // CURRENT USER MUST HAVE HIGHER ROLE
    // -----------------------------------------

    if (
      hierarchy[currentUser.role] <=
      hierarchy[newRole]
    ) {
      return NextResponse.json(
        {
          error:
            "You can only assign a role lower than your own role",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // TARGET USER MUST BE LOWER
    // -----------------------------------------

    if (
      hierarchy[targetUser.role] >=
      hierarchy[currentUser.role]
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot change the role of a user with equal or higher role",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // UPDATE ROLE
    // -----------------------------------------

    const updatedUser =
      await prisma.user.update({
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

    const {
      password: _password,
      ...userWithoutPassword
    } = updatedUser;

    return NextResponse.json(
      {
        user: userWithoutPassword,

        message: `User role updated to ${newRole} successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Role assignment error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error, something went wrong!",
      },
      { status: 500 }
    );
  }
}