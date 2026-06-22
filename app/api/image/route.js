import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
};

function withCors(response) {
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}

export async function OPTIONS() {
  return withCors(new Response(null, { status: 200 }));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "myskin";
  const imageUrl = id.startsWith("http")
    ? id
    : `https://picsum.photos/500/500?seed=${encodeURIComponent(id)}`;

  return withCors(NextResponse.redirect(imageUrl, 302));
}
