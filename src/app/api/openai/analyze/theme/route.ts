import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAI } from "openai";
import * as process from "node:process";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { themes, title, lyrics } = body;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const modelName = process.env.AZURE_OPENAI_MODEL_NAME;
  const apiVersion = "2024-04-01-preview";
  const options = { endpoint, apiKey, deployment, apiVersion };

  const client = new AzureOpenAI(options);

  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "찬양 제목과 가사를 분석해서 주어진 주제들을 정해진 것들 중에서 골라줘.",
        },
        {
          role: "user",
          content: `given_themes:'''${themes}''' title: '''${title}''' lyrics: '''${lyrics}`,
        },
      ],
      max_completion_tokens: 500,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: modelName ?? "gpt-4.1",
    });

    return NextResponse.json(response.choices[0].message.content);
  } catch (e) {
    console.error(e);
  }
}
