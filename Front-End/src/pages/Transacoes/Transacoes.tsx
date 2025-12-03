import { useEffect, useState } from "react";
import axios from "axios";
import "./Transacoes.css";
import FiltroTransacoes from "../../components/FiltroTransacoes/FiltroTransacoes";
import Cookie from "js-cookie";

interface Transacao {
  id: number;
  bancoDestino: string;
  descricao?: string;
  dataTransacao: string;
  valor: number;
}
export default function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  useEffect(() => {
    const fetchTransacoes = async () => {
      
      try {
        const response = await axios.get(
          "https://cedup-back-deploy.onrender.com/conta/banco/transacao",
          {
            withCredentials: true,
            // pass Authorization header explicitly (if using localStorage token)
            headers: {
              Authorization: `Bearer ${Cookie.get("token")}`,
            },
          }
        );
        setTransacoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchTransacoes();
  }, []);

  return (
    <>
      <p className="title">Histórico de Transações</p>
      <FiltroTransacoes />

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
                    <strong className="nome-banco">{t.bancoDestino}</strong>
                    <p className="descricao-mov">
                      {t.descricao ?? "Transação bancária"}
                    </p>
                    <small className="data-mov">
                      {new Date(t.dataTransacao).toLocaleDateString("pt-BR")}
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
