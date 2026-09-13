
working prototype screenshots
https://docs.google.com/document/d/1wmmRAV3tV7-kVmIPZoq9Zw59PD7bKW07Ws5qXIiGaUk/edit?usp=sharing

# Team RBAC Management

A role-based team management dashboard built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Admin dashboard
- Manager dashboard
- User dashboard
- User role management
- Team assignment and removal
- Team overview
- Protected dashboard routes
- PostgreSQL database with Prisma ORM

## Roles

The application supports four roles:

- **ADMIN** - Manage users, roles, and team assignments
- **MANAGER** - Manage users with lower-level roles within their team
- **USER** - View personal and team information
- **GUEST** - Basic access with limited permissions

## Tech Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs

## Project Structure

```text
team-rbac-managment/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   └── app/
│       ├── api/
│       │   ├── auth/
│       │   │   ├── login/
│       │   │   ├── logout/
│       │   │   ├── me/
│       │   │   └── register/
│       │   │
│       │   └── user/
│       │       └── [userId]/
│       │           ├── role/
│       │           └── team/
│       │
│       ├── components/
│       │   ├── dashboard/
│       │   └── layout/
│       │
│       ├── lib/
│       │   ├── apiClient.ts
│       │   ├── auth.ts
│       │   └── db.ts
│       │
│       └── types/
│           └── index.ts
│
├── .env
├── package.json
└── README.md
