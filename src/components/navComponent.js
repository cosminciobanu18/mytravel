import {
  Button,
  Navbar,
  NavbarBrand,
  Avatar,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Link from "next/link";
export default function NavComponent() {
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
        <Avatar>A</Avatar>
      </NavbarContent>
    </Navbar>
  );
}
