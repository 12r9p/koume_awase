// src/app/api/saveScore-high/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { minify } from "next/dist/build/swc";

const NOTION_API_URL = "https://api.notion.com/v1/pages";
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID_HIGH;

export async function POST(req: Request) {
  try {
    const { name, score, school } = await req.json();

    // 入力データの検証
    if (!name || typeof score !== "number" || isNaN(score) || !school) {
      return NextResponse.json(
        { message: "無効な入力データです" },
        { status: 400 }
      );
    }

    const response = await axios.post(
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
            rich_text: [{ text: { content: school } }],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
      }
    );

    console.log("Notion API response:", response.data);
    return NextResponse.json({ message: "スコアが正常に保存されました" });
  } catch (error: any) {
    console.error(
      "スコア保存中のエラー:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        message: "スコア保存中にエラーが発生しました",
        error: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
