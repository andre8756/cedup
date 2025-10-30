import React, { useEffect, useState } from "react";
import PopupForm from "../../components/PopupAdd/PopupAdd";
import "./Conta.css";
import HistoricoTransacoes from "../../components/HistoricoTransacoes/HistoricoTransacoes";

interface Banco {
  nome: string;
  numero: number;
}

interface Conta {
  id: number;
  titular: string;
  saldo: number;
  bancos: Banco[];
}

const Conta: React.FC = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Pega token do cookie
  const getTokenFromCookie = () => {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    return match ? match[2] : null;
  };

  // Busca contas do usuário
  useEffect(() => {
    const fetchContas = async () => {
      const token = getTokenFromCookie();
      if (!token) {
        console.error("Usuário não autenticado");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/conta", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar contas");

        const data: Conta[] = await response.json();
        setContas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        
      }
    };

    fetchContas();
  }, []);

  // Adiciona nova conta
  const handleAddConta = async (novaConta: { titular: string; nomeBanco: string; saldo: number }) => {
    const token = getTokenFromCookie();
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/conta/banco", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(novaConta),
      });

      if (!response.ok) throw new Error("Erro ao adicionar conta");

      const contaSalva: Conta = await response.json();
      setContas((prev) => [...prev, contaSalva]);
      setShowPopup(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar conta!");
    }
  };

  if (loading) return <p className="loading">Carregando contas...</p>;

  // Calcula saldo total
  const saldoTotal = contas.reduce((total, conta) => total + conta.saldo, 0);


  return (
    <>
      <header className="header-main">
        <div className="logo">
          <h1>My Finances</h1>
          <p>Gestão Financeira Inteligente</p>
        </div>
        <div className="header-buttons">
          <button className="config">Configurações</button>
          <button className="add" onClick={() => setShowPopup(true)}>Adicionar</button>
        </div>
      </header>

      <div className="app">
        {/* Visão Geral */}
        <section> 
          <div className="overview-container">
            <div className="overview-card">
              {/* Boas-vindas */}
              <div className="welcome-section">
                <p className="greeting-text">Bem vindo,</p>
                <h1 className="user-name">{contas[0]?.titular || 'Usuário'}</h1>
              </div>

              {/* Receita e Despesa */}
              <div className="financial-summary">
                <div className="financial-item income">
                  <p className="item-label">Receita mensal</p>
                  <p className="item-value income-value">R$ 1.100,00</p>
                </div>
                <div className="vertical-divider"></div>
                <div className="financial-item expense">
                  <p className="item-label">Despesa mensal</p>
                  <p className="item-value expense-value">- R$ 400,00</p>
                </div>
              </div>

              {/* Conexões */} {/* EXEMPLO */}
              <div className="connections-section">
                <p className="item-label connections-label">Conexões Ativas</p>
                <div className="connection-icons">
                  <div className="connection-icon icon-orange"><span className="icon-placeholder"></span></div>
                  <div className="connection-icon icon-black">C6</div>
                  <div className="connection-icon icon-add">+</div>
                </div>
              </div>

              {/* Links */}
              <button className="view-more-link">Ver mais </button>
              <button className="manage-accounts-link">Gerenciar Contas</button>
            </div>
          </div>
        </section>

        {/* Contas */}
        <section className="accounts" aria-label="Suas Contas">
          <div className="accounts-header">
            <div className="left-side">
              <div className="Saldo-geral">
                <p>Saldo geral</p>
                <small>{saldoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</small>
              </div>
              <p className="section-title">Minhas Contas</p>
            </div>
            <button onClick={() => setShowPopup(true)}>Nova Conta</button>
          </div>

          <div className="account-cards">
            {contas.length === 0 ? (
              <p>Nenhuma conta cadastrada.</p>
            ) : (
              contas.map((conta) => (
                <article key={conta.id} className="account-card" aria-label={conta.titular}>
                  <div className="account-header">
                    <div className="account-info">
                      <strong>{conta.titular}</strong>
                      {conta.bancos?.map((banco) => (
                        <small key={banco.numero}>{banco.nome} - {banco.numero}</small>
                      ))}
                    </div>
                    <div className="menu-dots" aria-label="Menu">...</div>
                  </div>
                  <div>
                    <div className="available-label">Saldo geral
                      <div className="saldo">
                        {conta.saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} 
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

        </section>
      </div>
      <HistoricoTransacoes/>

      {/* POPUP */}
      {showPopup && <PopupForm onClose={() => setShowPopup(false)} onSubmit={handleAddConta} />}
    </>
  );
};

export default Conta;
