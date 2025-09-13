"use client";
import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("@/components/map/leafletMap"), {
  ssr: false,
});

import {
  Button,
  Divider,
  Input,
  Listbox,
  ListboxItem,
  Select,
  SelectItem,
} from "@heroui/react";
import { useActionState, useEffect, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { searchLocation } from "@/lib/actions/actions";

export default function MapComponent({ pins }) {
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [markers, setMarkers] = useState(pins);
  const [tempMarker, setTempMarker] = useState(null);
  const [viewCenter, setViewCenter] = useState([47.15, 27.58]);
  const [isPending, startTransition] = useTransition();

  const fetchSearchInput = async (query) => {
    const response = await fetch(`/api/search/${query}`);
    if (!response.ok) {
      setError(response.error);
      setSearchResults(null);
      return;
    }
    const result = await response.json();
    setError(null);
    setSearchResults(result);
  };

  const handleClickSearchResult = (loc) => {
    if (loc == null) {
      setTempMarker(null);
      return;
    }
    setTempMarker({
      id: loc.place_id,
      name: loc.name,
      address: loc.display_name,
      type: loc.type,
      latlon: [loc.lat, loc.lon],
      country: loc.address.country,
      city: loc.address?.city || loc.address?.town || loc.address?.village,
      tags: [],
    });
    setViewCenter([loc.lat, loc.lon]);
  };

  const handleSubmit = async (e) => {
    // prevent default synchronously to avoid race conditions when other buttons are clicked
    e.preventDefault();
    startTransition(async () => {
      const formdata = new FormData(e.currentTarget);
      const query = formdata.get("query");
      if (!query) {
        setTempMarker(null);
        setSearchResults(null);
      } else {
        await fetchSearchInput(query);
      }
    });
  };

  const handleClearSearch = (e) => {
    e.preventDefault();
    setTempMarker(null);
    setSearchResults(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl relative mx-auto">
      <div className="absolute top-6 left-6 w-60 z-[10000] bg-white p-3">
        <form className="relative" onSubmit={handleSubmit}>
          <Input
            type="text"
            variant="bordered"
            fullWidth
            placeholder="Search a place..."
            className="rounded-xl"
            name="query"
          />
          {/* position the search icon inside the input */}
          {!searchResults ? (
            <button className="absolute right-3 top-3" type="submit">
              <Search size={18} className="text-gray-600" />
            </button>
          ) : (
            <button
              className="absolute right-3 top-3"
              onClick={handleClearSearch}
              type="reset"
            >
              <X size={18} className="text-gray-600" />
            </button>
          )}
          {(isPending || searchResults || error) && (
            <Divider className="mt-4" />
          )}
          {isPending && <div className="w-full p-4">Loading...</div>}
          {error ?? null}
          {!isPending && searchResults && !error && (
            <Listbox className="max-h-[600px] overflow-scroll">
              {searchResults.map((loc) => (
                <ListboxItem
                  className="mt-4"
                  key={loc.place_id}
                  onPress={() => handleClickSearchResult(loc)}
                >
                  <h4 className="text-lg font-bold">{loc.name}</h4>
                  <h6 className="text-md font-semibold">
                    {loc.address?.city ||
                      loc.address?.town ||
                      loc.address?.village}
                    {", "}
                    {loc.address.country}
                  </h6>
                  <p className="text-sm font-medium">{loc.type}</p>
                </ListboxItem>
              ))}
            </Listbox>
          )}
        </form>
      </div>
      <div className="w-full flex justify-center">
        <LeafletMap
          markers={markers}
          setMarkers={setMarkers}
          tempMarker={tempMarker}
          setTempMarker={setTempMarker}
          viewCenter={viewCenter}
        />
      </div>
    </div>
  );
}
