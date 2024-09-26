import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Yutthakarn Sajui",
    studentId: "660610787",
  });
};
