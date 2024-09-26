import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@lib/DB";
import { Payload } from "@lib/DB";

export const GET = async (request: NextRequest) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");

  const foundRoom = DB.messages.filter((message:Message)=> message.roomId === roomId);
  if(foundRoom.length < 1){
    return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
    );
  }

  return NextResponse.json(
  {
    ok: true,
    message: foundRoom,
  },
  );

};

export const POST = async (request: NextRequest) => {
  readDB();

  const body = await request.json();
  const { roomId,messageText } = body;
  const foundRoom = DB.rooms.find((message:Message)=> message.roomId === roomId);
  if(!foundRoom ){
    return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
    );
  }
  const messageId = nanoid();
  DB.messages.push({
    roomId,
    messageId,
    messageText,
  })
  writeDB();

  return NextResponse.json({
    ok: true,
    // messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  let role = null;
  if (payload){
    role = (<Payload>payload).role;
  }
  if (!payload || role != "SUPER_ADMIN"){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();
  const body = await request.json();
  const { messageId } = body;
  const foundMsg = DB.messages.find((msg:Message)=>msg.messageId === messageId);
  if (!foundMsg){
      return NextResponse.json(
        {
          ok: false,
          message: "Message is not found",
        },
        { status: 404 }
      );
  }
  const index:number = DB.message.findIndex((msg:Message)=> msg.messageId === messageId)
  console.log(index);
  delete DB.messages[index];
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
