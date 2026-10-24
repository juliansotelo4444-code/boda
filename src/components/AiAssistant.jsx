import React, { useState } from 'react';
import { Sparkles, Send, Copy, Check, MessageSquare, Heart, RefreshCw } from 'lucide-react';

export const AiAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "¡Hola Julián y Yanet! Soy su Asistente de IA para su boda del 8 de Octubre de 2027. Puedo ayudarlos a redactar sus votos matrimoniales, darles ideas de ambientación en tonos borgoña y champagne, sugerir cócteles temáticos o redactar textos emotivos para las tarjetas de invitación. ¿Qué les gustaría explorar hoy?"
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const quickPrompts = [
    {
      title: "💍 Votos de Julián para Yanet",
      prompt: "Redacta un borrador de votos matrimoniales románticos y emotivos que Julián le puede decir a Yanet durante la ceremonia."
    },
    {
      title: "💐 Ambientación Borgoña & Champagne",
      prompt: "Dame 4 ideas creativas para combinar flores borgoña y detalles champagne en los centros de mesa y la entrada del salón."
    },
    {
      title: "🍸 Cócteles de Autor",
      prompt: "Sugiere 3 cócteles de autor con nombres inspirados en el amor para servir durante la recepción de la boda."
    },
    {
      title: "💌 Texto Formal de Invitación",
      prompt: "Escribe 2 opciones de texto formal y elegante para la invitación digital que enviaremos a los familiares y amigos."
    }
  ];

  const generateAiReply = (userText) => {
    const textLower = userText.toLowerCase();

    if (textLower.includes('votos')) {
      return `✨ **Propuesta de Votos Matrimoniales de Julián para Yanet:**\n\n"Yanet, desde el día en que nuestras miradas se cruzaron, supe que mi vida había encontrado su verdadero norte. Hoy, 8 de octubre de 2027, delante de las personas que más amamos, prometo ser tu refugio en los días grises y tu mayor alegría en los días de sol.\nPrometo escucharte siempre con paciencia, abrazar tus sueños como si fueran propios y celebrar cada pequeño triunfo a tu lado. Gracias por elegirme para caminar juntos. Te amo con cada latido y para toda la vida."`;
    }

    if (textLower.includes('flores') || textLower.includes('ambientación') || textLower.includes('borgoña')) {
      return `🍷 **4 Ideas de Ambientación en Borgoña & Champagne:**\n\n1. **Centros de Mesa en Altura:** Candelabros dorados estilo champagne con guirnaldas descendentes de rosas rojas aterciopeladas, dalias borgoña y hojas de eucalipto dólar.\n2. **Mesa Nupcial Editorial:** Mantelería en terciopelo borgoña profundo con bajoplatos de vidrio labrado y ribete de oro viejo. Velas cónicas color champagne encendidas en tubos de cristal.\n3. **Rincón de Firmas & Recuerdos:** Un backdrop con arcos de madera oscura, telas de seda champagne drapeadas y luces cálidas de hadas.\n4. **Camino al Altar:** Alfombra marfil bordeada con pétalos de rosa borgoña y faroles dorados con velas aromatizadas de jazmín.`;
    }

    if (textLower.includes('cóctel') || textLower.includes('trago') || textLower.includes('barra')) {
      return `🥂 **3 Cócteles de Autor para la Fiesta:**\n\n1. **"Amor Eterno" (El Trago de Yanet):** Espumante champagne, cordial de frutos rojos silvestres macerados en vino dulce, un toque de limón y escarchado de oro comestible.\n2. **"Gran Noche" (El Trago de Julián):** Gin artesanal infusionado con moras, tónica botánica, golpe de reducción de Malbec y ramita de romero ahumado.\n3. **"Promesa Dorada" (Mocktail sin alcohol):** Jugo de uva blanca y manzana caramelizada, soda frizzante, rodaja de higo fresco y canela.`;
    }

    return `✨ **Sugerencia Creativa para Julián & Yanet:**\n\nPara su celebración del 8 de octubre de 2027, una excelente forma de sorprender a los invitados es un "Momento de Luces": entregar bengalas champagne sin humo justo antes de que empiece el vals nupcial. Combinará de forma maravillosa con la atmósfera romántica y las fotos del álbum colaborativo quedarán de ensueño.`;
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const newMessages = [...messages, { role: 'user', text: query }];
    setMessages(newMessages);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAiReply(query);
      setMessages([...newMessages, { role: 'assistant', text: response }]);
      setIsTyping(false);
    }, 800);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="ai-module-container animate-fade-in">
      <div className="module-top-bar">
        <div>
          <span className="module-kicker">PLANIFICACIÓN ASISTIDA POR INTELIGENCIA ARTIFICIAL</span>
          <h2 className="module-title font-serif">Asistente Creativo de Bodas</h2>
          <p className="ai-sub">
            Inspiración instantánea para textos, decoración, música y detalles personalizados para la boda de Julián y Yanet.
          </p>
        </div>
      </div>

      {/* SUGERENCIAS RÁPIDAS DE 1 CLIC */}
      <div className="quick-prompts-carousel">
        {quickPrompts.map((item, idx) => (
          <button 
            key={idx} 
            className="quick-card-btn card-luxury"
            onClick={() => handleSend(item.prompt)}
          >
            <strong>{item.title}</strong>
            <p>{item.prompt}</p>
          </button>
        ))}
      </div>

      {/* CHAT CONTAINER */}
      <div className="chat-window card-luxury">
        <div className="chat-messages-scroll">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble-row ${m.role}`}>
              {m.role === 'assistant' && (
                <div className="assistant-avatar">✨</div>
              )}
              <div className="bubble-content">
                <div className="bubble-text">
                  {m.text.split('\n').map((line, i) => (
                    <p key={i} style={{ marginBottom: line ? '0.4rem' : '0.8rem' }}>{line}</p>
                  ))}
                </div>
                {m.role === 'assistant' && (
                  <button 
                    className="copy-bubble-btn"
                    onClick={() => handleCopy(m.text, idx)}
                    title="Copiar texto"
                  >
                    {copiedIndex === idx ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedIndex === idx ? 'Copiado' : 'Copiar'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble-row assistant">
              <div className="assistant-avatar">✨</div>
              <div className="typing-indicator-box">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
        </div>

        {/* INPUT DE ENVÍO */}
        <div className="chat-input-bar">
          <input 
            type="text" 
            placeholder="Escribe tu consulta o pide ideas para la boda..."
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button className="btn-primary" onClick={() => handleSend()}>
            <Send size={16} /> Enviar
          </button>
        </div>
      </div>

      <style>{`
        .ai-module-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem 1.5rem;
        }
        .ai-sub {
          color: var(--text-secondary);
          margin-top: 0.3rem;
          font-size: 0.95rem;
        }
        .quick-prompts-carousel {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .quick-card-btn {
          padding: 1.2rem;
          text-align: left;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-gold-subtle);
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .quick-card-btn:hover {
          border-color: var(--burgundy-700);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .quick-card-btn strong {
          font-size: 0.88rem;
          color: var(--burgundy-700);
          display: block;
          margin-bottom: 0.3rem;
        }
        .quick-card-btn p {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.3;
          margin: 0;
        }
        .chat-window {
          height: 540px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: white;
        }
        .chat-messages-scroll {
          flex: 1;
          padding: 1.8rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .chat-bubble-row {
          display: flex;
          gap: 0.8rem;
          max-width: 82%;
        }
        .chat-bubble-row.user {
          margin-left: auto;
          flex-direction: row-reverse;
        }
        .assistant-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--burgundy-700) 0%, var(--bg-burgundy-900) 100%);
          color: var(--champagne-200);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(103, 0, 26, 0.2);
        }
        .bubble-content {
          background: var(--surface-cream);
          border: 1px solid var(--border-gold-subtle);
          padding: 1.1rem 1.4rem;
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          line-height: 1.5;
        }
        .chat-bubble-row.user .bubble-content {
          background: linear-gradient(135deg, var(--burgundy-700) 0%, var(--burgundy-800) 100%);
          color: var(--champagne-100);
          border-color: var(--burgundy-700);
        }
        .copy-bubble-btn {
          margin-top: 0.6rem;
          background: white;
          border: 1px solid var(--border-gold-subtle);
          color: var(--burgundy-700);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.72rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 600;
        }
        .typing-indicator-box {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.8rem 1.2rem;
          background: var(--surface-cream);
          border-radius: var(--radius-md);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--burgundy-600);
          animation: pulseGold 1.2s infinite;
        }
        .chat-input-bar {
          padding: 1rem 1.5rem;
          background: var(--champagne-50);
          border-top: 1px solid var(--border-gold-subtle);
          display: flex;
          gap: 0.8rem;
        }
        .chat-input-bar input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-gold-subtle);
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          outline: none;
          background: white;
        }

        @media (max-width: 900px) {
          .quick-prompts-carousel {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};
