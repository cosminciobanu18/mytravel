"use client";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useTransition, useState } from "react";
import { Button } from "@heroui/react";
import { markerColorsArray } from "@/lib/helpers";
import { BookmarkPlus, CircleSmall, Edit } from "lucide-react";
import { color } from "framer-motion";
import { createMarkup } from "@/lib/actions/actions";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const icon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const icons = {};
[...markerColorsArray].forEach(
  ({ name: color }) =>
    (icons[color] = new L.Icon({
      iconUrl: `/colored-markers/marker-icon-${color}.png`,
      shadowUrl: "/leaflet/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })),
);

function CenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.panTo(coords);
    }
  }, [coords, map]);
  return null;
}
export default function LeafletMap({
  filtered,
  selectedTags,
  setMarkers,
  tempMarker,
  setTempMarker,
  viewCenter,
  setIsModalOpen,
  setModalLocation,
  setModalTags,
  setModalMarkupId,
}) {
  const [successfulSave, setSuccessfulSave] = useState(null);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const latlng = [47.151726, 27.587914];
  return (
    <MapContainer
      center={latlng} //ar fi misto sa l iau din geolocation api
      zoom={13.5}
      scrollWheelZoom
      style={{ height: "700px", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {(tempMarker ? [...filtered, tempMarker] : filtered).map(
        ({ _id, location, tags }) => (
          <Marker
            key={location.place_id}
            position={location.latlon}
            icon={
              icons[
                tags.length === 0
                  ? "grey"
                  : selectedTags.length === 0
                    ? tags[0].color
                    : tags.find((t) =>
                        selectedTags.some((s) => s._id === t._id),
                      )?.color
              ]
            }
          >
            <Popup className="max-w-40 space-y-1 relative">
              <h5 className="text-lg font-bold ">{location.name}</h5>
              <span className="text-lg">
                {location.city}, {location.country}
              </span>
              <hr className="my-2" />
              <span className="font-semibold pt-2">Tags:</span>
              <br />
              <div className="flex flex-wrap gap-x-1 gap-y-1 mt-1">
                {tags.length === 0 && <span>no tags</span>}
                {tags?.slice(0, 3).map((tag, idx) => {
                  const [{ colorInside, colorOutside }] =
                    markerColorsArray.filter((c) => c.name === tag?.color);
                  return (
                    <div
                      className="inline-block border-gray-800 rounded-md border-small p-1 py-0.5"
                      key={idx}
                      style={{ borderColor: colorOutside }}
                    >
                      <span>{tag.name}</span>
                      <CircleSmall
                        size={12}
                        className="inline-block my-auto"
                        color={colorOutside}
                        fill={colorInside}
                      />
                    </div>
                  );
                })}
                {tags?.length > 3 && (
                  <div className="inline-block border-gray-800 rounded-md p-1 py-0.5 border-small">
                    +{tags.length - 3}
                  </div>
                )}
              </div>
              {location.place_id === tempMarker?.location?.place_id ? (
                <Button
                  size="sm"
                  className="mt-4 w-full border-green-900 text-green-900 bg-green-100 border-1 mx-auto font-bold"
                  variant="solid"
                  onPress={async () => {
                    if (!session) {
                      toast.error("You have to be logged in to save markups!", {
                        position: "top-center",
                      });
                      return;
                    }
                    startTransition(async () => {
                      const res = await createMarkup(tempMarker);
                      if (!res.error) {
                        setMarkers((prev) => [...prev, res.populatedMarkup]);
                        setTempMarker(null);
                        setSuccessfulSave("successfully saved");
                        setTimeout(() => setSuccessfulSave(null), 3000);
                      } else {
                        setSuccessfulSave(res.error);
                        setTimeout(() => setSuccessfulSave(null), 5000);
                      }
                    });
                  }}
                >
                  <>
                    Save <BookmarkPlus size={18} />
                  </>
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="mt-4 w-full border-green-900 text-green-900 bg-green-100 border-1 mx-auto font-bold"
                  variant="solid"
                  onPress={() => {
                    setIsModalOpen(true);
                    setModalLocation(location);
                    setModalTags(tags);
                    setModalMarkupId(_id);
                  }}
                >
                  <>
                    Customize
                    <Edit size={18} />
                  </>
                </Button>
              )}
              {isPending && <span className="">saving...</span>}
              {successfulSave !== null && (
                <span className="text-green-600">{successfulSave}</span>
              )}
            </Popup>
          </Marker>
        ),
      )}
      <ZoomControl position="topright" />
      <CenterMap coords={viewCenter} />
    </MapContainer>
  );
}
