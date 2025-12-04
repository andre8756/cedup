/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import type { SingleValue } from "react-select";
import axios from "axios";
import api from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";
import { X } from "lucide-react";
import "./PopupEdit.css";

interface PopupEditProps {
  banco: {
    id: number;
    titular: string;
    nomeBanco: string;
    saldo: number;
    chavePix?: string;
    status?: boolean;
    permitirTransacao?: boolean;
    bancoUrl: string;
  };
  onClose: () => void;
  onUpdate: () => void;
}

interface Option {
  value: string;
  label: string;
  img?: string;
}

// Opções de bancos para o Select
const options: Option[] = [    
     {
        value: "Banco do Brasil", 
        label: "Banco do Brasil",
        img: "https://logodownload.org/wp-content/uploads/2014/05/banco-do-brasil-logo-0.png"
    },
    {
        value: "Nubank", 
        label: "Nubank",
        img: "https://logodownload.org/wp-content/uploads/2019/08/nubank-logo-0-1.png"
    },
    {
        value: "Bradesco",
        label: "Bradesco",
        img: "https://images.seeklogo.com/logo-png/47/1/bradesco-icon-logo-png_seeklogo-473120.png"
    },
    {
        value: "Itaú",
        label: "Itaú",
        img: "https://images.seeklogo.com/logo-png/51/1/itau-logo-png_seeklogo-512719.png"
    },
    {
        value: "Santander",
        label: "Santander",
        img: "https://logodownload.org/wp-content/uploads/2017/05/banco-santander-logo-40.png"
    },
    {
        value: "Outro Banco", 
        label: "Outro Banco", 
        img: ""
    }
];

