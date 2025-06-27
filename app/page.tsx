'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const [criteriosCripto, setCriteriosCripto] = useState([
    'Capitalização de mercado de até R$200.000.000,00.',
    'Fornecimento máximo de até 500 milhões de tokens.',
    'Mais de 5.000 holders.',
    'Uma comunidade ativa.',
    'Me retorne 5 sugestões de criptomoedas com base nesses critérios.',
  ]);

  const [criteriosAcoes, setCriteriosAcoes] = useState([
    'VPA maior que 2 vezes o valor da ação.',
    'Dívida líquida / patrimônio menor ou igual a 1.',
    'Dividend yield maior que 10%.',
    'P/L menor que 10.',
    'EV/EBIT menor que 10.',
    'Me retorne 5 sugestões de ações da bolsa com base nesses critérios.',
  ]);

  const handleAddCriterio = (tipo: 'cripto' | 'acao') => {
    if (tipo === 'cripto') setCriteriosCripto([...criteriosCripto, '']);
    else setCriteriosAcoes([...criteriosAcoes, '']);
  };

  const handleRemoveCriterio = (tipo: 'cripto' | 'acao', index: number) => {
    if (tipo === 'cripto') {
      setCriteriosCripto(criteriosCripto.filter((_, i) => i !== index));
    } else {
      setCriteriosAcoes(criteriosAcoes.filter((_, i) => i !== index));
    }
  };

  const handleChangeCriterio = (
    tipo: 'cripto' | 'acao',
    index: number,
    value: string
  ) => {
    if (tipo === 'cripto') {
      const atualizados = [...criteriosCripto];
      atualizados[index] = value;
      setCriteriosCripto(atualizados);
    } else {
      const atualizados = [...criteriosAcoes];
      atualizados[index] = value;
      setCriteriosAcoes(atualizados);
    }
  };

  async function enviar(tipo: 'cripto' | 'acao') {
    setLoading(true);
    setResposta('');

    const criterios = tipo === 'cripto' ? criteriosCripto : criteriosAcoes;
    const prompt =
      `Gere sugestões de ${
        tipo === 'cripto' ? 'criptomoedas' : 'ações da bolsa'
      } com base nos seguintes critérios:\n` +
      criterios.map((c, i) => `${i + 1}. ${c}`).join('\n');

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
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Sugestões Inteligentes com DeepSeek
      </h1>

      <Tabs defaultValue="cripto" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="cripto">Criptomoedas</TabsTrigger>
          <TabsTrigger value="acao">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="cripto">
          <div className="space-y-4">
            {criteriosCripto.map((criterio, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={criterio}
                  onChange={(e) =>
                    handleChangeCriterio('cripto', i, e.target.value)
                  }
                  placeholder={`Critério ${i + 1}`}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveCriterio('cripto', i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handleAddCriterio('cripto')}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar Critério
            </Button>
            <Button
              onClick={() => enviar('cripto')}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Consultando...' : 'Gerar Sugestões de Criptomoedas'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="acao">
          <div className="space-y-4">
            {criteriosAcoes.map((criterio, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={criterio}
                  onChange={(e) =>
                    handleChangeCriterio('acao', i, e.target.value)
                  }
                  placeholder={`Critério ${i + 1}`}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveCriterio('acao', i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handleAddCriterio('acao')}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar Critério
            </Button>
            <Button
              onClick={() => enviar('acao')}
              disabled={loading}
              className="w-full"
              variant="secondary"
            >
              {loading ? 'Consultando...' : 'Gerar Sugestões de Ações da Bolsa'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

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
