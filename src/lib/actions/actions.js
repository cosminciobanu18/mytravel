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
  if (!session) return { error: "User has no session" };
  try {
    await DBConnect();
    let location = await Location.findOne({
      place_id: markup.location.place_id,
    });
    if (!location) {
      location = new Location({ ...markup.location });
      await location.save();
    }
    const dbUser = await User.findOne({ email: session.user.email });

    const newMarkup = new Markup({
      location: location._id,
      user: dbUser._id,
      tags: [],
    });
    await newMarkup.save();

    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

export async function fetchMarkers() {
  const session = await getServerSession();
  if (!session) return [];
  const user = await User.findOne({ email: session?.user?.email });
  const markups = await Markup.find({ user: user?._id })
    .populate("tags")
    .populate("user")
    .populate("location");
  console.log({ markups });
  return markups ? JSON.parse(JSON.stringify(markups)) : [];
}

// export async function fetchMarkers() {
//   return [
//     {
//       location: {
//         place_id: 55112477,
//         name: "Palace of Culture",
//         latlon: [47.1573073, 27.5862609],
//         address:
//           "Palace of Culture, 1, acces parcare, Palas, Centru, Iași, Iași Metropolitan Area, Iași, 700259, Romania",
//         type: "musem",
//         city: "Iași",
//         country: "Romania",
//       },

//       tags: [
//         { color: "black", name: "test" },
//         { color: "gold", name: "visited" },
//         { color: "red", name: "important" },
//         { color: "green", name: "Iasi" },
//       ],
//     },
//   ];
// }
