import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/db";
import { verifyPassword, generateToken } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        team: true,
      },
    });

    // Check user exists
    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userWithoutPassword,
      },
      {
        status: 200,
      }
    );

    // Set token cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}