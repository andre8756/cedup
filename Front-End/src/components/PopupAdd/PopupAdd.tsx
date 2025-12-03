/* eslint-disable no-irregular-whitespace */
import React, { useState } from "react";
import Select from "react-select";
import type { SingleValue } from "react-select";
import axios from "axios"; // usado para isAxiosError
import api from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";
import "./PopupAdd.css";
// Cookies handled by apiClient interceptor; no direct cookie access needed here

interface PopupFormProps {
  onClose: () => void;
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

const PopupForm: React.FC<PopupFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    titular: "",
    nomeBanco: "",
    saldo: "",
    chavePix: "", // Campo obrigatório pelo backend
    bancoUrl: "",
    status: true, // Campo opcional, padrão true
    permitirTransacao: true // Campo opcional, padrão true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Atualiza o estado para inputs normais
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [id]: type === 'checkbox' ? checked : value 
    });
    // Limpa erro do campo quando o usuário começa a digitar
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  // Validação do formato da chave PIX conforme backend: ^[\w@.\-+]+$
  const validarChavePix = (chavePix: string): boolean => {
    const regex = /^[\w@.\-+]+$/;
    return regex.test(chavePix);
  };

const handleSubmit = async () => {
  const newErrors: Record<string, string> = {};

  // Validação dos campos obrigatórios conforme README
  if (!formData.titular || formData.titular.trim() === "") {
    newErrors.titular = "O campo Titular da Conta é obrigatório.";
  } else if (formData.titular.trim().length < 3) {
    newErrors.titular = "O titular deve ter pelo menos 3 caracteres.";
  }

  if (!formData.nomeBanco || formData.nomeBanco.trim() === "") {
    newErrors.nomeBanco = "O campo Nome da Instituição Bancária é obrigatório.";
  }

  if (!formData.chavePix || formData.chavePix.trim() === "") {
    newErrors.chavePix = "O campo Chave Pix é obrigatório.";
  } else if (!validarChavePix(formData.chavePix.trim())) {
    newErrors.chavePix = "Formato de chave PIX inválido. Use apenas letras, números, @, ., -, +";
  }

  // Validação do saldo
  if (!formData.saldo || formData.saldo.trim() === "") {
    newErrors.saldo = "O campo Saldo é obrigatório.";
  } else {
    const saldoNumero = parseFloat(formData.saldo);
    if (isNaN(saldoNumero)) {
      newErrors.saldo = "O saldo deve ser um número válido.";
    } else if (saldoNumero < 0) {
      newErrors.saldo = "O saldo deve ser maior ou igual a zero.";
    }
  }

  // Se houver erros, exibe e para a execução
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    // Mostra o primeiro erro em um alert também
    const firstError = Object.values(newErrors)[0];
    alert(firstError);
    return;
  }

  // Cria o payload no formato que o backend espera
  // Campos obrigatórios: titular, nomeBanco, saldo, chavePix
  // Campos opcionais: status, permitirTransacao, bancoUrl
  const saldoNumero = parseFloat(formData.saldo);
  const novaConta = {
    titular: formData.titular.trim(),
    nomeBanco: formData.nomeBanco.trim(),
    saldo: saldoNumero,
    chavePix: formData.chavePix.trim(),
    // Campos opcionais
    status: formData.status,
    permitirTransacao: formData.permitirTransacao,
    bancoUrl: formData.bancoUrl.trim() || undefined
  };

  try {
    // Usa a instância 'api' (Axios com Token JWT) e endpoint centralizado
    const response = await api.post(API_ENDPOINTS.BANCO.CRIAR, novaConta);
    
    // Verifica se a resposta foi bem-sucedida (201 CREATED)
    if (response.status === 201) {
      // Fechar o popup após sucesso
      onClose();
    }

  } catch (error) {
    console.error("Erro na criação do banco:", error);
    
    // Tratamento detalhado de erros
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 401 || status === 403) {
          alert("Erro de autenticação. Token inválido ou expirado. Faça login novamente.");
        } else if (status === 400) {
          // Tenta extrair mensagem de erro do backend
          const errorMessage = typeof errorData === 'string' 
            ? errorData 
            : errorData?.message || "Dados inválidos. Verifique se todos os campos obrigatórios foram preenchidos corretamente.";
          alert(`Erro de validação: ${errorMessage}`);
        } else if (status === 404) {
          alert("Endpoint não encontrado. Verifique a configuração da API.");
        } else if (status >= 500) {
          alert("Erro interno do servidor. Tente novamente mais tarde.");
        } else {
          alert(`Erro ao criar banco (Status ${status}). Tente novamente.`);
        }
      } else if (error.request) {
        // Erro de rede - requisição foi feita mas não houve resposta
        alert("Erro de conexão com o servidor. Verifique sua conexão com a internet.");
      } else {
        // Erro ao configurar a requisição
        alert("Erro ao processar a requisição. Tente novamente.");
      }
    } else {
      // Erro desconhecido
      alert("Erro inesperado. Tente novamente.");
    }
  }
};


  return (
    <>
    <div className="popup">
      <div className="popup-content">
        <h1>Adicionar Conta</h1>
        
        <label htmlFor="titular">
          Titular da Conta <span className="required">*</span>:
        </label>
        <input
          id="titular"
          value={formData.titular}
          onChange={handleChange}
          placeholder="Ex: Lucas Andrade"
          className={errors.titular ? 'error' : ''}
        />
        {errors.titular && <span className="error-message">{errors.titular}</span>}

        <label htmlFor="nomeBanco">
          Nome da Instituição Bancária <span className="required">*</span>:
        </label>
        <div className={errors.nomeBanco ? 'error-select' : ''}>
          <Select
            options={options}
            value={options.find(opt => opt.value === formData.nomeBanco) || null}
            formatOptionLabel={(option: Option) => (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {option.img && (
                  <img 
                    src={option.img} 
                    width="20" 
                    height="20" 
                    alt={option.label}
                    style={{ borderRadius: '4px' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                  />
                )}
                <span>{option.label}</span>
              </div>
            )}
            onChange={(selected: SingleValue<Option>) => {
              setFormData({
                ...formData,
                nomeBanco: selected?.value || "",
                bancoUrl: (selected as Option | null)?.img || ""
              });
              if (errors.nomeBanco) {
                setErrors({ ...errors, nomeBanco: '' });
              }
            }}
            placeholder="Selecione um banco..."
            isSearchable={false}
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: '44px',
                border: state.isFocused 
                  ? (errors.nomeBanco ? '2px solid #ef4444' : '2px solid #2c7be5')
                  : (errors.nomeBanco ? '2px solid #ef4444' : '2px solid #e5e7eb'),
                borderRadius: '8px',
                boxShadow: state.isFocused 
                  ? (errors.nomeBanco 
                      ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
                      : '0 0 0 3px rgba(44, 123, 229, 0.1)')
                  : 'none',
                '&:hover': {
                  border: errors.nomeBanco ? '2px solid #ef4444' : '2px solid #d1d5db',
                },
                backgroundColor: errors.nomeBanco ? '#fef2f2' : '#fff',
              }),
              placeholder: (base) => ({
                ...base,
                color: '#9ca3af',
              }),
            }}
          />
        </div>
        {errors.nomeBanco && <span className="error-message">{errors.nomeBanco}</span>}

        <label htmlFor="chavePix">
          Chave Pix <span className="required">*</span>:
        </label>
        <input
          id="chavePix" 
          value={formData.chavePix}
          onChange={handleChange}
          placeholder="Ex: email@exemplo.com ou 123-abc"
          className={errors.chavePix ? 'error' : ''}
        />
        {errors.chavePix && <span className="error-message">{errors.chavePix}</span>}
        <small className="hint">Use apenas letras, números, @, ., -, +</small>

        <label htmlFor="saldo">
          Saldo Inicial <span className="required">*</span>:
        </label>
        <input
          id="saldo"
          type="number"
          step="0.01"
          min="0"
          value={formData.saldo}
          onChange={handleChange}
          placeholder="Ex: 1200.50"
          className={errors.saldo ? 'error' : ''}
        />
        {errors.saldo && <span className="error-message">{errors.saldo}</span>}

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              id="status"
              checked={formData.status}
              onChange={handleChange}
            />
            <span>Conta ativa</span>
          </label>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              id="permitirTransacao"
              checked={formData.permitirTransacao}
              onChange={handleChange}
            />
            <span>Permitir transações (PIX, TED, etc.)</span>
          </label>
        </div>

        <div className="popup-buttons">
          <button type="button" className= "enviar" onClick={handleSubmit}>Adicionar Conta</button>
          <button type="button" className= "cancelar" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default PopupForm;