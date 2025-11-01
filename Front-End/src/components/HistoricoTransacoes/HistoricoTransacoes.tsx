// src/components/HistoricoTransacoes/HistoricoTransacoes.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./HistoricoTransacoes.css";

interface Transacao {
    id: number;
    dataTransacao: string;
    bancoDestino: string;
    valor: number;
    valorTotal: number;
}

export default function HistoricoTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const nomeMes = new Date().toLocaleString('pt-BR', { month: 'long' });
  const mesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
  const transacaoTotal = transacoes.reduce((acumulador, t) => acumulador +t.valor, 0)

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/banco/transacao", {
          withCredentials: true, 
        });
        setTransacoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchTransacoes();
  }, []);

  return (
    <section className="historico-transacoes">

      <div className="header-transacoes">
        <p className="title">Transações de {mesFormatado}</p>
        <div className="totalTransacao">
          <small>
            R$ {transacaoTotal}
          </small>
        </div>
      </div>
      <ul>
        {transacoes.length === 0 ? (

          <p>Nenhuma transação encontrada.</p>

        ) : (

          transacoes.map((t) => (
            <li key={t.id} className="transacao-item">
              <div className="transacao-info">
                <span>{t.dataTransacao}</span>
              </div>
              <p className={t.valor > 0 ? "valor positivo" : "valor negativo"}>
                {t.valor > 0 ? "+" : "-"} R$ {Math.abs(t.valor).toFixed(2).replace(".", ",")}
              </p>
            </li>
          ))
        )}
  </ul>
    </section>
  );
}
