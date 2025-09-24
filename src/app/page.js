import MapComponent from "@/components/map/mapComponent";
import { fetchAllTags, fetchMarkers } from "@/lib/actions/actions";
export default async function Home() {
  const pins = await fetchMarkers();
  const tags = await fetchAllTags();
  console.log({ pins });
  return (
    // add top padding so child margins don't collapse out of the green background
    <div className="relative py-32">
      <MapComponent pins={pins} tags={tags} />
    </div>
  );
}
