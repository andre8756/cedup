# 💰 Sistema de Gestão Financeira Pessoal  

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

📌 Trabalho de Conclusão de Curso – Instituto CEDUP Hermann Hering  
📅 Turma de Desenvolvimento de Sistemas (2023 – 2025)  

---

## 📑 Sumário
- [🎯 Objetivo Geral](#-objetivo-geral)
- [👨‍🏫 Principais Partes Interessadas](#-principais-partes-interessadas)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📡 Endpoints da API](#-endpoints-da-api)
- [🚀 Como Executar o Projeto](#-como-executar-o-projeto)
- [📊 Funcionalidades Principais](#-funcionalidades-principais)
- [📌 Status do Projeto](#-status-do-projeto)

---

## 🎯 Objetivo Geral  
Desenvolver um sistema web que permita ao usuário:  
- Cadastrar múltiplas contas bancárias;  
- Registrar e acompanhar todas as transações;  
- Emitir relatórios e extratos financeiros personalizados.  

---

## 👨‍🏫 Principais Partes Interessadas  

**Time de Professores / Banca:**  
- Orientador: Prof. Ricardo  
- Projeto de Software: Prof. Marcos Momo
- Práticas de Desenvolvimento de Sistemas IV: Prof. Antônio Carlos  
- Modelagem de Sistemas UML: Prof. Wesley  
- Treinamento Interpessoal: Prof. André

**Time de Desenvolvimento / Estudantes (Turma):**  
- **André Heriberto Schmidt** – Fullstack  
- **Nicolas Rotta** – Fullstack  
- **José Lourenço Neto** – Back-end  
- **Rogério** – Front-end  
- **Arthur Novaes** – Database  

---

## 🛠️ Tecnologias Utilizadas  
- **Back-end:** Java + Spring Boot  
- **Front-end:** React  
- **Banco de Dados:** MySQL  
- **Ferramentas de Teste:** Postman  
- **Controle de Versão:** Git/GitHub  

---

## 📡 Endpoints da API  

### ➕ Cadastro de Conta
```json
POST http://localhost:8080/conta
{
  "titular": "André Heriberto Schmitt",
  "email": "teste@gmail.com",
  "telefone": "47 99999-9999",
  "senha": "123",
  "cpf": "123.456.789-10"
}
```

### 📋 Listar Contas
```http
GET http://localhost:8080/conta
```

### 🔎 Buscar Conta por ID
```http
GET http://localhost:8080/conta/{id}
```

### ✏️ Atualizar Conta
```http
PUT http://localhost:8080/conta/{id}
```

### ❌ Deletar Conta
```http
DELETE http://localhost:8080/conta/{id}
```

---

### ➕ Cadastro de Banco
```json
POST http://localhost:8080/conta/{id}/banco
{
  "titular": "André",
  "nomeBanco": "Inter",
  "saldo": 600
}
```

### 📋 Listar Bancos
```http
GET http://localhost:8080/conta/banco
```

### 📋 Listar Bancos por Conta_id
```http
GET http://localhost:8080/conta/{id}/banco
```

### 🔎 Buscar Banco por ID
```http
GET http://localhost:8080/conta/banco/{id}
```

### ✏️ Atualizar Banco
```http
PUT http://localhost:8080/conta/banco/{id}
```

### ❌ Deletar Banco
```http
DELETE http://localhost:8080/conta/banco/{id}
```

---

## 🚀 Como Executar o Projeto  

### 🔧 Pré-requisitos  
- Node.js instalado  
- Java JDK + Spring Boot configurados  
- MySQL em execução  

### ▶️ Passos  
1. Clone este repositório:  
   ```bash
   git clone https://github.com/seu-repositorio.git
   ```
2. Acesse o diretório do projeto.  
3. Configure o banco de dados no `application.properties`.  
4. Rode o back-end com Spring Boot.  
5. Inicie o front-end React com:  
   ```bash
   npm start
   ```
6. Acesse em: `http://localhost:3000`  

---

## 📊 Funcionalidades Principais  
- Cadastro e autenticação de usuários  
- Criação e gerenciamento de contas bancárias  
- Registro de receitas e despesas  
- Geração de relatórios financeiros  
- Emissão de extratos personalizados  

---

## 📌 Status do Projeto  
🚧 Em desenvolvimento 🚧  
 
