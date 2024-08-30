// src/app/api/saveScore/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const NOTION_API_URL = "https://api.notion.com/v1/pages";
const NOTION_API_KEY = process.env.NOTION_API_KEY; // Notion APIトークン
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID; // NotionデータベースID

export async function POST(req: Request) {
  try {
    const { name, score, school } = await req.json();

    // Validate input data
    if (!name || typeof score !== "number" || isNaN(score) || !school) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    await axios.post(
      NOTION_API_URL,
      {
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          Name: {
            title: [{ text: { content: name } }],
          },
          Score: {
            number: score,
          },
          Date: {
            date: { start: new Date().toISOString() },
          },
          Kosen: {
            // Ensure this property name matches your Notion database schema
            rich_text: [{ text: { content: school } }],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28", // 最新のNotion APIバージョンに合わせてください
        },
      }
    );

    return NextResponse.json({ message: "Score saved successfully" });
  } catch (error:any) {
    console.error("Error saving score:", error);
    return NextResponse.json(
      { message: "Error saving score", error: error.message },
      { status: 500 }
    );
  }
}
