import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("No MONGODB_URI available in env");

const cached = {
  connection: null,
  promise: null,
};

export default async function DBConnect() {
  if (cached.connection) return cached.connection;
  if (!cached.promise) cached.promise = mongoose.connect(MONGODB_URI);
  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.connection;
}
