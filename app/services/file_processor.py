from pypdf import PdfReader

def process_files(files):

    if files and len(files) > 5:
        raise ValueError("Máximo 5 arquivos por vez")

    content_files = []

    for file in files:
        if file.filename.endswith('.txt'):
            content = _process_txt_file(file)
            content_files.append(f'Arquivo TXT ({file.filename}): {content}')

        elif file.filename.endswith('.pdf'):
            content = _process_pdf_file(file)
            content_files.append(f'Arquivo PDF ({file.filename}): {content}')

    return content_files

def _process_txt_file(file):
    return file.read().decode("utf-8")

def _process_pdf_file(file, max_pages=5):
    reader = PdfReader(file)
    pdf_content = ""

    for _, page in enumerate(reader.pages[:max_pages]):
        pdf_content += page.extract_text()

    return pdf_content
