import MapComponent from "@/components/map/mapComponent";
import { fetchMarkers } from "@/lib/actions/actions";
export default async function Home() {
  const pins = await fetchMarkers();
  return (
    // add top padding so child margins don't collapse out of the green background
    <div className="relative py-32">
      <MapComponent pins={pins} />
    </div>
  );
}
