document.addEventListener('DOMContentLoaded', () => {
    // --- API KEYS (REMOVIDAS PARA SEGURANÇA) ---
    const API_KEYS = {
        OPENAI: "",
        ANTHROPIC: "",
        ELEVENLABS: "",
        GEMINI: ""
    };

    // --- DOM Elements ---
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings');
    const saveKeysBtn = document.getElementById('save-keys');
    const downloadChatBtn = document.getElementById('download-chat');

    // Inputs (Keys removed from UI)
    const tempSlider = document.getElementById('temp-slider');
    const customPromptInput = document.getElementById('custom-prompt');

    // Chat UI
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    // const modelToggle = document.getElementById('model-toggle'); // Removed
    const modelNameDisplay = document.getElementById('current-model-name');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Sidebar UI
    const sidebar = document.getElementById('chat-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const historyList = document.getElementById('history-list');
    const newChatBtn = document.getElementById('new-chat-btn');

    const voiceBtn = document.getElementById('voice-btn');
    const recordingFeedback = document.getElementById('recording-feedback');
    const recordingTimer = recordingFeedback.querySelector('.timer');
    // elevenlabsInput removed
    const voiceMenu = document.getElementById('voice-menu');

    // --- State ---
    let state = {
        model: 'gemini', // 'gemini' only
        mode: 'livre', // 'livre' | 'apostila'
        fileContent: '',
        isProcessing: false,
        // Settings
        temperature: 0.7,
        customPrompt: '',
        // History
        currentSessionId: null,
        sessions: [],
        // Voice State
        isRecording: false,
        voiceId: localStorage.getItem('selected_voice_id') || 'pFZP5JQG7iQjIQuC4Bku',
        elevenlabsKey: localStorage.getItem('elevenlabs_key') || '',
        selectedLanguage: localStorage.getItem('selected_language') || 'pt',
        interfaceLanguage: localStorage.getItem('interface_language') || 'pt',
        voiceLanguage: localStorage.getItem('voice_language') || 'pt'
    };

    // All voices available regardless of interface language
    const availableVoices = [
        { name: "Lily", id: "pFZP5JQG7iQjIQuC4Bku", gender: "feminino", lang: "pt", descriptionPT: "Voz feminina clara e natural (EN ou PT)", descriptionEN: "Clear and natural female voice (EN or PT)" },
        { name: "Charlie", id: "IKne3meq5aSn9XLyUdCD", gender: "masculino", lang: "pt", descriptionPT: "Voz masculina profissional (EN ou PT)", descriptionEN: "Professional male voice (EN or PT)" },
        { name: "Sarah", id: "EXAVITQu4vr4xnSDxMaL", gender: "feminino", lang: "en", descriptionPT: "Voz feminina clara e calorosa (EN ou PT)", descriptionEN: "Clear and warm female voice (EN or PT)" },
        { name: "Brian", id: "nPczCjzI2devNBz1zQrb", gender: "masculino", lang: "en", descriptionPT: "Voz masculina profissional (EN ou PT)", descriptionEN: "Professional male voice (EN or PT)" }
    ];

    // --- Translations ---
    const translations = {
        pt: {
            header: {
                title: "DidaxIA",
                subtitle: "IA"
            },
            tabs: {
                livre: "Pesquisa Livre",
                apostila: "Foco Apostila"
            },
            sidebar: {
                history: "Histórico",
                newChat: "Novo",
                noConversations: "Nenhuma conversa salva",
                deleteConfirm: "Tem certeza que deseja excluir esta conversa?"
            },
            chat: {
                welcome: "Olá!",
                welcomeSubtitle: "Como posso te ajudar hoje?",
                inputPlaceholder: "Digite sua pergunta ou comando...",
                listening: "Ouvindo...",
                newConversation: "Nova conversa iniciada. Modo:",
                freeSearch: "Pesquisa Livre",
                focusMaterial: "Foco Apostila",
                modeChanged: "Modo alterado para:"
            },
            settings: {
                title: "Configurações de API",
                apiNote: "As chaves de API estão configuradas diretamente no código",
                voice: "Voz do Assistente",
                creativity: "Criatividade (Temperatura)",
                precise: "Preciso",
                creative: "Criativo",
                fontSize: "Tamanho da Fonte",
                systemPrompt: "Prompt do Sistema (Opcional)",
                systemPromptPlaceholder: "Personalize a personalidade do DidaxIA...",
                saveAll: "Salvar Tudo",
                downloadChat: "Baixar Chat",
                settingsSaved: "Configurações salvas!",
                status: "Apostila Integrada"
            },
            voices: {
                lily: "Voz feminina clara e natural",
                charlie: "Voz masculina profissional"
            },
            errors: {
                apostilaNotLoaded: "⚠️ A apostila interna não foi carregada. Verifique o arquivo apostila.js.",
                apiError: "❌ Erro: {message}. Verifique suas chaves de API.",
                noDownload: "Nada para baixar nesta conversa.",
                voiceNotSupported: "Seu navegador não suporta reconhecimento de voz.",
                elevenLabsKeyMissing: "Configure sua chave da ElevenLabs no código (API_KEYS) para ouvir o áudio.",
                audioError: "Erro ao gerar áudio:"
            }
        },
        en: {
            header: {
                title: "DidaxIA",
                subtitle: "AI"
            },
            tabs: {
                livre: "Free Search",
                apostila: "Focus Material"
            },
            sidebar: {
                history: "History",
                newChat: "New",
                noConversations: "No saved conversations",
                deleteConfirm: "Are you sure you want to delete this conversation?"
            },
            chat: {
                welcome: "Hello!",
                welcomeSubtitle: "How can I help you today?",
                inputPlaceholder: "Type your question or command...",
                listening: "Listening...",
                newConversation: "New conversation started. Mode:",
                freeSearch: "Free Search",
                focusMaterial: "Focus Material",
                modeChanged: "Mode changed to:"
            },
            settings: {
                title: "API Settings",
                apiNote: "API keys are configured directly in the code",
                voice: "Assistant Voice",
                creativity: "Creativity (Temperature)",
                precise: "Precise",
                creative: "Creative",
                fontSize: "Font Size",
                systemPrompt: "System Prompt (Optional)",
                systemPromptPlaceholder: "Customize DidaxIA's personality...",
                saveAll: "Save All",
                downloadChat: "Download Chat",
                settingsSaved: "Settings saved!",
                status: "Integrated Material"
            },
            voices: {
                sarah: "Clear and warm female voice",
                brian: "Professional male voice"
            },
            errors: {
                apostilaNotLoaded: "⚠️ Internal material not loaded. Check apostila.js file.",
                apiError: "❌ Error: {message}. Check your API keys.",
                noDownload: "Nothing to download in this conversation.",
                voiceNotSupported: "Your browser does not support voice recognition.",
                elevenLabsKeyMissing: "Configure your ElevenLabs key in the code (API_KEYS) to hear audio.",
                audioError: "Error generating audio:"
            }
        }
    };

    // --- Prompts ---
    const PROMPTS = {
        LIVRE: `Você é o DidaxIA, um assistente simpático, direto e objetivo.
               Responda com gentileza, mas de forma concisa e sem enrolação. 
               Vá direto ao ponto, evitando auto-apresentações ou saudações repetitivas.
               Mantenha um tom amigável e prestativo.`,

        APOSTILA: `Você é o DidaxIA, seu assistente para este material.
                  1. Seja gentil e direto ao usar o contexto abaixo.
                  2. Evite rodeios, mas mantenha a simpatia na resposta.
                  3. Responda apenas o que foi perguntado de forma amigável.`
    };

    // --- Initialization ---
    try {
        init();
    } catch (e) {
        console.error("Critical Init Error:", e);
        alert("Erro ao iniciar aplicação: " + e.message);
    }

    function init() {
        loadSettings();
        loadHistory();
        setupEventListeners();
        setupParallax();
        setupVoiceLogic();
        setupSettingsLogic();

        // Load embedded apostila content
        if (typeof APOSTILA_CONTENT !== 'undefined') {
            state.fileContent = APOSTILA_CONTENT;
            console.log("Apostila carregada internamente.");
        } else {
            console.warn("Script 'apostila.js' não encontrado ou vazio.");
        }

        if (state.sessions.length === 0) {
            startNewChat();
        } else {
            // Load the most recent session
            const mostRecent = state.sessions[0];
            loadSession(mostRecent.id);
        }

        // Initialize language
        updateLanguage(state.selectedLanguage);
    }

    function setupEventListeners() {
        // Sidebar
        // Sidebar Toggle Logic
        sidebarToggle.addEventListener('click', () => {
            if (window.innerWidth > 768) {
                // Desktop: Toggle minimize
                sidebar.classList.toggle('minimized');
                sidebarToggle.classList.toggle('active'); // Rotates icon

                // Optional: Change header alignment when minimized if needed via JS or CSS
            } else {
                // Mobile: Toggle off-canvas
                sidebar.classList.toggle('open');
                sidebarToggle.classList.toggle('active');
            }
        });

        newChatBtn.addEventListener('click', () => {
            startNewChat();
            if (window.innerWidth <= 768) sidebar.classList.remove('open');
        });

        // Settings
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsModal.classList.remove('hidden');
            settingsModal.style.display = 'flex';
        });

        // Sidebar Menu Items Logic
        // Map menu items index to modal IDs: 0 -> account, 1 -> about, 2 -> help
        const menuItems = document.querySelectorAll('.menu-item');
        const modals = {
            'Minha Conta': 'account-modal',
            'Sobre o DidaxIA': 'about-modal',
            'Ajuda': 'help-modal'
        };

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.querySelector('span').textContent;
                const modalId = modals[text];

                if (modalId) {
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.classList.remove('hidden');
                        modal.style.display = 'flex'; // Ensure flex for centering
                    }
                }

                // Close sidebar on mobile after click
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    sidebarToggle.classList.remove('active');
                    const icon = sidebarToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('ph-x');
                        icon.classList.add('ph-list');
                    }
                }
            });
        });

        // Close logic for ALL modals (Settings + New ones)
        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.add('hidden');
                    setTimeout(() => {
                        modal.style.display = ''; // Reset display after fade out
                    }, 300); // Match CSS transition
                }
            });
        });

        // Close setting modal specifically (kept for compatibility with existing button id)
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                settingsModal.classList.add('hidden');
            });
        }

        // Close on click outside for all modals
        window.addEventListener('click', (e) => {
            document.querySelectorAll('.modal').forEach(modal => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    modal.style.display = '';
                }
            });
        });

        // Language toggle in settings
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                langBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const selectedLang = btn.dataset.lang;
                state.interfaceLanguage = selectedLang;
                localStorage.setItem('interface_language', selectedLang);
                updateLanguage(selectedLang);
            });

            // Set initial active state
            if (btn.dataset.lang === state.interfaceLanguage) {
                btn.classList.add('active');
            }
        });

        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
            settingsModal.style.display = '';
        });
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.add('hidden');
                settingsModal.style.display = '';
            }
        });

        saveKeysBtn.addEventListener('click', saveSettings);
        downloadChatBtn.addEventListener('click', downloadChat);

        // Chat interactions
        sendBtn.addEventListener('click', handleSend);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });

        // Model toggle removed
        /*
        modelToggle.addEventListener('change', () => {
            state.model = modelToggle.checked ? 'claude' : 'gpt';
            updateModelUI();
        });
        */

        // Tabs
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.mode = btn.dataset.mode;
                const modeName = state.mode === 'livre' ? 'Pesquisa Livre' : 'Foco Apostila';
                addSystemMessage(`<em>Modo alterado para: <strong>${modeName}</strong></em>`);
            });
        });

        // Font Size Global Handler
        window.setFontSize = (size) => {
            const root = document.documentElement;
            if (size === 'small') root.style.fontSize = '14px';
            if (size === 'medium') root.style.fontSize = '16px';
            if (size === 'large') root.style.fontSize = '18px';
            localStorage.setItem('font_size', size);
        };
    }

    function setupSettingsLogic() {
        // Toggles e testes removidos pois as chaves agora são hardcoded no topo do arquivo.
    }

    // --- API Test Functions (Helper for debugging if needed, but not attached to UI) ---
    async function testOpenAI(key) {
        try {
            const res = await fetch('https://api.openai.com/v1/models', {
                headers: { 'Authorization': `Bearer ${key}` }
            });
            return res.ok;
        } catch { return false; }
    }

    async function testAnthropic(key) {
        try {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': key,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                    'dangerously-allow-browser': 'true'
                },
                body: JSON.stringify({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 1,
                    messages: [{ role: "user", content: "Hi" }]
                })
            });
            return res.ok;
        } catch { return false; }
    }

    async function testElevenLabs(key) {
        try {
            const res = await fetch('https://api.elevenlabs.io/v1/voices', {
                headers: { 'xi-api-key': key }
            });
            return res.ok;
        } catch { return false; }
    }

    // --- Logic: Settings & History ---

    function loadSettings() {
        state.temperature = parseFloat(localStorage.getItem('temperature') || '0.7');
        if (tempSlider) tempSlider.value = state.temperature;

        state.customPrompt = localStorage.getItem('custom_prompt') || '';
        if (customPromptInput) customPromptInput.value = state.customPrompt;

        const fontSize = localStorage.getItem('font_size') || 'medium';
        if (window.setFontSize) window.setFontSize(fontSize);

        renderVoiceCards();
    }

    function saveSettings() {
        state.temperature = parseFloat(tempSlider.value);
        localStorage.setItem('temperature', state.temperature);

        state.customPrompt = customPromptInput.value.trim();
        localStorage.setItem('custom_prompt', state.customPrompt);

        alert('Configurações salvas!');
        settingsModal.classList.add('hidden');
    }

    // ... (History functions unchanged) ...

    function loadHistory() {
        const stored = localStorage.getItem('chat_sessions');
        if (stored) {
            state.sessions = JSON.parse(stored);
        }
        renderHistoryList();
    }

    function saveHistory() {
        localStorage.setItem('chat_sessions', JSON.stringify(state.sessions));
        renderHistoryList();
    }

    function renderHistoryList() {
        historyList.innerHTML = '';
        if (state.sessions.length === 0) {
            historyList.innerHTML = '<div class="history-placeholder">Nenhuma conversa salva</div>';
            return;
        }

        state.sessions.sort((a, b) => b.timestamp - a.timestamp);

        state.sessions.forEach(session => {
            const div = document.createElement('div');
            div.className = `history-item ${session.id === state.currentSessionId ? 'active' : ''}`;

            // Icon for minimized state
            const icon = document.createElement('i');
            icon.className = 'ph ph-chat-circle history-icon';
            div.appendChild(icon);

            const titleSpan = document.createElement('span');
            titleSpan.className = 'history-title';
            titleSpan.textContent = session.title || 'Nova Conversa';
            titleSpan.addEventListener('click', () => loadSession(session.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-chat-btn btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="ph ph-trash"></i>';
            deleteBtn.title = 'Excluir conversa';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSession(session.id);
            });

            div.appendChild(titleSpan);
            div.appendChild(deleteBtn);
            historyList.appendChild(div);
        });
    }

    function deleteSession(id) {
        if (!confirm('Tem certeza que deseja excluir esta conversa?')) return;

        state.sessions = state.sessions.filter(s => s.id !== id);
        console.log('Sessões após exclusão:', state.sessions.length);
        saveHistory();
        console.log('LocalStorage atualizado:', localStorage.getItem('chat_sessions'));

        if (state.currentSessionId === id) {
            startNewChat();
        } else {
            renderHistoryList();
        }
    }

    function startNewChat() {
        state.currentSessionId = Date.now().toString();
        const newSession = {
            id: state.currentSessionId,
            title: 'Nova Conversa',
            timestamp: Date.now(),
            messages: []
        };
        state.sessions.unshift(newSession);

        chatContainer.innerHTML = `
        <div class="welcome-message">
            <h2>Olá!</h2>
            <p>Como posso te ajudar hoje?</p>
            <div class="model-badges">
                <span class="badge gemini active" style="background: linear-gradient(135deg, #4285f4, #d96570, #f4b400); color: white; border: none;">Gemini 2.5 Flash</span>
            </div>
        </div>`;

        state.mode = 'livre';
        tabBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === 'livre'));
        addSystemMessage('<em>Nova conversa iniciada. Modo: <strong>Pesquisa Livre</strong></em>');

        // updateModelUI(); // Removed
        saveHistory();
    }

    function loadSession(id) {
        const session = state.sessions.find(s => s.id === id);
        if (!session) return;

        state.currentSessionId = id;
        chatContainer.innerHTML = '';
        session.messages.forEach(msg => {
            addMessageToUI(msg.text, msg.sender);
        });
        renderHistoryList();
    }

    function updateSession(text, sender) {
        const session = state.sessions.find(s => s.id === state.currentSessionId);
        if (session) {
            session.messages.push({ text, sender, timestamp: Date.now() });
            if (session.title === 'Nova Conversa' && sender === 'user') {
                session.title = text.substring(0, 30) + (text.length > 30 ? '...' : '');
            }
            session.timestamp = Date.now();
            saveHistory();
        }
    }

    function downloadChat() {
        const session = state.sessions.find(s => s.id === state.currentSessionId);
        if (!session || session.messages.length === 0) {
            alert('Nada para baixar nesta conversa.');
            return;
        }

        let content = `# DidaxIA Chat - ${session.title}\n\n`;
        session.messages.forEach(msg => {
            const role = msg.sender === 'user' ? 'VOCÊ' : 'ARANDU';
            content += `### ${role}:\n${msg.text}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `arandu-chat-${session.id}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- Core Logic ---

    async function handleSend() {
        if (state.isProcessing) return;
        const text = userInput.value.trim();
        if (!text) return;

        if (state.mode === 'apostila' && !state.fileContent) {
            alert('⚠️ A apostila interna não foi carregada. Verifique o arquivo apostila.js.');
            return;
        }

        addMessageToUI(text, 'user');
        updateSession(text, 'user');

        userInput.value = '';
        state.isProcessing = true;
        setLoading(true);

        try {
            let responseText = '';
            let systemPrompt = state.mode === 'apostila' ? PROMPTS.APOSTILA : PROMPTS.LIVRE;

            // Language preference (softer constraint to allow bilingual)
            const voiceLang = state.voiceLanguage || 'pt';
            if (voiceLang === 'en') {
                systemPrompt += "\n\nPreferred language: ENGLISH. However, if the user speaks or asks to reply in another language, follow their lead.";
            } else {
                systemPrompt += "\n\nIdioma preferencial: PORTUGUÊS. No entanto, se o usuário falar ou pedir para responder em outro idioma (como Inglês), siga a preferência do usuário.";
            }

            if (state.customPrompt && state.mode === 'livre') {
                systemPrompt = state.customPrompt;
                // Re-apply language constraint if custom prompt overwrites
                if (voiceLang === 'en') {
                    systemPrompt += "\n\n(Context: Answer in English)";
                }
            }

            // Always use Gemini
            responseText = await callGemini(text, systemPrompt);

            /*
            if (state.model === 'gpt') {
                responseText = await callOpenAI(text, systemPrompt);
            } else {
                responseText = await callAnthropic(text, systemPrompt);
            }
            */

            addMessageToUI(responseText, 'ai');
            updateSession(responseText, 'ai');

        } catch (error) {
            console.error('API Error:', error);
            const errText = `❌ Erro: ${error.message}. Verifique suas chaves de API.`;
            addMessageToUI(errText, 'ai');
        } finally {
            state.isProcessing = false;
            setLoading(false);
        }
    }

    async function callGemini(userPrompt, systemBase) {
        const url = `/api/chat`;

        let promptText = systemBase;
        if (state.mode === 'apostila' && state.fileContent) {
            promptText += `\n\nCONTEÚDO DA APOSTILA:\n${state.fileContent}`;
        }

        const contents = [];
        const session = state.sessions.find(s => s.id === state.currentSessionId);

        // Add history (last 6 messages)
        if (session && session.messages.length > 0) {
            const history = session.messages.slice(-6);
            history.forEach(msg => {
                contents.push({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                });
            });
        }

        // Add current prompt
        contents.push({
            role: 'user',
            parts: [{ text: promptText + "\n\nPERGUNTA ATUAL: " + userPrompt }]
        });

        const payload = { contents };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error?.message || 'Erro Gemini');
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) throw new Error('Gemini não retornou texto.');

        return generatedText;
    }

    async function callOpenAI(userPrompt, systemBase) {
        const apiKey = API_KEYS.OPENAI;
        if (!apiKey) throw new Error('Chave da OpenAI não configurada no código (API_KEYS)');

        const messages = [{ role: "system", content: systemBase }];

        if (state.mode === 'apostila' && state.fileContent) {
            messages.push({
                role: "system",
                content: `CONTEÚDO DA APOSTILA:\n---\n${state.fileContent}\n---\n`
            });
        }

        const session = state.sessions.find(s => s.id === state.currentSessionId);
        if (session) {
            const historyMsgs = session.messages.slice(0, -1).slice(-4).map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));
            messages.push(...historyMsgs);
        }

        messages.push({ role: "user", content: userPrompt });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: messages,
                temperature: state.temperature
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error?.message || 'Erro OpenAI');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async function callAnthropic(userPrompt, systemBase) {
        const apiKey = API_KEYS.ANTHROPIC;
        if (!apiKey) throw new Error('Chave da Anthropic não configurada no código (API_KEYS)');

        let fullSystem = systemBase;
        if (state.mode === 'apostila' && state.fileContent) {
            fullSystem += `\n\nCONTEÚDO DA APOSTILA:\n${state.fileContent}`;
        }

        let messages = [];
        const session = state.sessions.find(s => s.id === state.currentSessionId);
        if (session) {
            const historyMsgs = session.messages.slice(0, -1).slice(-4).map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));
            messages.push(...historyMsgs);
        }
        messages.push({ role: "user", content: userPrompt });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
                'dangerously-allow-browser': 'true'
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                system: fullSystem,
                messages: messages,
                temperature: state.temperature
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error?.message || 'Erro Anthropic');
        }

        const data = await response.json();
        return data.content[0].text;
    }

    function addMessageToUI(text, sender) {
        // ... (unchanged)
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);

        let formatted = text;
        if (sender !== 'system') {
            formatted = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`(.*?)`/g, '<code>$1</code>')
                .replace(/\n/g, '<br>');
        }

        if (sender === 'ai' || sender === 'assistant') {
            formatted += ` <i class="ph ph-speaker-high playback-cue" title="Ouvir"></i>`;
        }

        msgDiv.innerHTML = formatted;

        if (sender === 'ai' || sender === 'assistant') {
            const icon = msgDiv.querySelector('.playback-cue');
            if (icon) {
                icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    speak(text, icon);
                });
            }
        }

        chatContainer.appendChild(msgDiv);
        scrollChat();
    }

    // ... (Helpers unchanged) ...
    function addSystemMessage(html) {
        const msgDiv = document.createElement('div');
        msgDiv.style.color = 'var(--text-secondary)';
        msgDiv.style.fontSize = '0.8rem';
        msgDiv.style.textAlign = 'center';
        msgDiv.style.margin = '0.5rem 0';
        msgDiv.innerHTML = html;
        chatContainer.appendChild(msgDiv);
        scrollChat();
    }

    function scrollChat() {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }

    function setLoading(isLoading) {
        const icon = sendBtn.querySelector('i');
        if (isLoading) {
            sendBtn.disabled = true;
            icon.classList.remove('ph-paper-plane-right');
            icon.classList.add('ph-spinner', 'ph-spin');
        } else {
            sendBtn.disabled = false;
            icon.classList.remove('ph-spinner', 'ph-spin');
            icon.classList.add('ph-paper-plane-right');
        }
    }

    // updateModelUI removed

    // --- Language Update Function ---
    function updateLanguage(lang) {
        const t = translations[lang];

        // Update header
        const headerTitle = document.querySelector('.logo-area h1 .highlight');
        if (headerTitle) headerTitle.textContent = t.header.subtitle;

        // Update tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const mode = btn.dataset.mode;
            btn.innerHTML = `<i class="${btn.querySelector('i').className}"></i> ${t.tabs[mode]}`;
        });

        // Update sidebar
        const sidebarHeader = document.querySelector('.sidebar-header h3');
        if (sidebarHeader) sidebarHeader.textContent = t.sidebar.history;

        const newChatBtn = document.querySelector('#new-chat-btn');
        if (newChatBtn) {
            const icon = newChatBtn.querySelector('i');
            newChatBtn.innerHTML = `${icon.outerHTML} ${t.sidebar.newChat}`;
        }

        const historyPlaceholder = document.querySelector('.history-placeholder');
        if (historyPlaceholder) historyPlaceholder.textContent = t.sidebar.noConversations;

        // Update input placeholder
        if (userInput) userInput.placeholder = t.chat.inputPlaceholder;

        // Update settings modal
        const settingsTitle = document.querySelector('.modal-header h3');
        if (settingsTitle) settingsTitle.textContent = t.settings.title;

        // Update all settings labels
        const apiNote = document.querySelector('.api-section p code');
        if (apiNote && apiNote.parentElement) {
            apiNote.parentElement.innerHTML = apiNote.parentElement.innerHTML.replace(/As chaves de API estão configuradas diretamente no código|API keys are configured directly in the code/, t.settings.apiNote);
        }

        // Update buttons
        const saveBtn = document.querySelector('#save-keys');
        if (saveBtn) saveBtn.textContent = t.settings.saveAll;

        const downloadBtn = document.querySelector('#download-chat');
        if (downloadBtn) {
            const icon = downloadBtn.querySelector('i');
            downloadBtn.innerHTML = `${icon.outerHTML} ${t.settings.downloadChat}`;
        }

        // Update range labels
        const rangeLabels = document.querySelectorAll('.range-container span');
        if (rangeLabels.length >= 2) {
            rangeLabels[0].textContent = t.settings.precise;
            rangeLabels[1].textContent = t.settings.creative;
        }

        // Update custom prompt placeholder
        const customPrompt = document.querySelector('#custom-prompt');
        if (customPrompt) customPrompt.placeholder = t.settings.systemPromptPlaceholder;

        // Update welcome message
        updateWelcomeMessage(lang);

        // Update voice descriptions
        renderVoiceCards();

        // Store language preference
        localStorage.setItem('interface_language', lang);
        state.interfaceLanguage = lang;
    }

    function updateWelcomeMessage(lang) {
        const t = translations[lang];
        const welcome = document.querySelector('.welcome-message');
        if (welcome) {
            const modelBadges = welcome.querySelector('.model-badges');
            welcome.innerHTML = `
                <h2>${t.chat.welcome}</h2>
                <p>${t.chat.welcomeSubtitle}</p>
                ${modelBadges ? modelBadges.outerHTML : ''}
            `;
        }
    }

    // --- Voice Logic (STT & TTS) ---

    let recognition;
    let recTimerInterval;
    let recStartTime;

    function setupVoiceLogic() {
        renderVoiceCards();

        // Voice language toggle
        const voiceLangBtns = document.querySelectorAll('.voice-lang-btn');
        voiceLangBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                voiceLangBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.voiceLanguage = btn.dataset.voiceLang;
                localStorage.setItem('voice_language', state.voiceLanguage);

                // Re-render cards to update colors
                renderVoiceCards();
            });

            // Set initial active state
            if (btn.dataset.voiceLang === state.voiceLanguage) {
                btn.classList.add('active');
            }
        });

        if (voiceBtn) {
            voiceBtn.onclick = (e) => { // Use onclick direct assignment to prevent duplicate listeners
                e.preventDefault(); // Prevent focus loss or other side effects
                e.stopPropagation();

                if (state.isRecording) {
                    stopRecording();
                } else {
                    startRecording();
                }
            };
        }
    }

    // ... (Voice helpers unchanged) ...

    function renderVoiceCards() {
        const container = document.getElementById('voice-cards-container');
        if (!container) return;

        // Render ALL voice cards (independent of language toggle)
        container.innerHTML = '';
        const interfaceLang = state.interfaceLanguage || 'pt';
        const voiceLang = state.voiceLanguage || 'pt';

        availableVoices.forEach(voice => {
            const card = document.createElement('div');
            // Add language-specific class for visual feedback
            const langClass = `voice-lang-${voiceLang}`;
            card.className = `voice-card ${langClass} ${voice.id === state.voiceId ? 'active' : ''}`;

            const genderIcon = voice.gender === 'feminino' ? 'ph-user' : 'ph-user-circle';
            const description = interfaceLang === 'pt' ? voice.descriptionPT : voice.descriptionEN;

            card.innerHTML = `
                <div class="voice-card-header">
                    <i class="ph ${genderIcon}"></i>
                    <span class="voice-name">${voice.name}</span>
                    ${voice.id === state.voiceId ? '<i class="ph ph-check-circle active-indicator"></i>' : ''}
                </div>
                <p class="voice-description">${description}</p>
            `;

            card.addEventListener('click', () => {
                state.voiceId = voice.id;
                localStorage.setItem('selected_voice_id', state.voiceId);
                renderVoiceCards();
            });

            container.appendChild(card);
        });
    }

    function startRecording() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Seu navegador não suporta reconhecimento de voz.");
            return;
        }

        if (!recognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                state.isRecording = true;
                voiceBtn.classList.add('recording');
                recordingFeedback.classList.remove('hidden');
                recStartTime = Date.now();
                recordingTimer.textContent = "00:00";
                recTimerInterval = setInterval(() => {
                    const diff = Math.floor((Date.now() - recStartTime) / 1000);
                    const m = Math.floor(diff / 60).toString().padStart(2, '0');
                    const s = (diff % 60).toString().padStart(2, '0');
                    recordingTimer.textContent = `${m}:${s}`;
                }, 1000);
                userInput.placeholder = "Ouvindo...";
            };

            recognition.onend = () => {
                stopRecording();
            };

            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                // Show what's being spoken in real-time
                if (interimTranscript) {
                    userInput.value = interimTranscript;
                }
                if (finalTranscript) {
                    userInput.value = finalTranscript;
                    // Auto-send removed to allow user review
                    // handleSend(); 
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech Error:", event.error);
                let errorMsg = "Erro no reconhecimento de voz: ";

                switch (event.error) {
                    case 'not-allowed':
                        errorMsg += "Permissão negada. Clique no ícone de cadeado na barra de endereço e permita o uso do microfone.";
                        break;
                    case 'no-speech':
                        errorMsg += "Nenhuma fala detectada. Tente novamente.";
                        break;
                    case 'audio-capture':
                        errorMsg += "Microfone não encontrado ou não funciona.";
                        break;
                    case 'network':
                        errorMsg += "Erro de rede. Verifique sua conexão.";
                        break;
                    default:
                        errorMsg += event.error;
                }

                alert(errorMsg);
                stopRecording();
            };
        }

        // Update language based on current state before starting
        recognition.lang = state.voiceLanguage === 'en' ? 'en-US' : 'pt-BR';

        try {
            // Prevent double-start
            if (state.isRecording) {
                console.warn("Já está gravando. Parando primeiro.");
                stopRecording();
                return;
            }

            // For Opera GX and other browsers: explicitly request microphone permission first
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        // Stop the stream immediately - we just needed permission
                        stream.getTracks().forEach(track => track.stop());

                        // Add a small delay to ensure the device is "released" before recognition tries to grab it
                        setTimeout(() => {
                            try {
                                if (state.isRecording) return; // Verify state again after delay
                                recognition.start();
                            } catch (err) {
                                if (err.name === 'InvalidStateError' || err.message.includes('already started')) {
                                    console.warn("Reconhecimento já estava ativo. Ignorando.");
                                    return;
                                }
                                throw err;
                            }
                        }, 100);
                    })
                    .catch(error => {
                        console.error("Erro ao solicitar permissão do microfone:", error);
                        alert("Permissão do microfone negada. Por favor, permita o acesso ao microfone nas configurações do navegador.");
                        state.isRecording = false;
                        voiceBtn.classList.remove('recording');
                        recordingFeedback.classList.add('hidden');
                    });
            } else {
                // Fallback for browsers without getUserMedia
                recognition.start();
            }
        } catch (error) {
            // Check specifically for the 'already started' error
            if (error.name === 'InvalidStateError' || error.message.includes('already started')) {
                console.warn("Reconhecimento já estava ativo. Ignorando.");
                return;
            }

            console.error("Erro ao iniciar reconhecimento:", error);
            alert("Erro ao iniciar o microfone. Detalhes: " + error.message);
            stopRecording();
        }
    }

    function stopRecording() {
        if (recognition) {
            try {
                recognition.stop();
            } catch (e) {
                console.warn("Erro ao parar reconhecimento:", e);
            }
        }

        state.isRecording = false;
        voiceBtn.classList.remove('recording');
        recordingFeedback.classList.add('hidden');
        if (recTimerInterval) clearInterval(recTimerInterval);
        userInput.placeholder = "Digite sua pergunta ou comando...";
    }

    async function speak(text, iconElement) {
        if (iconElement) iconElement.classList.add('loading-audio');

        try {
            const response = await fetch(`/api/speak`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    voiceId: state.voiceId
                })
            });

            if (iconElement) iconElement.classList.remove('loading-audio');

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail?.message || "Erro na ElevenLabs");
            }

            const blob = await response.blob();
            const audio = new Audio(URL.createObjectURL(blob));

            if (iconElement) iconElement.classList.add('playing');
            audio.onended = () => {
                if (iconElement) iconElement.classList.remove('playing');
            };

            audio.play();

        } catch (error) {
            console.error("Audio Error:", error);
            alert("Erro ao gerar áudio: " + error.message);
            if (iconElement) iconElement.classList.remove('loading-audio');
        }
    }

    function setupParallax() {
        document.addEventListener('mousemove', (e) => {
            document.querySelectorAll('.shape').forEach(shape => {
                const speed = shape.getAttribute('data-speed');
                const x = (window.innerWidth - e.pageX * speed) / 100;
                const y = (window.innerHeight - e.pageY * speed) / 100;
                shape.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    }
});
