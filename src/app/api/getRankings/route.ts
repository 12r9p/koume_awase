// src/app/api/getRankings/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const NOTION_API_URL =
  "https://api.notion.com/v1/databases/9c87882a04734e9e8266315698f20291/query";
const NOTION_API_KEY = process.env.NOTION_API_KEY; // Notion APIトークン

export async function POST() {
  try {
    const response = await axios.post(
      NOTION_API_URL,
      {},
      {
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28", // 最新のNotion APIバージョンに合わせてください
        },
      }
    );

    // Map and sort rankings by score in descending order
    const rankings = response.data.results
      .map((item: any) => ({
        id: item.id,
        name: item.properties.Name.title[0]?.text.content || "無名",
        score: item.properties.Score.number,
        kosen: item.properties.Kosen?.rich_text[0]?.text.content || "不明", // Kosenを追加
      }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0)); // スコアの降順でソート

    return NextResponse.json(rankings);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return NextResponse.error();
  }
}
