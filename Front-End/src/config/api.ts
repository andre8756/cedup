const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },

  CONTA: {
    ATUAL: `${API_BASE_URL}/conta/atual`,         // GET conta do usuário
    EDITAR: `${API_BASE_URL}/conta/atual`,        // PUT atualizar conta
    DELETAR: `${API_BASE_URL}/conta/atual`,       // DELETE apagar conta
  },

  BANCO: {
    // ================================
    // BANCOS
    // ================================
    BANCOS: `${API_BASE_URL}/conta/banco`,                 // GET listar bancos da conta
    CRIAR: `${API_BASE_URL}/conta/banco`,                  // POST salvar banco
    EDITAR: (id: number) => `${API_BASE_URL}/conta/banco/${id}`,    // PUT atualizar banco
    DELETAR: (id: number) => `${API_BASE_URL}/conta/banco/${id}`,   // DELETE remover banco
    BUSCAR: (id: number) => `${API_BASE_URL}/conta/banco/id/${id}`, // GET buscar por id
    PERMITEM_TRANSACAO: `${API_BASE_URL}/conta/banco/permitir-transacao`, // GET listar bancos com PIX habilitado
    POR_CHAVE_PIX: (chavePix: string) => `${API_BASE_URL}/conta/banco/chave-pix/${chavePix}`, // GET banco por chave pix

    // ================================
    // TRANSAÇÕES
    // ================================
    CRIAR_TRANSACAO: `${API_BASE_URL}/conta/banco/transacao`,      // POST
    DELETAR_TRANSACAO: (id: number) => `${API_BASE_URL}/conta/banco/transacao/${id}`,  // DELETE
    LISTAR_COM_FILTROS: `${API_BASE_URL}/conta/banco/transacao/filtros`, // GET com parametros

    // ================================
    // PDF
    // ================================
    DOWNLOAD_PDF: `${API_BASE_URL}/conta/banco/transacao/filtros/pdf`, // GET retorna PDF (Suporta filtros tambem)

    // ================================
    // RESUMOS
    // ================================
    RECEITA_MENSAL: `${API_BASE_URL}/conta/banco/transacao/receita`, // GET número float
    DESPESA_MENSAL: `${API_BASE_URL}/conta/banco/transacao/despesa`, // GET número float
  },
};

export default API_BASE_URL;
