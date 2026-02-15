"use client";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Divider,
} from "@heroui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function NavComponent() {
  const { data: session } = useSession();
  const [avatarUrl, setAvatarUrl] = useState(null);
  useEffect(() => {
    setAvatarUrl(session?.user?.image);
  }, [session?.user?.image]);
  return (
    <Navbar
      className="text-bold bg-green-100 p-1"
      isBordered
      shouldHideOnScroll
    >
      <NavbarContent justify="start"></NavbarContent>
      <NavbarContent justify="center">
        <NavbarBrand
          className="text-4xl font-semibold tracking-tight"
          as={Link}
          href="/"
        >
          MyTravel
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        {!session ? (
          <Button onPress={signIn} className="bg-green-800">
            Sign Up
          </Button>
        ) : (
          <Dropdown>
            <DropdownTrigger>
              <button className="rounded-full overflow-hidden w-10 h-10">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={session?.user?.name || "Avatar"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <span className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full text-sm font-bold">
                    {session?.user?.name?.[0]}
                  </span>
                )}
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions">
              {session && (
                <>
                  <DropdownItem key="name">
                    <span className="text-lg font-semibold">
                      {session?.user?.name}
                    </span>

                    <Divider className="mt-3" />
                  </DropdownItem>
                </>
              )}
              <DropdownItem key="profile" as={Link} href={`/profile`}>
                <span className="text-lg">Profile</span>
              </DropdownItem>
              {session ? (
                <DropdownItem key="signOut" onPress={signOut}>
                  <span className="text-lg">Sign Out</span>
                </DropdownItem>
              ) : (
                <DropdownItem key="signIn" as={Link} href="/signin">
                  Sign In
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  );
}
