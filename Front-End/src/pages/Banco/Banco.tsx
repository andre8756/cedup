import { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { apiFetch } from '../../config/apiClient';
import { API_ENDPOINTS } from '../../config/api';
import PopupAdd from '../../components/PopupAdd/PopupAdd';
import PopupEdit from '../../components/PopupEdit/PopupEdit';
import { getShowSensitive, setShowSensitive, subscribeSensitive } from '../../lib/sensitive';
import './Banco.css';

interface Banco {
  id: number;
  titular: string;
  nomeBanco: string;
  saldo: number;
  chavePix: string;
  status: boolean;
  permitirTransacao: boolean;
  bancoUrl: string;
  dataCadastro?: string;
}

const Banco = () => {
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editingBanco, setEditingBanco] = useState<Banco | null>(null);
  const [showBalances, setShowBalancesState] = useState<boolean>(getShowSensitive());

  const setShowBalances = (v: boolean) => {
    setShowSensitive(v);
    setShowBalancesState(v);
  };

  // Fetch bancos
  const fetchBancos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch(API_ENDPOINTS.BANCO.BANCOS);
      if (!response.ok) {
        throw new Error('Erro ao buscar bancos');
      }
      const data = await response.json();
      setBancos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setBancos([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete banco
  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este banco?')) return;
    
    try {
      const response = await apiFetch(API_ENDPOINTS.BANCO.DELETAR(id), {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar banco');
      fetchBancos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar');
    }
  };

  useEffect(() => {
    fetchBancos();
    const unsubscribe = subscribeSensitive((newValue) => {
      setShowBalancesState(newValue);
    });
    return unsubscribe;
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="banco-container">
      <div className="banco-header">
        <div className="header-content">
          <h1>Meus Bancos</h1>
          <p className="header-subtitle">Gerencie todas as suas contas bancárias</p>
        </div>
        <div className="header-actions">
          <button
            className="toggle-sensitive-btn"
            onClick={() => setShowBalances(!showBalances)}
            aria-label={showBalances ? 'Ocultar saldos' : 'Mostrar saldos'}
          >
            {showBalances ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          <button
            className="add-bank-btn"
            onClick={() => {
              setEditingBanco(null);
              setShowPopup(true);
            }}
          >
            <Plus size={20} />
            Adicionar Banco
          </button>
        </div>
      </div>

      {showPopup && (
        <>
          {editingBanco ? (
            <PopupEdit
              banco={editingBanco}
              onClose={() => {
                setShowPopup(false);
                setEditingBanco(null);
              }}
              onUpdate={() => {
                fetchBancos();
                setShowPopup(false);
                setEditingBanco(null);
              }}
            />
          ) : (
            <PopupAdd
              onClose={() => {
                setShowPopup(false);
                fetchBancos();
              }}
            />
          )}
        </>
      )}

      <div className="banco-content">
        {loading ? (
          <div className="loading">Carregando bancos...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : bancos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏦</div>
            <h2>Nenhum banco cadastrado</h2>
            <p>Comece adicionando sua primeira conta bancária</p>
            <button
              className="add-bank-btn"
              onClick={() => {
                setEditingBanco(null);
                setShowPopup(true);
              }}
            >
              <Plus size={20} />
              Adicionar Primeiro Banco
            </button>
          </div>
        ) : (
          <div className="bancos-grid">
            {bancos.map((banco) => (
              <div key={banco.id} className="banco-card">
                <div className="card-header">
                  <div className="banco-logo">
                    {banco.bancoUrl ? (
                      <img src={banco.bancoUrl} alt={banco.nomeBanco} />
                    ) : (
                      <span className="logo-placeholder">🏦</span>
                    )}
                  </div>
                  <div className="card-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => {
                        setEditingBanco(banco);
                        setShowPopup(true);
                      }}
                      title="Editar banco"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(banco.id)}
                      title="Deletar banco"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <div className="bank-info">
                    <h3 className="bank-name">{banco.nomeBanco}</h3>
                    <p className="bank-holder">{banco.titular}</p>
                  </div>

                  <div className="bank-pix">
                    <label>Chave PIX</label>
                    <p className="pix-value">{banco.chavePix}</p>
                  </div>

                  <div className="bank-balance">
                    <label>Saldo</label>
                    <p className="balance-value">
                      {showBalances
                        ? banco.saldo.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        : 'R$ ••••••'}
                    </p>
                  </div>

                  <div className="bank-meta">
                    <div className="meta-item">
                      <span className="label">Status</span>
                      <span className={`status-badge ${banco.status ? 'active' : 'inactive'}`}>
                        {banco.status ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Transações</span>
                      <span className={`transaction-badge ${banco.permitirTransacao ? 'enabled' : 'disabled'}`}>
                        {banco.permitirTransacao ? 'Habilitado' : 'Desabilitado'}
                      </span>
                    </div>
                  </div>

                  {banco.dataCadastro && (
                    <div className="bank-date">
                      <small>Cadastrado em: {formatDate(banco.dataCadastro)}</small>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banco;
