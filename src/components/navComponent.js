"use client";
import {
  Button,
  Navbar,
  NavbarBrand,
  Avatar,
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
export default function NavComponent() {
  console.log(Dropdown, DropdownItem);
  const { data: session } = useSession();
  console.log(session);
  return (
    <Navbar className="text-bold bg-green-100" isBordered shouldHideOnScroll>
      <NavbarBrand className="text-3xl" as={Link} href="/">
        MyTravel
      </NavbarBrand>
      <NavbarContent className="text-2xl gap-12" justify="center">
        <NavbarItem
          as={Link}
          href="/"
          color="default"
          variant="shadow"
          className="text-green-900 text-2xl"
        >
          Search People
        </NavbarItem>
        <NavbarItem
          as={Link}
          href="/friends"
          color="default"
          variant="shadow"
          className=" text-green-900 text-2xl"
        >
          Friends
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {!session ? (
          <Button onPress={signIn} className="bg-green-800">
            Sign Up
          </Button>
        ) : (
          <Dropdown>
            <DropdownTrigger>
              <Avatar as="button">A</Avatar>
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
