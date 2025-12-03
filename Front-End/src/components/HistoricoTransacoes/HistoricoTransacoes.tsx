// src/components/HistoricoTransacoes/HistoricoTransacoes.tsx
// src/components/HistoricoTransacoes/HistoricoTransacoes.tsx
import { useEffect, useState } from "react";
// Importe a instância de API configurada
import api, { API_BASE_URL } from "../../config/api"; // *Ajuste o caminho conforme a localização real de 'api.ts'*
// Remova o axios que não está sendo usado
// import axios from "axios"; 
import "./HistoricoTransacoes.css";
import axios from "axios";

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
    const transacaoTotal = transacoes.reduce((acumulador, t) => acumulador + t.valor, 0)

    useEffect(() => {
        const fetchTransacoes = async () => {
            try {
                const response = await api.get(API_BASE_URL+'/conta/banco/transacao/filtros'); 

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
        <div className="saldo-transacoes">
          <p>Extrato de {mesFormatado}</p>
          <small>
            {transacaoTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </small>
        </div>
      </div>
      <ul className="lista">
        <h3>Minhas Transações</h3>
        {transacoes.length === 0 ? (

          <li className="nenhuma-transacao">
            <p>Nenhuma transação encontrada</p>
          </li>

        ) : (

          transacoes.map((t) => (
            <li key={t.id} className="transacao-item">
              <div className="transacao-info">
                <span>{t.dataTransacao}</span>
              </div>
              <p className={t.valor > 0 ? "valor-positivo" : "valor-negativo"}>
                {t.valor > 0 ? "+" : "-"} R$ {Math.abs(t.valor).toFixed(2).replace(".", ",")}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
