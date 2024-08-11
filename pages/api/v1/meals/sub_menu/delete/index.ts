import { ParsedUrlQuery } from "node:querystring";
import { NextApiRequest, NextApiResponse } from "next";
import { closeClient } from "@/lib/db";
import { deleteSubMenu } from "@/features/meals/api/subApi";

interface QueryParams extends ParsedUrlQuery {
  id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.query as QueryParams;

      if (!id) {
        return res.status(400).json({ error: "SubMenu ID is required" });
      }

      const result = await deleteSubMenu(id);

      if (result.deletedCount === 0) {
        res.status(404).json({ error: "SubMenu not found" });
      } else {
        res.status(200).json({ message: "SubMenu deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete SubMenu", err: error });
    } finally {
      await closeClient();
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
