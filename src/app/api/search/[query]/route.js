import { NextResponse } from "next/server";
import { searchLocation } from "@/lib/actions/actions";

const cache = new Map();

export async function GET(request, { params }) {
  const { query } = await params;
  console.log("search query:", query);

  try {
    if (cache.has(query)) {
      const cached_query = cache.get(query);
      console.log("The query was cached:", cached_query);
      return Response.json(cached_query, { status: 200 });
    }
    const res = await fetch(
      `${"https://nominatim.openstreetmap.org/search?"}q=${encodeURIComponent(
        query
      )}&accept-language=en%2Cro&limit=7&addressdetails=1&format=json`
    );
    console.log(res);
    if (!res.ok) return { errors: res?.errors };
    const locationsFound = await res.json();
    cache.set(query, locationsFound);
    console.log(locationsFound);
    return Response.json(locationsFound, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: error.status });
  }
}
