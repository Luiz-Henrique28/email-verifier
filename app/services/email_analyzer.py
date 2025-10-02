import google.generativeai as genai
import json
from config.settings import GOOGLE_API_KEY, GEMINI_MODEL

genai.configure(api_key=GOOGLE_API_KEY)

def analyze_email(email_data):
    prompt = _build_prompt(email_data)

    model = genai.GenerativeModel(
        model_name=GEMINI_MODEL,
        generation_config=_get_response_config()
    )

    response = model.generate_content(prompt)

    response_text = response.candidates[0].content.parts[0].text
    return json.loads(response_text)


def _build_prompt(email_data):
    return f"""
    Você é um assistente especializado em análise de e-mails para um setor financeiro. Sua tarefa é analisar o conteúdo de um e-mail para classificá-lo, detectar phishing e sugerir uma resposta.

    Instruções para a análise:
    1.  **Prioridade do Conteúdo:** O corpo do e-mail e os anexos são a fonte principal de informação. O assunto é um guia, mas o conteúdo é a verdade.
    2.  **Classificação:** Classifique o e-mail em uma de duas categorias:
        * **Produtivo:** Classifique o e-mail como **Produtivo** apenas se ele **requer uma ação ou resposta específica dentro do escopo das atividades financeiras** (ex.: solicitações de suporte técnico, atualização sobre casos em aberto, dúvidas sobre o sistema) **e o seu conteúdo for coerente com o assunto e o conteúdo dos anexos**.
        * **Improdutivo:** Classifique o e-mail como **Improdutivo** se ele **não necessitar de uma ação imediata** (ex.: mensagens de felicitações, agradecimentos) ou se houver grandes inconsistências entre o assunto, corpo e anexos.
    3.  **Detecção de Phishing:** Avalie a mensagem como um todo. Use o assunto e o corpo para determinar se há sinais de phishing (ex: solicitações urgentes de dados pessoais, links suspeitos, erros de gramática ou incoerências).
    4.  **Sugestão de Resposta:** Crie uma resposta automática sugerida adequada com base na categoria e no teor geral da mensagem, **formulando-a como se estivesse respondendo ao remetente do e-mail**.

    Responda **APENAS** com um objeto JSON. As chaves devem ser:
    * `category`: ("Produtivo" ou "Improdutivo").
    * `response`: (String com a resposta sugerida).
    * `is_phishing`: (Booleano `true` ou `false`).

    E-mail a ser analisado:
    {email_data}
    """

def _get_response_config():
    return {
        "response_mime_type": "application/json",
        "response_schema": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "enum": ["Produtivo", "Improdutivo"]
                },
                "suggestion": {
                    "type": "string"
                },
                "is_phishing": {
                    "type": "boolean"
                }
            },
            "required": ["category", "suggestion", "is_phishing"]
        }
    }
