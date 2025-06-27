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
1. Capitalização de mercado de até R$200.000.000,00.
2. Fornecimento máximo de até 500 milhões de tokens.
3. Mais de 5.000 holders.
4. Uma comunidade ativa.
`;

  const parametrosAcoes = `
Gere sugestões de ações da bolsa com base nos seguintes critérios:
1. VPA maior que 2 vezes o valor da ação.
2. Dívida líquida / patrimônio menor ou igual a 1.
3. Dividend yield maior que 10%.
4. P/L menor que 10.
5. EV/EBIT menor que 10.
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
