"use client";
import { Button } from "@heroui/react";
import { signOut, useSession, signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { data: session } = useSession();
  if (session && session.user) {
    // console.log(session);
    // return (
    //   <div>
    //     <p>You are {session.user.name}</p>
    //     <button onClick={signOut} className="text-red-600">
    //       Sign out
    //     </button>
    //   </div>
    // );
    router.push("/");
  }
  return (
    <div className="bg-green-50 h-full w-full flex items-center justify-center">
      <Button
        onPress={() => signIn("google", { callbackUrl })}
        variant="faded"
        size="lg"
        className="text-green-900 font-medium hover:bg-gray-50 rounded-lg border shadow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google"
          width={20}
          height={20}
        />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
};

export default SignInPage;
