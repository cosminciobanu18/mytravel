export const markerColorsArray = [
  { name: "blue", colorInside: "#2A81CB", colorOutside: "#3274A3" },
  { name: "gold", colorInside: "#FFD326", colorOutside: "#C1A32D" },
  { name: "red", colorInside: "#CB2B3E", colorOutside: "#982E40" },
  { name: "green", colorInside: "#2AAD27", colorOutside: "#31882A" },
  { name: "black", colorInside: "#3D3D3D", colorOutside: "#313131" },
  { name: "violet", colorInside: "#9C2BCB", colorOutside: "#742E98" },
  { name: "orange", colorInside: "#CB8427", colorOutside: "#98652E" },
  { name: "yellow", colorInside: "#CAC428", colorOutside: "#988F2E" },
  { name: "grey", colorInside: "#7B7B7B", colorOutside: "#6B6B6B" },
];

export function countryCodeToEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
}

export async function searchCities(query) {
  if (!query) return [];

  const res = await fetch(
    `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`,
    {
      headers: {
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      },
    }
  );

  const { data: cities } = await res.json();

  return cities.map((city) => ({
    id: city.id,
    name: city.name,
    region: city.region,
    latlon: [city.latitude, city.longitude],
    country: city.country,
    countryCode: city.countryCode,
  }));
}

export function organizedVisited(markups) {
  const org = {};
  for (const markup of markups) {
    org[markup.location.country] ??= {};
    org[markup.location.country][markup.location.city] ??= [];
    // if (!org[markup.location["country"]]) org[markup.location["country"]]
    const ref = org[markup.location["country"]][markup.location["city"]];
    if (!ref) org[markup.location["country"]][markup.location["city"]] = [];
    else ref.push(markup);
  }
  return org;
}