const PopupEdit: React.FC<PopupEditProps> = ({ banco, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    titular: banco.titular || "",
    nomeBanco: banco.nomeBanco || "",
    saldo: banco.saldo?.toString() || "",
    chavePix: banco.chavePix || "",
    bancoUrl: banco.bancoUrl || "",
    status: banco.status !== undefined ? banco.status : true,
    permitirTransacao: banco.permitirTransacao !== undefined ? banco.permitirTransacao : true,
  });

  // Atualiza o estado para inputs normais
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.id]: value });
  };

  const handleSubmit = async () => {
    // Cria o payload no formato que o backend espera
    // Todos os campos são opcionais, mas se enviados devem ser válidos
    const bancoAtualizado: any = {};

    // Valida e adiciona apenas campos que foram alterados
    if (formData.titular && formData.titular.trim() !== "") {
      bancoAtualizado.titular = formData.titular.trim();
    }

    if (formData.nomeBanco && formData.nomeBanco.trim() !== "") {
      bancoAtualizado.nomeBanco = formData.nomeBanco.trim();
    }

    if (formData.saldo !== undefined && formData.saldo !== "") {
      const saldoNumero = parseFloat(formData.saldo.toString());
      if (isNaN(saldoNumero) || saldoNumero < 0) {
        alert("O saldo deve ser um número maior ou igual a zero.");
        return;
      }
      bancoAtualizado.saldo = saldoNumero;
    }

    if (formData.chavePix && formData.chavePix.trim() !== "") {
      bancoAtualizado.chavePix = formData.chavePix.trim();
    }

    if (formData.bancoUrl && formData.bancoUrl.trim() !== "") {
      bancoAtualizado.bancoUrl = formData.bancoUrl.trim();
    }

    // Campos booleanos sempre podem ser atualizados
    bancoAtualizado.status = formData.status;
    bancoAtualizado.permitirTransacao = formData.permitirTransacao;

    // Verifica se há algum campo para atualizar
    if (Object.keys(bancoAtualizado).length === 0) {
      alert("Nenhuma alteração foi realizada.");
      return;
    }

    try {
      const response = await api.put(API_ENDPOINTS.BANCO.EDITAR(banco.id), bancoAtualizado);
      
      // Verifica se a resposta foi bem-sucedida (200 OK)
      if (response.status === 200) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Erro na atualização do banco:", error);
      
      // Tratamento detalhado de erros
      if (axios.isAxiosError(error)) {
          if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data;

            const extractMessage = (d: any) => {
              if (!d) return null;
              if (typeof d === 'string') return d;
              if (d?.message) return d.message;
              if (d?.error) return d.error;
              if (Array.isArray(d?.errors) && d.errors.length > 0) return d.errors[0];
              return null;
            };

            const backendMessage = extractMessage(errorData);

            if (backendMessage) {
              const lower = backendMessage.toLowerCase();
              if ((status === 401 || status === 403) && (lower.includes('token') || lower.includes('autent') || lower.includes('credencial'))) {
                alert("Erro de autenticação. Token inválido ou expirado. Faça login novamente.");
                try { (await import('js-cookie')).default.remove('token'); } catch (e) { /* ignore */ }
                try { window.location.href = '/login'; } catch (e) { /* ignore */ }
                return;
              }
              alert(`Erro: ${backendMessage}`);
              return;
            }

            if (status === 401 || status === 403) {
              alert("Erro de autenticação. Token inválido ou expirado. Faça login novamente.");
            } else if (status === 400) {
              const errorMessage = typeof errorData === 'string'
                ? errorData
                : errorData?.message || "Dados inválidos. Verifique os campos preenchidos.";
              alert(`Erro de validação: ${errorMessage}`);
            } else if (status === 404) {
              alert("Banco não encontrado. O banco pode ter sido deletado.");
            } else if (status >= 500) {
              alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
              alert(`Erro ao atualizar banco (Status ${status}). Tente novamente.`);
            }
        } else if (error.request) {
          alert("Erro de conexão com o servidor. Verifique sua conexão com a internet.");
        } else {
          alert("Erro ao processar a requisição. Tente novamente.");
        }
      } else {
        alert("Erro inesperado. Tente novamente.");
      }
    }
  };

  // Encontra a opção selecionada para o Select
  const selectedOption = options.find(opt => opt.value === formData.nomeBanco) || null;

  return (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <h1>Editar Conta</h1>
          <button className="popup-close" type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="titular">Titular da Conta:</label>
            <input
              id="titular"
              type="text"
              value={formData.titular}
              onChange={handleChange}
              placeholder="Ex: Lucas Andrade"
            />
          </div>

          <div className="form-row">
            <label htmlFor="nomeBanco">Nome da Instituição Bancária:</label>
            <Select
              options={options}
              value={selectedOption}
              formatOptionLabel={(option: Option) => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img src={option.img} width="20" height="20" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <span>{option.label}</span>
                </div>
              )}
              onChange={(selected: SingleValue<Option>) => {
                setFormData({
                  ...formData,
                  nomeBanco: selected?.value || "",
                  bancoUrl: (selected as Option | null)?.img || ""
                });
              }}
            />
          </div>

          <div className="form-row">
            <label htmlFor="chavePix">Chave Pix:</label>
            <input
              id="chavePix" 
              type="text"
              value={formData.chavePix}
              onChange={handleChange}
              placeholder="Ex: email@exemplo.com"
            />
          </div>

          <div className="form-row">
            <label htmlFor="saldo">Informe o Saldo Bancário:</label>
            <input
              id="saldo"
              type="number"
              step="0.01"
              value={formData.saldo}
              onChange={handleChange}
              placeholder="Ex: 6312.48"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  id="status"
                  type="checkbox"
                  checked={formData.status}
                  onChange={handleChange}
                />
                <span>Status Ativo</span>
              </label>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  id="permitirTransacao"
                  type="checkbox"
                  checked={formData.permitirTransacao}
                  onChange={handleChange}
                />
                <span>Permitir Transação</span>
              </label>
            </div>
          </div>
        </div>

        <div className="popup-buttons">
          <button type="button" className="enviar" onClick={handleSubmit}>Atualizar Conta</button>
          <button type="button" className="cancelar" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default PopupEdit;
