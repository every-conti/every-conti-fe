import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAI } from "openai";
import * as process from "node:process";
import SongThemeDto from "src/dto/common/song-theme.dto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { themes, title, lyrics } = body as {
    themes: SongThemeDto[];
    title: string;
    lyrics: string;
  };;
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
          content:
            "너는 세계 최고의 찬양 가사 분석가야. 찬양 가사를 분석해서 그 안에 담긴 주제들을 정해진 것들 중에서 골라야 해. 이 주제들은 사용자들이 찬양을 검색할 때 사용할 것이기 때문에 매우 중요해. 부연 설명 없이 주제들만 말해주면 돼.",
        },
        {
          role: "user",
          content: `given_themes:\n-----\n${themes}\n-----\n\ntitle: ${title}\n\nlyrics:\n-----\n${lyrics}\n-----\n\n위 찬양이 어느 주제에 속하는지 가장 연관성이 높은 것들로 위에서 1-5개를 선택해줘. 저기에 없는 걸 지어내면 안되고, 중요한 순대로 정렬해줘. 마땅한 주제가 더 없다면 꼭 5개가 아니여도 돼. 아래 다섯 개의 답변 포맷 중에 주제의 개수에 맞는 걸 골라서 뽑아줘.\n\nANSWER_FORMAT_1:\n-----\n{theme_1},\n-----\nANSWER_FORMAT_2:\n-----\n{theme_1}, {theme_2}\n-----\nANSWER_FORMAT_3:\n-----\n{theme_1}, {theme_2}, {theme_3},\n-----\nANSWER_FORMAT_4:\n-----\n{theme_1}, {theme_2}, {theme_3}, {theme_4}\n-----\nANSWER_FORMAT_5:\n-----\n{theme_1}, {theme_2}, {theme_3}, {theme_4}, {theme_5}\n"-----\nEXAMPLE_1:\n-----\ntitle: 처음과 나중\nlyrics: 오 영원하신 주 온 세상 주께 속했네\n모든 만물 사라져가도 주 말씀 영원해\n\n오 살아계신 주 지금도 역사 하시네\n죄와 슬픔 우릴 덮어도 주 약속 이루시리\n\n모든 영광 존귀 능력 주 받으소서\n온 백성 다 외치네 오 거룩하신 주\n\n처음과 나중 되신 주 만세의 왕 홀로 계신 주\n영원히 다스리시네 찬양 할렐루야\n\n주 다시 오실 때 우리 다 주 앞에 나가\n받은 면류관 주께 드리며 주 경배드리리\nANSWER: '''예수 그리스도, 재림, 경배, 영원'''\n-----\n\nEXAMPLE_2:\n-----\ntitle: 내 기쁨 되신 주\nlyrics: 1.주를 영원히 송축해\n항상 주의지하리\n두렴속에서 날 건지사\n반석위에 날 세우셨네\n\n요동하지않고\n주를 고백하리\n\n(후렴)\n나의 방패힘과\n내 기업 구원자\n피난처 강한 성루\n언제나 나의 도움 되시네\n\n2.내가 사모할자 오직 주\n주와 같은 분 없으리\n내 기쁨 되시는\n주를 고백하리\nANSWER: '''기쁨, 경배와 찬양, 구원, 인도와 보호'''`,
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
