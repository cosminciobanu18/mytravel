import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/lib/actions/actions";
import EditUesrDataComponent from "@/components/profile/editUserData";
export default async function ProfilePage() {
  const session = await getServerSession();
  console.log(session);
  let userData = {};
  if (session?.user?.email) userData = await getUserByEmail(session.user.email);
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-medium mt-16 mb-10 text-green-800">
        Edit your profile
      </h1>
      <EditUesrDataComponent userData={userData} />
    </div>
  );
}
