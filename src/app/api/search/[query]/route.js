import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { query } = await params; // params is already an object
  console.log("search query:", query);
  // Use NextResponse.json to return a proper JSON response
  return Response.json({ query }, { status: 200 });
}
