import MapComponent from "@/components/map/mapComponent";
import { fetchAllTags, fetchMarkers } from "@/lib/actions/actions";
export default async function Home() {
  const pins = await fetchMarkers();
  const tags = await fetchAllTags();
  console.log({ pins });
  return (
    // add top padding so child margins don't collapse out of the green background
    <div className="relative py-20 min-h-full">
      <MapComponent pins={pins} tags={tags} />
    </div>
  );
}
