/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import type { SingleValue } from "react-select";
import axios from "axios";
import api from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";
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
        img: "https://logodownload.org/wp-content/uploads/2014/05/banco-do-brasil-logo-1.png"
    },
    {
        value: "Nubank", 
        label: "Nubank",
        img: "https://1000marcas.net/wp-content/uploads/2020/05/Logo-Nubank.png"
    },
    {
        value: "Bradesco",
        label: "Bradesco",
        img: "https://logodownload.org/wp-content/uploads/2014/05/bradesco-logo-1.png"
    },
    {
        value: "Itaú",
        label: "Itaú",
        img: "https://logodownload.org/wp-content/uploads/2014/05/itau-logo-1.png"
    },
    {
        value: "Santander",
        label: "Santander",
        img: "https://logodownload.org/wp-content/uploads/2014/05/santander-logo-1.png"
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
    <>
      <div className="popup">
        <div className="popup-content">
          <h1>Editar Conta</h1>
          
          <label htmlFor="titular">Titular da Conta:</label>
          <input
            id="titular"
            value={formData.titular}
            onChange={handleChange}
            placeholder="Ex: Lucas Andrade"
          />

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
          ></Select>

          <label htmlFor="chavePix">Chave Pix:</label>
          <input
            id="chavePix" 
            value={formData.chavePix}
            onChange={handleChange}
            placeholder="Ex: email@exemplo.com"
          />

          <label htmlFor="saldo">Informe o Saldo Bancário:</label>
          <input
            id="saldo"
            type="number"
            step="0.01"
            value={formData.saldo}
            onChange={handleChange}
            placeholder="Ex: 6312.48"
          />

          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <label htmlFor="status" style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                id="status"
                type="checkbox"
                checked={formData.status}
                onChange={handleChange}
              />
              <span>Status Ativo</span>
            </label>

            <label htmlFor="permitirTransacao" style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                id="permitirTransacao"
                type="checkbox"
                checked={formData.permitirTransacao}
                onChange={handleChange}
              />
              <span>Permitir Transação</span>
            </label>
          </div>

          <div className="popup-buttons">
            <button type="button" className="enviar" onClick={handleSubmit}>Atualizar Conta</button>
            <button type="button" className="cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupEdit;
