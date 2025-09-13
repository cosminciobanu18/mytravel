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
import { useActionState, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { searchLocation } from "@/lib/actions/actions";

export default function MapComponent({ pins }) {
  // const [searchResults, setSearchResults] = useState(true);
  const [searchResults, action, isPending] = useActionState(
    searchLocation,
    null
  );
  const [markers, setMarkers] = useState(pins);
  const [tempMarker, setTempMarker] = useState(null);
  const [viewCenter, setViewCenter] = useState([47.15, 27.58]);

  const handleSelectSearchResult = (loc) => {
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

  return (
    <div className="max-w-7xl relative mx-auto">
      <div className="absolute top-6 left-6 w-60 z-[10000] bg-white p-3">
        <form className="relative" action={action}>
          <Input
            type="text"
            variant="bordered"
            fullWidth
            placeholder="Search a place..."
            className="rounded-xl"
            name="query"
          />
          {/* position the search icon inside the input */}
          <button className="absolute right-3 top-3 " type="submit">
            <Search size={18} className="text-gray-600" />
          </button>
          {(isPending || searchResults) && <Divider className="mt-4" />}
          {isPending && <div className="w-full p-4">Loading...</div>}
          {!isPending && searchResults && !searchResults?.errors && (
            <Listbox className="max-h-[600px] overflow-scroll">
              {searchResults.map((loc) => (
                <ListboxItem
                  className="mt-4"
                  key={loc.place_id}
                  onPress={() => handleSelectSearchResult(loc)}
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
