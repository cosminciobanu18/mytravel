"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { organizedVisited } from "@/lib/helpers";
import { deleteMarkupById } from "@/lib/actions/actions";
import { toast } from "react-toastify";

function flattenPlaces(data) {
  const out = [];
  data.forEach((country) => {
    country.cities.forEach((city) => {
      city.locations.forEach((loc) => {
        out.push({
          ...loc,
          city: city.city,
          country: country.country,
          countryCode: country.countryCode,
        });
      });
    });
  });
  return out;
}

export default function VisitedPlacesPage({ markups }) {
  const [data, setData] = useState(markups);
  const [expandedCountries, setExpandedCountries] = useState(() => new Set());
  const [expandedCities, setExpandedCities] = useState(() => new Set());
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(null);

  const places = organizedVisited(data);

  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data
      .map((country) => {
        const cities = country.cities
          .map((city) => {
            const locations = city.locations.filter((l) =>
              l.name.toLowerCase().includes(q),
            );
            if (city.city.toLowerCase().includes(q) || locations.length > 0)
              return { ...city, locations };
            return null;
          })
          .filter(Boolean);
        if (country.country.toLowerCase().includes(q) || cities.length > 0)
          return { ...country, cities };
        return null;
      })
      .filter(Boolean);
  }, [data, query]);

  const toggleCountry = (country) => {
    setExpandedCountries((prev) => {
      const n = new Set(prev);
      if (n.has(country)) n.delete(country);
      else n.add(country);
      return n;
    });
  };
  const toggleCity = (country, city) => {
    const key = `${country}||${city}`;
    setExpandedCities((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  };

  const handleDeleteMarkup = async (markupId) => {
    const markersBackup = data;
    try {
      setData((prev) => prev.filter((mark) => mark._id !== markupId));
      await deleteMarkupById(markupId);
    } catch (e) {
      setData(markersBackup);
      toast.error("Eroare stergere markup", { position: "top-center" });
      console.error(e);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 p-6 w-full">
      <div className="w-full mx-auto">
        <div className="w-full space-y-4">
          <div className="bg-white p-4 shadow rounded-lg w-full">
            <h3 className="font-semibold mb-2">All visited places</h3>
            <div className="space-y-3">
              {Object.keys(places).map((country) => (
                <div key={country} className="border rounded p-3 w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-medium">{country}</div>
                      <div className="text-xs text-gray-500">
                        {Object.keys(places[country]).length}
                        {Object.keys(places[country]).length > 1
                          ? " cities"
                          : " city"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCountry(country)}
                        className="px-2 py-1 text-md rounded bg-gray-100"
                      >
                        {expandedCountries.has(country) ? "Collapse" : "Expand"}
                      </button>
                    </div>
                  </div>

                  {expandedCountries.has(country) && (
                    <div className="mt-3 space-y-2">
                      {Object.keys(places[country]).map((cityName, idx) => {
                        const city = places[country][cityName];
                        const key = `${country}||${cityName}`;
                        return (
                          <div key={key} className="pl-3">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">
                                {cityName}{" "}
                                <span className="text-xs text-gray-500">
                                  ({city.length})
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleCity(country, cityName)}
                                  className="px-2 py-1 rounded bg-gray-100 text-sm"
                                >
                                  {expandedCities.has(key)
                                    ? "Hide places"
                                    : "Show places"}
                                </button>
                              </div>
                            </div>

                            {expandedCities.has(key) && (
                              <ul className="mt-2 space-y-1">
                                {city.map((loc, idx) => (
                                  <li
                                    key={loc?._id ?? idx}
                                    id={`place-${loc?._id || idx}`}
                                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                                  >
                                    <div>
                                      <div className="font-medium">
                                        {loc.location.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {/* {loc.lat.toFixed(4)},{" "}
                                        {loc.lng.toFixed(4)} */}
                                        {loc.location.type}
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          if (
                                            !confirm(
                                              "Delete this markup? This action is permanent!",
                                            )
                                          )
                                            return;
                                          handleDeleteMarkup(loc._id);
                                        }}
                                        className="px-2 py-1 text-sm rounded bg-red-100 text-red-700"
                                      >
                                        Delete X
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {filteredData.length === 0 && (
                <div className="text-gray-500">
                  No places match your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
