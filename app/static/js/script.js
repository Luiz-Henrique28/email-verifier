
document.addEventListener('DOMContentLoaded', function() {

    const emailSubject = document.getElementById('email-subject');
    const emailText = document.getElementById('email-text');
    const emailFile = document.getElementById('email-file');

    const submitButton = document.getElementById('submit-button');
    
    const fileList = document.getElementById('file-list');
    const resultsContainer = document.getElementById('results-container');

    let selectedFiles = [];

    emailFile.addEventListener('change', function() {
        selectedFiles.push(...Array.from(this.files));
        updateFileList();
    });

    function updateFileList() {
        if (selectedFiles.length === 0) {
            fileList.innerHTML = '';
            return;
        }

        let html = '';
        selectedFiles.forEach((file, index) => {
            const sizeKB = (file.size / 1024).toFixed(1);
            html += `
                <div class="file-item d-flex align-items-center justify-content-between p-2 rounded mb-1">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-file-earmark-text me-2 text-secondary"></i>
                        <div>
                            <div class="file-name">${file.name}</div>
                            <small class="text-muted">${sizeKB} KB</small>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-link text-danger p-0" onclick="removeFile(${index})">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            `;
        });
        fileList.innerHTML = html;
    }

    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFileList();

        if (selectedFiles.length === 0) {
            emailFile.value = '';
        }
    };

    function changeState(state) {
        const states = ['waiting-state', 'loading-state', 'error-state', 'success-state'];
        states.forEach(s => {
            const element = document.getElementById(s);
            if (element) {
                element.classList.toggle('d-none', s !== state);
            }
        });
    }

    submitButton.addEventListener('click', async function() {
        const text = emailText.value.trim();

        if (!text && selectedFiles.length === 0) {
            alert('Por favor, insira um texto ou selecione um arquivo.');
            return;
        }

        //resultsContainer.style.display = 'block';
        changeState('loading-state');

        try {
            const formData = new FormData();
            if (text) {
                formData.append('email_text', text);
            }

            const subject = emailSubject.value.trim();
            if (subject) {
                formData.append('email_subject', subject);
            }

            selectedFiles.forEach(file => {
                formData.append('email_files', file);
            });

            const response = await fetch('/api/analyze-email', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                displayResults(result);
            } else {
                showError(result.error || 'Erro ao analisar o e-mail');
            }
        } catch (error) {
            showError(`Erro na conexão: ${error.message}`);
        }
    });

    function displayResults(result) {
        changeState('success-state');
        clearFields()

        const phishingAlert = document.getElementById('phishing-alert');
        const safeAlert = document.getElementById('safe-alert');
        const analysisContent = document.getElementById('analysis-content');

        if (result.is_phishing) {
            phishingAlert.classList.remove('d-none');
            safeAlert.classList.add('d-none');
        } else {
            safeAlert.classList.remove('d-none');
            phishingAlert.classList.add('d-none');
        }

        let htmlContent = '';

        if (result.subject) {
            htmlContent += `<div class="mb-3">
                <strong>Assunto:</strong> ${result.subject}
            </div>`;
        }

        if (result.category) {
            const categoryClass = result.category === 'produtivo' ? 'text-success' : 'text-warning';
            htmlContent += `<div class="mb-3">
                <strong>Categoria:</strong>
                <span class="${categoryClass}">${result.category}</span>
            </div>`;
        }

        if (result.suggestion) {
            htmlContent += `<div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <strong>Sugestão de Resposta:</strong>
                    <button class="btn btn-sm btn-outline-secondary" onclick="copySuggestion(event)" title="Copiar resposta">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <div id="suggestion-text" class="mt-1 p-2 bg-info bg-opacity-10 rounded">${result.suggestion}</div>
            </div>`;
        }

        if (result.email_body) {
            htmlContent += `<div class="mb-3">
                <div class='d-inline-block' onclick="toggleEmailBody()">
                    Ver corpo do e-mail <span id='toggle-icon'><i class="bi bi-caret-right-fill"></i> </span>
                </div>
                <div id="email-body-content" class="mt-2 p-2 bg-white rounded" style="display: none;">
                    ${result.email_body}
                </div>
            </div>`;
        }

        analysisContent.innerHTML = htmlContent ? htmlContent : '<p class="text-muted">Não foi possível exibir os detalhes da análise.</p>';
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showError(message) {
        changeState('error-state');
        document.getElementById('error-message').textContent = message;
    }

    window.toggleEmailBody = function() {
        const bodyContent = document.getElementById('email-body-content');
        const toggleIcon = document.getElementById('toggle-icon');

        if (bodyContent.style.display === 'none') {
            bodyContent.style.display = 'block';
            toggleIcon.innerHTML = '<i class="bi bi-caret-down-fill"></i>';
        } else {
            bodyContent.style.display = 'none';
            toggleIcon.innerHTML = '<i class="bi bi-caret-right-fill"></i>';
        }
    };

    function clearFields() {
        emailSubject.value = ''
        emailText.value = ''
        fileList.innerHTML = ''
    }

    window.copySuggestion = function(event) {
        const suggestionText = document.getElementById('suggestion-text');
        if (!suggestionText) return;

        const button = event.currentTarget || event.target.closest('button');
        const text = suggestionText.innerText || suggestionText.textContent;

        if (button.classList.contains('btn-success')) return;

        navigator.clipboard.writeText(text).then(function() {
            
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="bi bi-check2"></i>';
            button.classList.remove('btn-outline-secondary');
            button.classList.add('btn-success');

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('btn-success');
                button.classList.add('btn-outline-secondary');
            }, 2000);
        }).catch(function(err) {
            console.error('Erro ao copiar texto: ', err);
            alert('Erro ao copiar texto para a área de transferência');
        });
    };
});