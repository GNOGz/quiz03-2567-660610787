import jwt from "jsonwebtoken";
import { DB, readDB, User } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";
import { DB_Type } from "@lib/DB";
export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { username, password } = body;

  //you should do the validation here
  const user = (<DB_Type>DB).users.find(
    (user: User) => user.username === username && user.password === password
  );

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Username or Password is incorrect",
      },
      { status: 400 }
    );
  }

  const secret = process.env.JWT_SECRET || "This is my special secret";

  const token = jwt.sign({ username, role: user.role }, secret, {
    expiresIn: "8h",
  });

  return NextResponse.json({ ok: true, token });
};
