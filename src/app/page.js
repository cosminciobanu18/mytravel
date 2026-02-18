import MapComponent from "@/components/map/mapComponent";
import { fetchAllTags, fetchMarkers } from "@/lib/actions/actions";
export default async function Home() {
  const pins = await fetchMarkers();
  const tags = await fetchAllTags();
  return (
    <div className="relative pt-8 pb-20 min-h-full">
      <MapComponent pins={pins} tags={tags} />
    </div>
  );
}
