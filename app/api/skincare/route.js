import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
};

const skincareDatabase = [
  {
    id: "1",
    nama: "Hydrating Cleanser",
    brand: "CeraVe",
    imageId: "sample_cleanser",
    owner: "system",
  },
  {
    id: "2",
    nama: "Niacinamide 10%",
    brand: "The Ordinary",
    imageId: "sample_serum",
    owner: "system",
  },
];

function withCors(response) {
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}

function json(data, init = {}) {
  return withCors(NextResponse.json(data, init));
}

function getUserId(request) {
  return request.headers.get("authorization") || "anonymous";
}

function createImageId() {
  return `img_${Math.random().toString(36).slice(2, 12)}`;
}

export function OPTIONS() {
  return withCors(new Response(null, { status: 200 }));
}

export function GET(request) {
  const userId = getUserId(request);

  const items = skincareDatabase
    .filter((item) => item.owner === "system" || item.owner === userId)
    .map(({ owner, ...item }) => ({
      ...item,
      mine: owner === userId ? 1 : 0,
    }));

  return json(items);
}

export async function POST(request) {
  const userId = getUserId(request);
  const formData = await request.formData();
  const nama = String(formData.get("nama") || "").trim();
  const brand = String(formData.get("brand") || "").trim();

  if (!nama || !brand) {
    return json(
      { status: "error", message: "Both nama and brand are required." },
      { status: 400 },
    );
  }

  skincareDatabase.push({
    id: crypto.randomUUID(),
    nama,
    brand,
    imageId: createImageId(),
    owner: userId,
  });

  return json({ status: "success", message: "Saved successfully!" });
}

export function DELETE(request) {
  const userId = getUserId(request);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return json(
      { status: "error", message: "The id query parameter is required." },
      { status: 400 },
    );
  }

  const index = skincareDatabase.findIndex(
    (item) => item.id === id && item.owner === userId,
  );

  if (index === -1) {
    return json(
      { status: "error", message: "Item not found or not owned by user." },
      { status: 404 },
    );
  }

  skincareDatabase.splice(index, 1);

  return json({ status: "success", message: "Deleted successfully!" });
}
