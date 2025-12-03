// src/components/HistoricoTransacoes/HistoricoTransacoes.tsx
// src/components/HistoricoTransacoes/HistoricoTransacoes.tsx
import { useEffect, useState } from "react";
// usar a instância axios central (apiClient) e os endpoints centralizados
import api from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";
import "./HistoricoTransacoes.css";

interface Transacao {
    id: number;
    dataTransacao: string;
    bancoDestino?: string;
    valor: number;
    valorTotal?: number;
}

export default function HistoricoTransacoes() {
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const nomeMes = new Date().toLocaleString('pt-BR', { month: 'long' });
    const mesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
    const transacaoTotal = transacoes.reduce((acumulador, t) => acumulador + t.valor, 0)

    useEffect(() => {
        const fetchTransacoes = async () => {
            try {
                const response = await api.get(API_ENDPOINTS.BANCO.LISTAR_COM_FILTROS);

                setTransacoes(response.data);
            } catch (error) {
                console.error("Erro ao buscar transações:", error);
            }
        };

        fetchTransacoes();
    }, []);

  return (
    <div className="historico-transacoes-simple">
      <ul className="transacoes-lista">
        {transacoes.length === 0 ? (
          <li className="nenhuma-transacao">
            <p>Nenhuma transação encontrada</p>
          </li>
        ) : (
          transacoes.slice(0, 3).map((t) => (
            <li key={t.id} className="transacao-item-simple">
              <span className="transacao-texto">
                {new Date(t.dataTransacao).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {t.bancoDestino || "Transação"}{" "}
                <span className={t.valor > 0 ? "valor-positivo" : "valor-negativo"}>
                  R$ {Math.abs(t.valor).toFixed(2).replace(".", ",")}
                </span>
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}