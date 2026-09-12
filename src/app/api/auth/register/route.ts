import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/db";
import { hashPassword } from "@/app/lib/auth";
import { Role } from "@prisma/client";
import { generateToken } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, teamCode } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Name, email & password are required or not valid",
        },
        {
          status: 400,
        }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this email address exists",
        },
        {
          status: 409,
        }
      );
    }

    // Find team if team code is provided
    let teamId: string | undefined;

    if (teamCode) {
      const team = await prisma.team.findUnique({
        where: {
          code: teamCode,
        },
      });

      if (!team) {
        return NextResponse.json(
          {
            error: "Please enter a valid team code",
          },
          {
            status: 400,
          }
        );
      }

      teamId = team.id;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
 const userCount=await prisma.user.count();
 const role=userCount=== 0? Role.ADMIN: Role.USER;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        teamId,
      },
      include:{
        team:true,
      }
    });
    const token =generateToken(user.id);
    const response=NextResponse.json({

       user:{
        id:user.id,
        email:user.email,
        name:user.name,
        role:user.role,
        teamId:user.teamId,
        team:user.team,
        token,
       },
    });
    response.cookies.set("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"lax",
        maxAge:60*60*24*7,
    });
    return response;


   
  }
  catch(erorr){
    console.error("Registration Failed");

  
  return NextResponse.json({
    error:"internal server error",
  },
  {status:500}
);
  }
}