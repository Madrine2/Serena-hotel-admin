import { MovieCategory } from "@/features/movies/models/movieCategory";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export const addCategoryMovie = async (movieCategory: MovieCategory) => {
  const db = await connectToDatabase("movies");
  const collection = db.collection("movie_categories");

  const { name } = movieCategory;
  const newMovieCategory = {
    name,
    createdAt: new Date(),
  };

  return await collection.insertOne(newMovieCategory);
};

export const getCategoryMovies = async () => {
  const db = await connectToDatabase("movies");
  const collection = db.collection<MovieCategory>("movie_categories");

  // Fetch items from the collection
  const items: MovieCategory[] = await collection.find({}).toArray();

  return items;
};

export const editCategoryMovie = async (category: MovieCategory) => {
  const db = await connectToDatabase("movies");
  const collection = db.collection("movie_categories");

  if (!category._id) {
    throw new Error("Movie Category must have an _id field");
  }

  const { _id, ...updateData } = category;

  return await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData },
  );
};
export const deleteCategoryMovie = async (id: string) => {
  const db = await connectToDatabase("movies");
  const collection = db.collection("movie_categories");
  return await collection.deleteOne({ _id: new ObjectId(id) });
};
