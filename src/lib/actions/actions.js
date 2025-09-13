"use server";
const cache = new Map();

export async function searchLocation(prevState, formData) {
  if (!formData) return null;
  try {
    const query = formData.get("query");
    if (cache.has(query)) {
      const cached_query = cache.get(query);
      console.log(cached_query);
      return cached_query;
    }
    // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(
      `${"https://nominatim.openstreetmap.org/search?"}q=${encodeURIComponent(
        query
      )}&accept-language=en%2Cro&limit=7&addressdetails=1&format=json`
    );
    console.log(res);
    // const res = await fetch(`http://localhost:3004/proprietateProvizorie`);
    if (!res.ok) return { errors: res?.errors };
    const locationsFound = await res.json();
    cache.set(query, locationsFound);
    console.log(locationsFound);
    return locationsFound;
  } catch (error) {
    return { error: error.message };
  }
}

export async function fetchMarkers() {
  return [
    {
      id: 55112477,
      name: "Palace of Culture",
      latlon: [47.1573073, 27.5862609],
      address:
        "Palace of Culture, 1, acces parcare, Palas, Centru, Iași, Iași Metropolitan Area, Iași, 700259, Romania",
      type: "musem",
      address: {
        village: "Iași",
        country: "Romania",
      },
      tags: [],
    },
  ];
}
