import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";
import {
  QueryDatabaseResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  RichTextItemResponse
} from "@notionhq/client/build/src/api-endpoints";


const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID!;

type TitleProperty = {
  type: "title";
  title: RichTextItemResponse[];
  id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, score } = req.body;
    if (!name || typeof score !== "number") {
      return res.status(400).json({ error: "Invalid input" });
    }
    try {
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Name: { title: [{ text: { content: name } }] },
          Score: { number: score },
        },
      });
      res.status(200).json({ message: "Score submitted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit score" });
    }
  } else if (req.method === "GET") {
    try {
      const response: QueryDatabaseResponse = await notion.databases.query({
        database_id: databaseId,
        sorts: [{ property: "Score", direction: "descending" }],
        page_size: 100,
      });
      // 型ガードを使って`nameProperty`が`title`型であることを確認
      const rankings = response.results.map((page, index) => {
        if ("properties" in page) {
          const nameProperty = page.properties.Name;
          const scoreProperty = page.properties.Score;

          // `nameProperty`が`title`型であることを確認
          const name =
            nameProperty.type === "title" &&
            Array.isArray(nameProperty.title) &&
            nameProperty.title.length > 0
              ? nameProperty.title[0].plain_text
              : "Unknown";

          // `scoreProperty`が`number`型であることを確認
          const score =
            scoreProperty.type === "number" && scoreProperty.number !== null
              ? scoreProperty.number
              : 0;

          return {
            rank: index + 1,
            name,
            score,
          };
        } else {
          return {
            rank: index + 1,
            name: "Unknown",
            score: 0,
          };
        }
      });
      res.status(200).json(rankings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rankings" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
