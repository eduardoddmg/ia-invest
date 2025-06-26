'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const parametrosCripto = `
Gere sugestões de investimento em criptomoedas com base nos seguintes critérios:
1. Volume de negociação nas últimas 24h acima de $50 milhões.
2. Alta de pelo menos 5% nos últimos 3 dias.
3. Projeto com forte presença em redes sociais.
4. Listada nas exchanges Binance ou Coinbase.
5. Market cap inferior a $10 bilhões (altcoins promissoras).
  `;

  const parametrosAcoes = `
Gere sugestões de ações da bolsa com base nos seguintes critérios:
1. Volume médio diário acima de R$10 milhões.
2. P/L abaixo de 15.
3. Setor de tecnologia, energia ou financeiro.
4. Empresa com crescimento de receita nos últimos 3 trimestres.
5. Dividend Yield superior a 4%.
  `;

  async function enviar(tipo: 'cripto' | 'acao') {
    setLoading(true);
    setResposta('');
    const prompt = tipo === 'cripto' ? parametrosCripto : parametrosAcoes;

    try {
      const res = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResposta(data.resposta || 'Erro ao obter resposta.');
    } catch {
      setResposta('Erro ao conectar com a API.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Sugestões Inteligentes com DeepSeek
      </h1>

      <div className="flex flex-col gap-4">
        <Button onClick={() => enviar('cripto')} disabled={loading}>
          {loading ? 'Consultando...' : 'Gerar Sugestões de Criptomoedas'}
        </Button>
        <Button
          onClick={() => enviar('acao')}
          disabled={loading}
          variant="outline"
        >
          {loading ? 'Consultando...' : 'Gerar Sugestões de Ações da Bolsa'}
        </Button>
      </div>

      {resposta && (
        <Card className="mt-6">
          <CardContent className="p-4 prose prose-sm max-w-none">
            <strong>Resposta:</strong>
            <ReactMarkdown>{resposta}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
