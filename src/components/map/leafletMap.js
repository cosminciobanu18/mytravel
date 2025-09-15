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
import { useEffect } from "react";
import { Button } from "@heroui/react";
import { markerColorsArray } from "@/lib/helpers";
import { CircleSmall } from "lucide-react";
import { color } from "framer-motion";
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
    }))
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
export default function LeafletMap({ markers, tempMarker, viewCenter }) {
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

      {(tempMarker ? [...markers, tempMarker] : markers).map((marker) => (
        <Marker
          key={marker.id}
          position={marker.latlon}
          icon={icons[marker.tags[0].color ?? "grey"]}
        >
          <Popup className="max-w-40 space-y-1 relative">
            <h5 className="text-lg font-bold ">{marker.name}</h5>
            <span className="text-md">
              {marker.city}, {marker.country}
            </span>
            {/* <h6>{marker.type}</h6> */}
            {/* <p className="text-sm">{marker.address}</p> */}
            {/* {marker.tags.length === 0 && (
              <Button className="bg-gray-400 mt-3 mx-auto" size="sm">
                Want to visit
              </Button>
            )} */}
            <hr className="my-1" />
            <span className="font-semibold pt-2">Tags:</span>
            <br />
            <div className="flex flex-wrap gap-x-1 gap-y-1 mt-1">
              {marker.tags?.slice(0, 3).map((tag, idx) => {
                const [{ colorInside, colorOutside }] =
                  markerColorsArray.filter((c) => c.name === tag.color);
                console.log(colorInside, colorOutside);
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
                      // style={{ stroke: colorOutside, fill: colorInside }}
                      color={colorOutside}
                      fill={colorInside}
                    />
                  </div>
                );
              })}
              {marker.tags?.length > 3 && (
                <div className="inline-block border-gray-800 rounded-md p-1 py-0.5 border-small">
                  +{marker.tags.length - 3}
                </div>
              )}
            </div>
            <Button
              size="sm"
              className="mt-2 border-green-900"
              variant="bordered"
            >
              {marker.tags.length === 0 ? "Add tag" : "Edit tags"}
            </Button>
          </Popup>
        </Marker>
      ))}
      <ZoomControl position="topright" />
      <CenterMap coords={viewCenter} />
    </MapContainer>
  );
}
