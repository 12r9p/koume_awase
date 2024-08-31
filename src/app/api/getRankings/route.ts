// src/app/api/getRankings/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const NOTION_API_URL =
  "https://api.notion.com/v1/databases/"+process.env.NOTION_DATABASE_ID+"/query";
const NOTION_API_KEY = process.env.NOTION_API_KEY;

export async function POST() {
  try {
    const response = await axios.post(
      NOTION_API_URL,
      {
        sorts: [
          {
            property: "Score",
            direction: "descending",
          },
        ],
        page_size: 20, // 上位20件のみを取得
      },
      {
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
      }
    );

    const rankings = response.data.results.map((item: any) => ({
      id: item.id,
      name: item.properties.Name.title[0]?.text.content || "無名",
      score: item.properties.Score.number,
      kosen: item.properties.Kosen?.rich_text[0]?.text.content || "不明",
    }));

    return NextResponse.json(rankings);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return NextResponse.error();
  }
}
