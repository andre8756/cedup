# 🖥️ Backend -- Sistema de Gestão Financeira Pessoal

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=black)
![Spring
Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

------------------------------------------------------------------------

## 📋 Sumário

- [📘 Visão Geral](#-visão-geral)
- [🧩 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [⚙️ Configuração do Projeto](#️-configuração-do-projeto)
- [🔐 Autenticação e Segurança](#-autenticação-e-segurança)
- [🚀 Como Executar o Backend](#-como-executar-o-backend)
- [📡 Endpoints Principais](#-endpoints-principais)
- [api/Auth (login ou register)](#auth-login-e-registro)
- [Conta 🔒](#-contarequer-token-)
- [Banco 🔒](#-bancorequer-token-)
- [Transações 🔒](#-transaçõesrequer-token-)
- [🧪 Testando com Postman](#-testando-com-postman)
- [📌 Observações Importantes](#-observações-importantes)

------------------------------------------------------------------------

## 📘 Visão Geral

Este é o **módulo backend** do projeto **Sistema de Gestão Financeira Pessoal**, desenvolvido em **Java + Spring Boot**, responsável por gerenciar usuários, contas bancárias e transações financeiras.  
A API expõe endpoints REST que permitem operações de **CRUD completo**, **transferências entre bancos**, além de contar com **autenticação e autorização via Spring Security e JWT**, garantindo **segurança no acesso às rotas e dados dos usuários**.


------------------------------------------------------------------------

## 🧩 Tecnologias Utilizadas

- **Java 17+**  
- **Spring Boot 3.x**  
- **Spring Security + JWT (Autenticação)**  
- **MySQL**  
- **ModelMapper**  
- **Postman**  
- **Maven**

------------------------------------------------------------------------

## ⚙️ Configuração do Projeto

1.  **Clonar o repositório:**

    ``` bash
    git clone https://github.com/seu-repositorio.git
    ```

2.  **Acessar o diretório do backend:**

    ``` bash
    cd backend
    ```

3.  **Configurar o banco de dados:**

    ``` properties
    spring.datasource.url=jdbc:mysql://localhost:3306/gestao_financeira
    spring.datasource.username=seu_usuario
    spring.datasource.password=sua_senha
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    ```

4.  **Instalar dependências:**

    ``` bash
    mvn clean install
    ```

------------------------------------------------------------------------

## 🚀 Como Executar o Backend

### 🧠 Opção 1 -- IntelliJ ou Eclipse

-   Execute a classe principal (`Application.java`).

### 💻 Opção 2 -- Via terminal

``` bash
mvn spring-boot:run
```

### 🌐 Acesse:

    http://localhost:8080

------------------------------------------------------------------------

## 📡 Endpoints Principais

### **Base URL**

    http://localhost:8080/conta

------------------------------------------------------------------------




## 🔐 Autenticação e Segurança

- Endpoints de **auth**: `/api/auth/register` e `/api/auth/login`  
- **JWT** usado para autenticação de todas as rotas protegidas  
- Para acessar endpoints protegidos, envie o token JWT no header:  

    ```
    Authorization: Bearer SEU_TOKEN_JWT
    ```

### 🔑 Auth (Login e Registro)

#### ➕ Registrar Usuário
```http
POST /api/auth/register
````

**Body (JSON obrigatório):**

> ⚠️ Todos os campos são obrigatórios e devem seguir o formato correto.

* `titular` (String): nome do titular
* `cpf` (String): 11 dígitos numéricos
* `email` (String): e-mail válido
* `senha` (String): mínimo 8 caracteres
* `telefone` (String): 10 ou 11 dígitos numéricos

**Exemplo de JSON válido:**

```json
{
  "titular": "Nicolas Rotta",
  "cpf": "12345678900",
  "email": "nicolas@email.com",
  "telefone": "47999999999",
  "senha": "Banana123"
}
```

#### 🔑 Fazer Login
```http
POST /api/auth/login
````

**Body (JSON obrigatório):**

* `identificador`: **email, telefone ou CPF** do usuário
* `senha`: senha cadastrada

**Exemplo de JSON usando email:**

```json
{
  "identificador": "nicolas@email.com",
  "senha": "Banana123"
}
```

**Exemplo de JSON usando telefone:**

```json
{
  "identificador": "47999999999",
  "senha": "Banana123"
}
```

**Exemplo de JSON usando CPF:**

```json
{
  "identificador": "12345678900",
  "senha": "Banana123"
}
```

**Retorno do JWT:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

***IMPORTANTE❗***  
Todos os endpoints protegidos precisarão do **token JWT** incluso no **Header** da requisição.

No Postman:

1. Vá na aba **Authorization**  
2. Configure o **Auth Type** como **Bearer Token**  
3. Cole o token recebido no login no campo **Token**

> Sem este header, as requisições retornarão `403 Forbidden`.

------------------------------------------------------------------------

### 🧍 Conta (requer Token 🔒)

---

#### 🔎 Buscar Conta Logada
```http
GET /conta/atual
````

**Retorno (JSON - ContaResponse):**

```json
{
  "titular": "Nicolas Rotta",
  "cpf": "12345678900",
  "email": "nicolas@email.com",
  "telefone": "47999999999",
  "saldoTotal": 1500.75,
  "status": true,
  "dataCadastro": "2025-11-23T20:00:00",
  "avatarUrl": "https://exemplo.com/avatar.png",
  "bancos": [
    {
      "id": 1,
      "nome": "Banco do Brasil",
      "agencia": "1234",
      "conta": "56789-0"
    }
  ]
}
```

---

#### ✏️ Atualizar Conta Logada

```http
PUT /conta/atual
```

**Body (JSON - ContaUpdateRequest):**

> ⚠️ Todos os campos abaixo são obrigatórios, exceto `senha` e `status` que são opcionais.

* `titular` (String): entre 3 e 100 caracteres
* `email` (String): e-mail válido
* `telefone` (String): 10 ou 11 dígitos numéricos
* `senha` (String, opcional): 6 a 20 caracteres
* `status` (Boolean, opcional): ativar/inativar conta

**Exemplo de JSON:**

```json
{
  "titular": "Nicolas Rotta",
  "email": "nicolas@email.com",
  "telefone": "47999999999",
  "senha": "NovaSenha123",
  "status": true
}
```

**Retorno (JSON - ContaUpdateResponse):**

```json
{
  "titular": "Nicolas Rotta",
  "email": "nicolas@email.com",
  "telefone": "47999999999",
  "status": true
}
```

---

#### ❌ Deletar Conta Logada

```http
DELETE /conta/atual
```

**Retorno:** 
```text
Conta deletada com sucesso!
```

------------------------------------------------------------------------

### 🏦 Bancos (requer Token 🔒)

---

#### ➕ Criar Banco na Conta Logada
```http
POST /conta/banco
````

**Body (JSON - BancoRequest):**

> ⚠️ Campos obrigatórios: `titular`, `nomeBanco`, `saldo`, `chavePix`.
> Campos opcionais: `status`, `permitirTransacao`, `bancoUrl`.

* `titular` (String) → titular do banco
* `nomeBanco` (String) → nome do banco
* `saldo` (Double) → saldo inicial, >= 0
* `chavePix` (String) → chave PIX válida (somente caracteres alfanuméricos e símbolos permitidos)
* `status` (Boolean, opcional) → ativo/inativo
* `permitirTransacao` (Boolean, opcional) → habilitar transações (PIX, TED, etc.)
* `bancoUrl` (String, opcional) → URL do ícone/logo do banco

**Exemplo de JSON:**

```json
{
  "titular": "Nicolas Rotta",
  "nomeBanco": "Inter",
  "saldo": 1200.50,
  "chavePix": "123-abc",
  "status": true,
  "permitirTransacao": true,
  "bancoUrl": "https://exemplo.com/banco.png"
}
```

**Retorno (JSON - BancoResponse):**

```json
{
  "id": 1,
  "titular": "Nicolas Rotta",
  "nomeBanco": "Inter",
  "saldo": 1200.50,
  "chavePix": "123-abc",
  "status": true,
  "permitirTransacao": true,
  "bancoUrl": "https://exemplo.com/banco.png",
  "dataCadastro": "23/11/2025 - 20:00"
}
```

---

#### 📋 Listar Bancos da Conta Logada

```http
GET /conta/banco
```

**Retorno (JSON - lista de BancoResponse):**

```json
[
  {
    "id": 1,
    "titular": "Nicolas Rotta",
    "nomeBanco": "Inter",
    "saldo": 1200.50,
    "chavePix": "123-abc",
    "status": true,
    "permitirTransacao": true,
    "bancoUrl": "https://exemplo.com/banco.png",
    "dataCadastro": "23/11/2025 - 20:00"
  }
]
```

---

#### 🔎 Buscar Banco por ID

```http
GET /conta/banco/id/{id}
```

**Retorno (JSON - BancoResponse):** igual ao exemplo acima.

---

#### 🔎 Buscar Banco por Chave Pix

```http
GET /conta/banco/chave-pix/{chavePix}
```

**Retorno (JSON - BancoResponse):** igual ao exemplo acima.

---

#### ✏️ Atualizar Banco da Conta Logada

```http
PUT /conta/banco/{id}
```

**Body (JSON - BancoUpdateRequest):**
Todos os campos são opcionais, envie apenas os que deseja atualizar.

* `titular` (String)
* `nomeBanco` (String)
* `saldo` (Float)
* `chavePix` (String)
* `status` (Boolean)
* `permitirTransacao` (Boolean)
* `bancoUrl` (String)

**Exemplo de JSON:**

```json
{
  "nomeBanco": "Inter Atualizado",
  "saldo": 1500.00
}
```

**Retorno (JSON - BancoUpdateResponse):**

```json
{
  "id": 1,
  "titular": "Nicolas Rotta",
  "nomeBanco": "Inter Atualizado",
  "saldo": 1500.00,
  "chavePix": "123-abc",
  "status": true,
  "dataCadastro": "23/11/2025 - 20:00"
}
```

---

#### ❌ Deletar Banco da Conta Logada

```http
DELETE /conta/banco/{id}
```

**Retorno:**

```text
Banco deletado com sucesso!
```

------------------------------------------------------------------------

### 💸 Transações (Requer token 🔒)

#### ➕ Criar Transação

```http
POST /conta/banco/transacao
````

**Body (JSON):**

```json
{
  "valor": 500.00,
  "descricao": "Transferência entre contas",
  "chavePixBancoOrigem": "123-abc",
  "chavePixBancoDestino": "456-def"
}
```

**Retorno (TransacaoResponseDto):**

```json
{
  "id": 1,
  "contaOrigemId": 10,
  "bancoOrigemChavePix": "123-abc",
  "bancoOrigemNome": "Inter",
  "bancoOrigemTitular": "Nicolas Rotta",
  "contaDestinoId": 20,
  "bancoDestinoChavePix": "456-def",
  "bancoDestinoNome": "Bradesco",
  "bancoDestinoTitular": "André",
  "valor": 500.0,
  "descricao": "Transferência entre contas",
  "dataTransacao": "2025-11-23T14:30:00"
}
```
---

#### ❌ Deletar Transação

```http
DELETE /conta/banco/transacao/{id}
```

**Retorno:**

```text
Transação deletada com sucesso!
```

---

#### 📝 Como usar os filtros de transações

Os endpoints `/conta/banco/transacao/filtros` e `/conta/banco/transacao/filtros` permitem listar transações usando diversos critérios, facilitando buscar apenas os registros que você deseja. Você pode combinar diferentes filtros para especificar os resultados.  

**Filtros disponíveis (opcionais):**

- `contaId`: ID da conta que você deseja filtrar.
- `contaOrigemId`: ID da conta de origem da transação.
- `contaDestinoId`: ID da conta de destino da transação.
- `bancoOrigemId`: ID do banco de origem.
- `bancoDestinoId`: ID do banco de destino.
- `bancosIds`: Lista de IDs de bancos para filtrar múltiplos bancos.
- `contasIds`: Lista de IDs de contas para filtrar múltiplas contas.
- `dataInicio`: Data/hora inicial do período desejado (ex: `2024-01-01T00:00:00`).
- `dataFim`: Data/hora final do período desejado (ex: `2024-12-31T23:59:59`).
- `valor`: Valor exato da transação que deseja filtrar.
- `descricao`: Termo presente na descrição da transação.

**Exemplo de uso:**

Para listar todas as transações da conta `1` entre 1º de janeiro e 31 de dezembro de 2024:

```http
GET /conta/banco/transacao/filtros?contaId=1&dataInicio=2024-01-01T00:00:00&dataFim=2024-12-31T23:59:59
````

Você pode combinar filtros. Por exemplo, para buscar todas as transações da conta `1` enviadas para o banco de destino com chave PIX `456-def`:

```http
GET /conta/banco/transacao/filtros?contaId=1&bancoDestinoChavePix=456-def
```

> 💡 **Dica:** filtros que não forem enviados serão ignorados, retornando todas as transações que correspondem aos filtros informados. Isso permite consultas flexíveis e customizadas.


#### 📋 Listar Transações com Filtros

```http
GET /conta/banco/transacao/filtros?contaId=1&dataInicio=2024-01-01T00:00:00&dataFim=2024-12-31T23:59:59
```

**Filtros possíveis (`TransacaoFiltro`):**

* `contaId` (Long)
* `contaOrigemId` (Long)
* `contaDestinoId` (Long)
* `bancoOrigemId` (Long)
* `bancoDestinoId` (Long)
* `bancosIds` (List<Long>)
* `contasIds` (List<Long>)
* `dataInicio` (LocalDateTime)
* `dataFim` (LocalDateTime)
* `valor` (Float)
* `descricao` (String)

**Retorno (List<TransacaoResponseDto>):**

```json
[
  {
    "id": 1,
    "contaOrigemId": 10,
    "bancoOrigemChavePix": "123-abc",
    "bancoOrigemNome": "Inter",
    "bancoOrigemTitular": "Nicolas Rotta",
    "contaDestinoId": 20,
    "bancoDestinoChavePix": "456-def",
    "bancoDestinoNome": "Bradesco",
    "bancoDestinoTitular": "André",
    "valor": 500.0,
    "descricao": "Transferência entre contas",
    "dataTransacao": "2025-11-23T14:30:00"
  }
]
```

---

#### 📋 Listar Transações com Filtros e gerar PDF

```http
GET /conta/banco/transacao/filtros/pdf?contaId=1&dataInicio=2024-01-01T00:00:00&dataFim=2024-12-31T23:59:59
```

**Retorno:** PDF contendo as transações filtradas.

---

#### 📊 Resumos Mensais

* **Receita Mensal:**

```http
GET /conta/banco/transacao/receita
```

**Retorno:** float (total de receitas do mês)

* **Despesa Mensal:**

```http
GET /conta/banco/transacao/despesa
```

**Retorno:** float (total de despesas do mês)

------------------------------------------------------------------------

## 🧪 Testando com Postman

1. Crie uma **Collection** e configure `base_url = http://localhost:8080`  
2. Registre uma conta com `/api/auth/register`  
3. Faça login com `/api/auth/login` e copie o **token JWT** retornado  
4. Para os endpoints protegidos, vá na aba **Authorization**, configure **Auth Type** como **Bearer Token** e cole o token no campo **Token**  
5. Execute os endpoints CRUD normalmente  
6. Use o formato **JSON** nos corpos de requisição

------------------------------------------------------------------------

## 📌 Observações Importantes

- CORS habilitado para `http://localhost:5173`  
- Respostas no formato **JSON**  
- Sessões são **stateless** (sem cookies, apenas JWT)  
- Códigos HTTP importantes:
    - `200 OK` → Sucesso  
    - `201 CREATED` → Criado com sucesso  
    - `204 NO CONTENT` → Excluído  
    - `400 BAD REQUEST` → Erro de autenticação ou dados inválidos  
    - `401 UNAUTHORIZED` → Token ausente ou inválido  
    - `403 FORBIDDEN` → Token inválido ou sem permissão  
    - `404 NOT FOUND` → Não encontrado

------------------------------------------------------------------------

### ✅ Exemplo de Fluxo Completo

1. Criar uma **Conta**  
2. Fazer **Login** e obter o **token JWT**  
3. Criar um **Banco vinculado à Conta**  
4. Fazer uma **Transação entre Bancos**  
5. Listar transações filtradas
