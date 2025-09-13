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
function CenterMap({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.panTo(coords); // or map.panTo(coords)
    }
  }, [coords, map]);

  return null;
}
export default function LeafletMap({
  markers,
  setMarkers,
  tempMarker,
  setTempMarker,
  viewCenter,
}) {
  const latlng = [47.151726, 27.587914];
  return (
    <MapContainer
      center={latlng} //ar fi misto sa l iau din geolocation api
      zoom={13}
      scrollWheelZoom
      style={{ height: "700px", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={latlng} icon={icon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}
      {(tempMarker ? [...markers, tempMarker] : markers).map((marker) => (
        <Marker key={marker.id} position={marker.latlon} icon={icon}>
          <Popup className="max-w-40 space-y-1">
            <h5 className="text-lg font-bold ">{marker.name}</h5>
            <span className="text-md">
              {marker.city}, {marker.country}
            </span>
            {/* <h6>{marker.type}</h6> */}
            {/* <p className="text-sm">{marker.address}</p> */}
          </Popup>
        </Marker>
      ))}
      <ZoomControl position="topright" />
      <CenterMap coords={viewCenter} />
    </MapContainer>
  );
}
