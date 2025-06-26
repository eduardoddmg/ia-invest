import { NextResponse } from 'next/server';
import { callDeepSeek } from '@/lib/deepseek';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt ausente' }, { status: 400 });
  }

  try {
    const resposta = await callDeepSeek(prompt);
    return NextResponse.json({ resposta });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao consultar DeepSeek' },
      { status: 500 }
    );
  }
}
