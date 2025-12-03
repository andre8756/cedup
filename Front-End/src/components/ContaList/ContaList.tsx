import React, { useEffect, useState } from "react";
import api from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";

interface Conta {
  id: number;
  titular: string;
  instituicao?: string;
  saldo: number;
}

const ContasList: React.FC = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContas = async () => {
      try {
        const resp = await api.get(API_ENDPOINTS.BANCO.BANCOS);
        setContas(resp.data || []);
      } catch (error) {
        console.error("Erro ao buscar contas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContas();
  }, []);

  if (loading) return <p>Carregando contas...</p>;

  return (
    <div>
      <h2>Suas Contas</h2>
      <ul>
        {contas.length === 0 ? (
          <li>Nenhuma conta cadastrada.</li>
        ) : (
          contas.map((conta) => (
            <li key={conta.id}>
              <strong>{conta.titular}</strong> — {conta.instituicao ?? ""} —{" "}
              <span>R$ {conta.saldo.toFixed(2)}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ContasList;