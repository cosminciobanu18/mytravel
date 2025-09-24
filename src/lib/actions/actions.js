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

    await newMarkup.populate(["user", "location"]);
    const populatedMarkup = newMarkup.toObject();

    return { error: null, populatedMarkup };
  } catch (err) {
    return { error: err.message };
  }
}

export async function fetchMarkers() {
  await DBConnect();
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

export async function fetchAllTags() {
  //returneaza toate tag urile ca sa poata fi folosite in select-ul de cauta in tag uri
  await DBConnect();
  const session = await getServerSession();
  if (!session) return [];
  const user = await User.findOne({ email: session?.user?.email });
  const tags = await Tag.find({ owner: user?._id });
  console.log({ tags });
  return JSON.parse(JSON.stringify(tags)) ?? [];
}

export async function createTag(tag) {
  try {
    await DBConnect();
    const session = await getServerSession();
    if (!session) return { error: "No session" };
    const user = await User.findOne({ email: session?.user?.email });
    console.warn({ tag: tag.name, color: tag.color, _id: user._id });
    const newTag = new Tag({
      owner: user._id,
      name: tag.name,
      color: tag.color,
    });
    await newTag.save();
    return JSON.parse(JSON.stringify(newTag));
  } catch (e) {
    return { error: e.message };
  }
}

export async function addTagToMarkupId(tag, markupId) {
  try {
    await DBConnect();
    const session = await getServerSession();
    if (!session) return;
    const dbMarkup = await Markup.findByIdAndUpdate(
      markupId,
      { $push: { tags: tag._id } },
      { new: true }
    ).populate(["tags", "user", "location"]);
    console.log(dbMarkup);
    return JSON.parse(JSON.stringify(dbMarkup));
  } catch (e) {
    return { error: e.message };
  }
}

export async function deleteTagFromMarkupId(tagId, markupId) {
  try {
    await DBConnect();
    const session = await getServerSession();
    if (!session) return;
    const markup = await Markup.findById(markupId).populate("tags");
    markup.tags.splice(
      markup.tags.findIndex((t) => t._id.toString() === tagId),
      1
    );
    markup.save();
    return {};
  } catch (error) {
    throw { error };
  }
}
