"use server";

import { getServerSession } from "next-auth";
import DBConnect from "@/lib/db";
import { NextResponse } from "next/server";
import Location from "@/lib/models/location";
import User from "@/lib/models/user";
import Tag from "@/lib/models/tag";
import Markup from "@/lib/models/markup";

export async function createMarkup(markup) {
  const session = await getServerSession();
  const id = session?.user?.id;
  if (!session) return NextResponse({}, { status: 403 });
  try {
    await DBConnect();
  } catch (error) {}
}

// export async function fetchMarkers() {
//   return [];
// }

export async function fetchMarkers() {
  return [
    {
      location: {
        place_id: 55112477,
        name: "Palace of Culture",
        latlon: [47.1573073, 27.5862609],
        address:
          "Palace of Culture, 1, acces parcare, Palas, Centru, Iași, Iași Metropolitan Area, Iași, 700259, Romania",
        type: "musem",
        city: "Iași",
        country: "Romania",
      },

      tags: [
        { color: "black", name: "test" },
        { color: "gold", name: "visited" },
        { color: "red", name: "important" },
        { color: "green", name: "Iasi" },
      ],
    },
  ];
}
