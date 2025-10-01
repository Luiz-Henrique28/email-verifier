Sistema inteligente de análise de emails usando IA (Google Gemini) para classificar mensagens, detectar phishing e sugerir respostas automáticas.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## Funcionalidades

- **Análise de Emails** - Processa assunto, corpo e anexos
- **Detecção de Phishing** - Identifica tentativas de fraude
- **Classificação Inteligente** - Categoriza como Produtivo/Improdutivo
- **Sugestão de Resposta** - Gera respostas automáticas contextuais
- **Suporte a Anexos** - Processa arquivos TXT e PDF (até 5 arquivos, max 10MB cada)

---

## Demo

<img width="1682" height="990" alt="image" src="https://github.com/user-attachments/assets/2611010e-cdea-485e-94b0-058dbdb7c6d3" />

---

## Pré-requisitos

- Python 3.8 ou superior
- Chave de API do Google Gemini ([obter aqui](https://ai.google.dev/))

---

## Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/Luiz-Henrique28/email-verifier.git
cd email-verifier
````

### 2. Instale as dependências

```bash
pip install -r requirements.txt
```

### 3. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env e adicione sua GOOGLE_API_KEY
# No Windows, use: copy .env.example .env
```

Edite o arquivo `.env`:

```env
GOOGLE_API_KEY=sua-chave-api-aqui
GEMINI_MODEL=gemini-2.5-flash-lite
FLASK_DEBUG=True
FLASK_ENV=development
```

### 4. Execute a aplicação

```bash
flask --app app.app run
```

Acesse: **http://localhost:5000**

-----

## Como Usar

1.  **Preencha o formulário** com o assunto e/ou corpo do email
2.  **Anexe arquivos** (opcional) - TXT ou PDF
3.  **Clique em "Analisar"**
4.  **Receba o resultado** com:
      - Status de segurança (Phishing ou Seguro)
      - Categoria (Produtivo/Improdutivo)
      - Sugestão de resposta personalizada

-----

## Arquitetura

```
  email-verifier/
  ├── .env
  ├── .env.example
  ├── .gitignore
  ├── readme.md
  ├── requirements.txt
  ├── app/
  │   ├── app.py
  │   ├── services/
  │   │   ├── init.py
  │   │   ├── email_analyzer.py
  │   │   └── file_processor.py
  │   ├── static/
  │   │   ├── css/
  │   │   │   └── style.css
  │   │   └── js/
  │   │       └── script.js
  │   └── templates/
  │       └── index.html
  └── config/
      ├── init.py
      └── settings.py
```

