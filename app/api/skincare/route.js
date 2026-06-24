import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS, PUT",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
};

function withCors(response) {
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}

function json(data, init = {}) {
  return withCors(NextResponse.json(data, init));
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  return Buffer.from(padded, "base64").toString("utf8");
}

function getUserIdFromToken(request) {
  const authorization = request.headers.get("authorization");

  if (!authorization || authorization === "anonymous") {
    return "anonymous";
  }

  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : authorization;

  try {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(decodeBase64Url(payload));

    return decodedPayload.email || token;
  } catch {
    return authorization;
  }
}

async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS skincare (
      id SERIAL PRIMARY KEY,
      nama TEXT,
      brand TEXT,
      image_id TEXT,
      owner TEXT
    );
  `;
}

function isUploadableFile(value) {
  return (
    value && typeof value === "object" && typeof value.arrayBuffer === "function"
  );
}

function getSafeFileName(file) {
  const rawName = typeof file.name === "string" && file.name ? file.name : "image";
  return rawName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function uploadImage(file) {
  if (!isUploadableFile(file) || file.size === 0) {
    return "sample_cleanser";
  }

  const pathname = `skincare/${crypto.randomUUID()}-${getSafeFileName(file)}`;
  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type || "application/octet-stream",
  });

  return blob.url;
}

export async function OPTIONS() {
  return withCors(new Response(null, { status: 200 }));
}

export async function GET(request) {
  try {
    await initializeDatabase();

    const userId = getUserIdFromToken(request);
    const { rows } = await sql`
      SELECT *
      FROM skincare
      WHERE owner = 'system' OR owner = ${userId}
      ORDER BY id DESC;
    `;

    const items = rows.map((row) => ({
      id: row.id,
      nama: row.nama,
      brand: row.brand,
      imageId: row.image_id,
      owner: row.owner,
      mine: row.owner === userId ? 1 : 0,
    }));

    return json(items);
  } catch (error) {
    console.error("Failed to load skincare records:", error);
    return json(
      { status: "error", message: "Failed to load skincare records." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await initializeDatabase();

    const userId = getUserIdFromToken(request);
    const formData = await request.formData();
    const nama = String(formData.get("nama") || "").trim();
    const brand = String(formData.get("brand") || "").trim();
    const image = formData.get("image");

    if (!nama || !brand) {
      return json(
        { status: "error", message: "Both nama and brand are required." },
        { status: 400 },
      );
    }

    const imageId = await uploadImage(image);

    await sql`
      INSERT INTO skincare (nama, brand, image_id, owner)
      VALUES (${nama}, ${brand}, ${imageId}, ${userId});
    `;

    return json({ status: "success", message: "Saved successfully!" });
  } catch (error) {
    console.error("Failed to save skincare record:", error);
    return json(
      { status: "error", message: "Failed to save skincare record." },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    await initializeDatabase();

    const userId = getUserIdFromToken(request);
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!Number.isInteger(id) || id < 1) {
      return json(
        { status: "error", message: "The id query parameter is required." },
        { status: 400 },
      );
    }

    await sql`
      DELETE FROM skincare
      WHERE id = ${id} AND owner = ${userId};
    `;

    return json({ status: "success", message: "Deleted successfully!" });
  } catch (error) {
    console.error("Failed to delete skincare record:", error);
    return json(
      { status: "error", message: "Failed to delete skincare record." },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await initializeDatabase();
    const userId = getUserIdFromToken(request);

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!Number.isInteger(id) || id < 1) {
      return json({ status: "error", message: "The id query parameter is required." }, { status: 400 });
    }

    const formData = await request.formData();
    const nama = String(formData.get("nama") || "").trim();
    const brand = String(formData.get("brand") || "").trim();
    const image = formData.get("image");

    if (!nama || !brand) {
      return json({ status: "error", message: "Both nama and brand are required." }, { status: 400 });
    }

    // Check if a new file upload was sent. If yes, replace it. If not, retain old image.
    if (isUploadableFile(image) && image.size > 0) {
      const imageId = await uploadImage(image);
      await sql`
        UPDATE skincare 
        SET nama = ${nama}, brand = ${brand}, image_id = ${imageId}
        WHERE id = ${id} AND owner = ${userId};
      `;
    } else {
      await sql`
        UPDATE skincare 
        SET nama = ${nama}, brand = ${brand}
        WHERE id = ${id} AND owner = ${userId};
      `;
    }

    return json({ status: "success", message: "Updated successfully!" });
  } catch (error) {
    console.error("Failed to update skincare record:", error);
    return json({ status: "error", message: "Failed to update skincare record." }, { status: 500 });
  }
}