"use client";
import { Button } from "@heroui/react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
const SignInPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) router.push("/");
  }, [session, router]);
  return (
    <div className="bg-green-50 h-full w-full flex items-center justify-center">
      <Button
        onPress={() => signIn("google", { callbackUrl: "/" })}
        variant="faded"
        size="lg"
        className="text-green-900 font-medium hover:bg-gray-50 rounded-lg border shadow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Image src="/google.png" alt="Google" width={20} height={20} />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
};

export default SignInPage;
