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
  - [Conta](#conta)
  - [Banco](#banco)
  - [Transações](#transações)
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
``` http
POST /api/auth/register
```
**Body:**

``` json
{
  "titular": "Nicolas Rotta",
  "cpf": "123.456.789-00",
  "email": "nicolas@email.com",
  "telefone": "(47) 99999-9999",
  "senha":"Banana",
  "role": "USER"
}
```

#### 🔑 Fazer Login
```http
POST /api/auth/login
```

**Body:**

``` json
{
  "email": "nicolas@email.com",
  "senha": "Banana"
}
```

**Retorno do JWT:**

``` json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
------------------------------------------------------------------------







### 🧍 Conta


#### 📋 Listar Contas

``` http
GET /conta
```

#### 🔎 Buscar Conta por ID

``` http
GET /conta/{id}
```

#### ✏️ Atualizar Conta

``` http
PUT /conta/{id}
```

#### ❌ Deletar Conta

``` http
DELETE /conta/{id}
```

------------------------------------------------------------------------

### 🏦 Banco

#### ➕ Criar Banco

``` http
POST /conta/{contaId}/banco
```

**Body:**

``` json
{
  "titular": "André",
  "nomeBanco": "Inter",
  "saldo": 1200.50
}
```

#### 📋 Listar Todos os Bancos

``` http
GET /conta/banco
```

#### 📋 Listar Bancos por Conta

``` http
GET /conta/{id}/banco
```

#### 🔎 Buscar Banco por ID

``` http
GET /conta/banco/{id}
```

#### ✏️ Atualizar Banco

``` http
PUT /conta/banco/{id}
```

#### ❌ Deletar Banco

``` http
DELETE /conta/banco/{id}
```

------------------------------------------------------------------------

### 💸 Transações

#### ➕ Criar Transação

``` http
POST /conta/banco/{bancoOrigemId}/{bancoDestinoId}/transacao
```

**Body:**

``` json
{
  "valor": 500.00,
  "descricao": "Transferência entre contas"
}
```

#### ✏️ Atualizar Transação

``` http
PUT /conta/banco/transacao/{id}
```

#### ❌ Deletar Transação

``` http
DELETE /conta/banco/transacao/{id}
```

#### 📋 Listar Transações com Filtros

``` http
GET /conta/banco/transacao/filtros?contaId=1&dataInicio=2024-01-01T00:00:00&dataFim=2024-12-31T23:59:59
```

------------------------------------------------------------------------

## 🧪 Testando com Postman

1.  Crie uma **Collection** e configure
    `base_url = http://localhost:8080`\
2.  Execute os endpoints CRUD\
3.  Use o formato JSON nos corpos de requisição

------------------------------------------------------------------------

## 📌 Observações Importantes

-   CORS habilitado para `http://localhost:5173`\
-   Respostas no formato **JSON**\
-   Códigos HTTP:
    -   `200 OK` → Sucesso\
    -   `201 CREATED` → Criado com sucesso\
    -   `204 NO CONTENT` → Excluído\
    -   `404 NOT FOUND` → Não encontrado

------------------------------------------------------------------------

### ✅ Exemplo de Fluxo Completo

1.  Criar uma **Conta**
2.  Criar um **Banco vinculado à Conta**
3.  Fazer uma **Transação entre dois Bancos**
4.  Listar transações filtradas
