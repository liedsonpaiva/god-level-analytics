# 🍔 GodLevelAnalytics — Business Intelligence para Food Service
> **GodLevelAnalytics** é uma plataforma de **Business Intelligence** e **Data Analytics** desenvolvida para o setor de **Food Service**, permitindo análise operacional e estratégica de grandes volumes de dados de restaurantes.  
> Com arquitetura monolítica moderna (FastAPI + React + PostgreSQL), o sistema transforma dados em **insights acionáveis**, ajudando gestores a tomarem decisões rápidas e embasadas.

---

## 🧩 Sumário
- [Contexto](#contexto)
- [Problema do Desafio](#problema-do-desafio)
- [Solução Proposta](#solução-proposta)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Stack Tecnológica](#stack-tecnológica)
- [Como Executar Localmente](#como-executar-localmente)
- [Dataset Realista](#dataset-realista)
- [KPIs e Métricas Monitoradas](#kpis-e-métricas-monitoradas)
- [Roadmap Futuro](#roadmap-futuro)
- [Licença](#licença)

---

## 🧠 Contexto
Durante o **Hackathon de Analytics para Restaurantes**, foi proposto o desafio de resolver um problema real que afeta mais de **10.000 restaurantes no Brasil**:  
donos e gestores possuem **muitos dados**, mas **pouca inteligência sobre eles**.

A persona central é **Maria**, dona de três restaurantes em São Paulo, que vende por múltiplos canais (iFood, Rappi, balcão, WhatsApp e app próprio).  
Apesar de ter milhares de registros de vendas, **Maria não consegue responder perguntas simples como**:
- “Quais produtos mais vendem às quintas à noite?”
- “Meu ticket médio está caindo — é por canal ou por loja?”
- “Quais clientes compraram 3+ vezes e não voltaram há 30 dias?”

---

## 💡 Problema do Desafio
Os donos de restaurantes precisam de um **analytics específico, simples e poderoso**, que permita:
- Explorar dados livremente (sem depender de analistas);
- Obter insights automáticos e significativos;
- Compartilhar visões personalizadas com o time (financeiro, marketing, operação);
- Usar um sistema leve, intuitivo e pronto para rodar localmente.

---

## 🚀 Solução Proposta
O **GodLevelAnalytics** entrega um **sistema completo de Business Intelligence** desenvolvido sobre uma **arquitetura monolítica modular**, que une performance e simplicidade.

### 🧭 Diferenciais da Solução:
- Interface responsiva e moderna em **React + TailwindCSS**;
- API de alta performance com **FastAPI e SQLAlchemy (async)**;
- **Banco PostgreSQL** com 500.000+ vendas simuladas;
- Módulo **Insight Detector**: gera insights automáticos com base em regras e padrões detectados;
- Deploy local com **Docker Compose**, rodando toda a stack em segundos.

---

## 📊 Funcionalidades Principais
### 📈 Analytics em Tempo Real
- Dashboard executivo com visão consolidada de performance.
- Comparação entre **50+ lojas** e **diferentes períodos**.
- Métricas operacionais: tempos de produção, entrega e eficiência.

### 🏪 Gestão Multicanal
- Vendas presenciais (40%) vs Delivery (60%).
- Performance detalhada por canal (iFood, Rappi, Outros).
- Análise de ticket médio (R$45–85) e sazonalidade.

### 🍔 Analytics de Produtos
- 500+ produtos analisados com margens e rentabilidade.
- 200+ customizações rastreadas.
- Detecção automática de produtos com alta e baixa performance.

### 🤖 Insight Detector
- Sistema de regras automatizado que gera **alertas de oportunidades e anomalias**.
- Exemplo:  
  - “O canal iFood concentrou 60% das vendas semanais.”  
  - “Produto X teve queda de 25% no último mês.”

### 📤 Exportação e Compartilhamento
- Filtros avançados por **loja, canal, período e região**.  
- Exportação de relatórios em múltiplos formatos (PDF, CSV, Excel).

---

## 🏗️ Arquitetura do Sistema
O sistema segue uma **arquitetura monolítica modular** com separação clara entre frontend, backend e banco de dados.

godlevelanalytics/
├── backend/ # API FastAPI + PostgreSQL
│ ├── app/main.py
│ ├── database/
│ └── scripts/generate_data.py
├── frontend/ # React + Vite + TailwindCSS
│ ├── src/
│ ├── components/
│ └── services/
└── docs/ # Documentação técnica 


### 🔄 Fluxo de Dados
1. O usuário interage com o dashboard (React).  
2. O frontend consome a API FastAPI.  
3. A API consulta o banco PostgreSQL via SQLAlchemy (asyncpg).  
4. As respostas são exibidas como gráficos, KPIs e tabelas interativas.  

---

## 🧰 Stack Tecnológica

| Camada | Tecnologia | Função |
|--------|-------------|--------|
| **Backend** | FastAPI, SQLAlchemy, asyncpg | API REST e lógica analítica |
| **Banco de Dados** | PostgreSQL | Armazenamento relacional |
| **Frontend** | React, Vite, TailwindCSS | Interface de dashboards |
| **Infraestrutura** | Docker + Docker Compose | Deploy local e isolamento |
| **Dataset** | Python + Faker | Geração de dados sintéticos |
| **Insights** | Regras dinâmicas em Python | Geração automática de alertas |

---

## ⚙️ Como Executar Localmente

### 🧾 Pré-requisitos
- Docker e Docker Compose instalados  
- 4 GB de RAM disponíveis  
- 2 GB de espaço em disco  

### 🚀 Execução Rápida
```bash
# Clone o repositório
git clone <seu-repositorio>
cd godlevelanalytics/backend

# Execute tudo com um único comando
docker-compose up --build
