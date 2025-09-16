"use client";
import { signOut, useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
const SignInPage = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { data: session } = useSession();
  if (session && session.user) {
    console.log(session);
    return (
      <div>
        <p>You are {session.user.name}</p>
        <button onClick={signOut} className="text-red-600">
          Sign out
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => signIn("google", { callbackUrl })}
      className="text-green-600"
    >
      Sign in with Google
    </button>
  );
};

export default SignInPage;
