from flask import Flask, render_template, request, jsonify
from config.settings import DEBUG, validate
from app.services.file_processor import process_files
from app.services.email_analyzer import analyze_email

validate()

app = Flask(__name__)

@app.get('/')
def home():
    return render_template('index.html')

@app.post('/api/analyze-email')
def analyze_email_route():

    email_subject = request.form.get('email_subject')
    email_text = request.form.get('email_text')
    email_files = request.files.getlist('email_files')

    try:
        content_files = process_files(email_files) if email_files else ""

        email_data = ""
        if email_subject:
            email_data += f'Assunto: {email_subject}\n'
        if email_text:
            email_data += f'Corpo: {email_text}\n'
        if content_files:
            email_data += f'Anexos: {content_files}\n'

        ai_response = analyze_email(email_data)

        return jsonify({
            'subject': email_subject,
            'email_body': email_text[:200] + '...' if email_text and len(email_text) > 200 else email_text,
            'category': ai_response['category'].lower(),
            'suggestion': ai_response['suggestion'],
            'is_phishing': ai_response['is_phishing'],
        })
    except ValueError as e:
        
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        
        return jsonify({'error': 'Erro ao processar solicitação'}), 500

if __name__ == '__main__':
    app.run(debug=DEBUG) 