# DidaxIA AI 🚀

O **DidaxIA** é um assistente de inteligência artificial moderno e responsivo, projetado para facilitar o aprendizado e a produtividade. Ele combina o poder do **Google Gemini 2.5 Flash** para processamento de linguagem e **ElevenLabs** para síntese de voz realista.

## ✨ Funcionalidades

- 🔍 **Pesquisa Livre**: Converse abertamente com a IA para tirar dúvidas, gerar ideias ou criar textos.
- 📚 **Foco Apostila**: Modo especializado onde a IA baseia suas respostas exclusivamente em um material didático interno (`apostila.js`).
- 🎙️ **Voz e Fala**: Suporte total a Text-to-Speech (TTS) com vozes premium da ElevenLabs e reconhecimento de voz (STT).
- 🌍 **Multilíngue**: Interface e suporte completo para Português (BR) e Inglês (US).
- 📱 **Totalmente Responsivo**: Design otimizado para celulares, tablets e desktops (Glassmorphism & Neon).
- 🔒 **Arquitetura Segura**: Proteção de chaves de API através de Vercel Serverless Functions.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Backend / Proxy**: Vercel Serverless Functions (Node.js).
- **Modelos de IA**: Google Gemini 2.5 Flash.
- **Voz**: ElevenLabs API.
- **Ícones**: Phosphor Icons.
- **Design**: Glassmorphism, CSS Grid & Flexbox, Responsividade com `dvh` e `clamp()`.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Uma conta na [Vercel](https://vercel.com/).
- Chaves de API do [Google AI Studio (Gemini)](https://aistudio.google.com/) e [ElevenLabs](https://elevenlabs.io/).

### Configuração Local
1. Clone o repositório:
   ```bash
   git clone https://github.com/Nansinyx26/DidaxIA.git
   ```
2. Para que as funções de API funcionem localmente, você pode usar o `vercel dev`.

### Deploy na Vercel
1. Conecte seu repositório à Vercel.
2. Configure as seguintes **Environment Variables**:
   - `GEMINI_KEY`: Sua chave do Google Gemini.
   - `ELEVENLABS_KEY`: Sua chave da ElevenLabs.
3. Deploy e pronto!

## 🔐 Segurança

O projeto foi configurado para **não expor** chaves de API no navegador. Toda a comunicação sensível passa pelos endpoints `/api/chat` e `/api/speak`, protegendo seus créditos e dados.

---
Desenvolvido com ❤️ por [Nan](https://www.linkedin.com/in/renan-de-oliveira-farias-66a9b412b/)dev.
