import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/lib/actions/actions";
import EditUesrDataComponent from "@/components/profile/editUserData";
import VisitedPlacesPage from "@/components/profile/visitedLocations";
import { redirect } from "next/navigation";
import { fetchMarkers } from "@/lib/actions/actions";
import { organizedVisited } from "@/lib/helpers";

export const dynamic = "force-dynamic";
export default async function ProfilePage() {
  const session = await getServerSession();
  console.log(session);
  if (!session) redirect("/signin");
  const pins = await fetchMarkers();
  const noCountries = Object.entries(organizedVisited(pins)).length;
  let userData = {};
  if (session?.user?.email) userData = await getUserByEmail(session.user.email);
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-medium mt-16 mb-10 text-green-800">
        Edit your profile
      </h1>
      <EditUesrDataComponent userData={userData} noCountries={noCountries} />
      <VisitedPlacesPage markups={pins} />
    </div>
  );
}
