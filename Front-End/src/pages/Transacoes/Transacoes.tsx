import { useEffect, useState } from "react";
import api from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";
import "./Transacoes.css";
import FiltroTransacoes from "../../components/FiltroTransacoes/FiltroTransacoes";
import { parseDateString } from "../../lib/date";

interface Transacao {
  id: number;
  bancoDestino?: string;
  descricao?: string;
  dataTransacao: string;
  valor: number;
}
export default function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const fetchTransacoes = async () => {
    try {
      const resp = await api.get(API_ENDPOINTS.BANCO.LISTAR_COM_FILTROS);
      setTransacoes(resp.data || []);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      setTransacoes([]);
    }
  };

  useEffect(() => {
    fetchTransacoes();
  }, []);

  const handleFilteredData = (filteredData: Transacao[]) => {
    setTransacoes(filteredData);
  };

  return (
    <>
      <p className="title">Histórico de Transações</p>
      <FiltroTransacoes 
        onFilterApplied={fetchTransacoes} 
        onFilteredData={handleFilteredData}
      />

      <section className="painel-movimentacoes">
        <header className="titulo-historico">
          <small>{transacoes.length} transações</small>
        </header>

        <div className="teste">
          <ul className="lista-cards-mov">
            {transacoes.length === 0 ? (
              <li className="movimentacao-vazia">
                <p>Nenhuma transação encontrada</p>
              </li>
            ) : (
              transacoes.map((t) => (
                <li key={t.id} className="card-movimentacao">
                  <div className="icone-banco">
                    <span className="logo-fake"></span>
                  </div>

                  <div className="conteudo-card">
                    <strong className="nome-banco">
                      {t.bancoDestino ?? "Transação"}
                    </strong>
                    <p className="descricao-mov">
                      {t.descricao ?? "Transação bancária"}
                    </p>
                    <small className="data-mov">
                      {(() => {
                        const d = parseDateString(t.dataTransacao);
                        return d
                          ? d.toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : t.dataTransacao;
                      })()}
                    </small>
                  </div>

                  <div className="valor-card">
                    <span
                      className={`tag ${
                        t.valor > 0 ? "tag-entrada" : "tag-saida"
                      }`}
                    >
                      {t.valor > 0 ? "Entrada" : "Saída"}
                    </span>

                    <p
                      className={`valor ${
                        t.valor > 0 ? "valor-positivo" : "valor-negativo"
                      }`}
                    >
                      {t.valor > 0 ? "+" : "-"} R{" "}
                      {Math.abs(t.valor).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </>
  );
}