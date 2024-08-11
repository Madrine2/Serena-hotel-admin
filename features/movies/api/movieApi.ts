import { connectToDatabase } from "@/lib/db";
import { Movie } from "@/features/movies/models/movie";
import { ObjectId } from "mongodb";
import { checkCount } from "@/utils/checkcount";

export const addMovie = async (movie: Movie) => {
  const db = await connectToDatabase("movies");
  const collection = db.collection("movies");

  const { name, category, price, url, image, duration, part } = movie;

  let currentNumber;
  currentNumber = await checkCount(db, "movies");

  const newMovie = {
    count: currentNumber,
    name,
    category,
    price,
    url,
    image,
    duration,
    part,
    createdAt: new Date(),
  };

  return await collection.insertOne(newMovie);
};

export const getMovies = async () => {
  const db = await connectToDatabase("movies");
  const collection = db.collection<Movie>("movies");

  // Fetch items from the collection
  const items: Movie[] = await collection.find({}).toArray();

  return items;
};

export const editMovie = async (movie: Movie) => {
  const db = await connectToDatabase("movies");
  const collection = db.collection("movies");

  if (!movie._id) {
    throw new Error("Movie must have an _id field");
  }

  const { _id, ...updateData } = movie;

  return await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData },
  );
};
export const deleteMovie = async (id: string) => {
  const db = await connectToDatabase("movies");
  const collection = db.collection("movies");
  return await collection.deleteOne({ _id: new ObjectId(id) });
};
