// src/components/HistoricoTransacoes/HistoricoTransacoes.tsx
// src/components/HistoricoTransacoes/HistoricoTransacoes.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// usar a instância axios central (apiClient) e os endpoints centralizados
import api from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";
import "./HistoricoTransacoes.css";
import { parseDateString } from "../../lib/date";

interface Transacao {
    id: number;
    dataTransacao: string;
    bancoDestino?: string;
    valor: number;
    valorTotal?: number;
}

export default function HistoricoTransacoes() {
    const navigate = useNavigate();
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    // const nomeMes = new Date().toLocaleString('pt-BR', { month: 'long' });

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
                {(() => {
                  const d = parseDateString(t.dataTransacao);
                  return d
                    ? d.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : t.dataTransacao;
                })()}{" "}
                {t.bancoDestino || "Transação"}{" "}
                <span className={t.valor > 0 ? "valor-positivo" : "valor-negativo"}>
                  R$ {Math.abs(t.valor).toFixed(2).replace(".", ",")}
                </span>
              </span>
            </li>
          ))
        )}
      </ul>
      {transacoes.length > 0 && (
        <button 
          className="view-more-transacoes-btn" 
          onClick={() => navigate('/relatorios')}
        >
          Ver mais
        </button>
      )}
    </div>
  );
}