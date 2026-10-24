import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle, AlertTriangle, ArrowRight, DollarSign, Users, Sparkles, Heart, Camera } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const Dashboard = ({ setActiveTab, setViewMode }) => {
  const { data, toggleTask } = useWedding();
  const targetDate = new Date(data.couple?.date || '2027-10-09T18:00:00');

  // Cálculo de cuenta regresiva
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cálculos de presupuesto
  const totalBudget = data.couple.totalBudget || 28000;
  const totalAgreed = data.budgetItems.reduce((acc, curr) => acc + (curr.agreed || curr.estimated || 0), 0);
  const totalPaid = data.budgetItems.reduce((acc, curr) => acc + (curr.paid || 0), 0);
  const totalPending = totalAgreed - totalPaid;
  const totalFree = Math.max(0, totalBudget - totalAgreed);

  const paidPercentage = Math.round((totalPaid / totalBudget) * 100);
  const committedPercentage = Math.round((totalAgreed / totalBudget) * 100);

  // Cálculos de Invitados
  const totalGuests = data.guests.reduce((acc, g) => acc + 1 + (g.companions || 0), 0);
  const confirmedGuests = data.guests.filter(g => g.status === 'Confirmado').reduce((acc, g) => acc + 1 + (g.companions || 0), 0);
  const pendingGuests = data.guests.filter(g => g.status === 'Pendiente').reduce((acc, g) => acc + 1 + (g.companions || 0), 0);
  const confirmedPercent = totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 0;

  // Tareas urgentes no completadas
  const urgentTasks = data.tasks.filter(t => !t.completed).slice(0, 4);

  return (
    <div className="dashboard-container animate-fade-in">
      {/* HERO BANNER EDITORIAL */}
      <section className="hero-wedding-card">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-top-badge">
            <span className="sparkle-icon">✨</span>
            <span>BODA JULIÁN &amp; YANET</span>
            <span className="sparkle-icon">✨</span>
          </div>

          <h2 className="hero-headline">
            El camino hacia <span className="highlight-script">Nuestro Gran Día</span>
          </h2>
          <p className="hero-subtext">
            Viernes, 8 de Octubre de 2027 • Palacio San Souci &amp; Jardines de la Reina
          </p>

          {/* CUENTA REGRESIVA ELEGANTE */}
          <div className="countdown-grid">
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.days}</span>
              <span className="countdown-label">DÍAS</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="countdown-label">HORAS</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="countdown-label">MINUTOS</span>
            </div>
            <div className="countdown-box highlight-sec">
              <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="countdown-label">SEGUNDOS</span>
            </div>
          </div>

          <div className="hero-quick-actions">
            <button className="btn-secondary" onClick={() => setViewMode('public')}>
              Ver Web Pública de Invitados
            </button>
            <button className="btn-outline-champagne" onClick={() => setActiveTab('invitations')}>
              Editar Invitación Digital
            </button>
          </div>
        </div>
      </section>

      {/* GRILLA PRINCIPAL DE WIDGETS */}
      <div className="widgets-grid">
        {/* WIDGET 1: RESUMEN GRÁFICO DEL PRESUPUESTO */}
        <div className="card-luxury widget-card">
          <div className="widget-header">
            <div>
              <span className="widget-kicker">CONTROL DE FINANZAS</span>
              <h3 className="widget-title">Presupuesto Consumido vs. Disponible</h3>
            </div>
            <button className="btn-text-link" onClick={() => setActiveTab('finances')}>
              Ver Detalle <ArrowRight size={14} />
            </button>
          </div>

          <div className="budget-visual-wrap">
            {/* SVG DONUT CHART */}
            <div className="donut-chart-container">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle-stroke-free"
                  strokeDasharray={`${committedPercentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle-stroke-paid"
                  strokeDasharray={`${paidPercentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="donut-center-text">
                <span className="donut-percentage">{paidPercentage}%</span>
                <span className="donut-label">Efectivamente Pagado</span>
              </div>
            </div>

            {/* MÉTRICAS FINANCIERAS */}
            <div className="budget-metrics-list">
              <div className="metric-row">
                <span className="metric-dot dot-burgundy"></span>
                <span className="metric-name">Pagado hasta hoy:</span>
                <strong className="metric-value">${totalPaid.toLocaleString()} USD</strong>
              </div>
              <div className="metric-row">
                <span className="metric-dot dot-champagne"></span>
                <span className="metric-name">Comprometido pendiente:</span>
                <strong className="metric-value">${totalPending.toLocaleString()} USD</strong>
              </div>
              <div className="metric-row">
                <span className="metric-dot dot-free"></span>
                <span className="metric-name">Saldo disponible libre:</span>
                <strong className="metric-value font-success">${totalFree.toLocaleString()} USD</strong>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-row total-row">
                <span>Presupuesto Meta:</span>
                <span className="total-badge">${totalBudget.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* WIDGET 2: PRÓXIMAS TAREAS URGENTES */}
        <div className="card-luxury widget-card">
          <div className="widget-header">
            <div>
              <span className="widget-kicker">PLANIFICACIÓN Y TIEMPOS</span>
              <h3 className="widget-title">Próximas Tareas Urgentes</h3>
            </div>
            <button className="btn-text-link" onClick={() => setActiveTab('tasks')}>
              Ver Tablero <ArrowRight size={14} />
            </button>
          </div>

          <div className="tasks-compact-list">
            {urgentTasks.length === 0 ? (
              <div className="empty-tasks-state">
                <CheckCircle size={32} color="var(--burgundy-700)" />
                <p>¡Todo al día! No hay tareas urgentes pendientes.</p>
              </div>
            ) : (
              urgentTasks.map(task => (
                <div key={task.id} className="task-item-compact">
                  <button 
                    className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                    onClick={() => toggleTask(task.id)}
                    title="Marcar como completada"
                  >
                    {task.completed && <CheckCircle size={15} color="#fff" />}
                  </button>
                  <div className="task-info">
                    <span className="task-name">{task.title}</span>
                    <div className="task-meta">
                      <span className={`badge-priority ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <span className="task-assigned">👤 {task.assignedTo}</span>
                      <span className="task-due">📅 {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* WIDGET 3: PULSO DE INVITADOS & RSVP */}
        <div className="card-luxury widget-card">
          <div className="widget-header">
            <div>
              <span className="widget-kicker">ASISTENCIA EN TIEMPO REAL</span>
              <h3 className="widget-title">Invitados y Mesas</h3>
            </div>
            <button className="btn-text-link" onClick={() => setActiveTab('guests')}>
              Diseñador Salón <ArrowRight size={14} />
            </button>
          </div>

          <div className="rsvp-progress-wrapper">
            <div className="rsvp-big-stat">
              <span className="stat-number">{confirmedGuests}</span>
              <span className="stat-sub">de {totalGuests} personas confirmadas ({confirmedPercent}%)</span>
            </div>

            <div className="progress-bar-stacked">
              <div className="bar-confirmed" style={{ width: `${confirmedPercent}%` }} title="Confirmados"></div>
              <div className="bar-pending" style={{ width: `${totalGuests > 0 ? Math.round((pendingGuests / totalGuests) * 100) : 0}%` }} title="Pendientes"></div>
            </div>

            <div className="rsvp-chips">
              <span className="chip confirmed">✓ {confirmedGuests} Confirmados</span>
              <span className="chip pending">⏳ {pendingGuests} Pendientes</span>
              <span className="chip tables-stat">🪑 {data.tables.length} Mesas en Salón</span>
            </div>
          </div>
        </div>

        {/* WIDGET 4: ASISTENTE DE IA DE BODA */}
        <div className="card-luxury widget-card ai-shortcut-card">
          <div className="widget-header">
            <div>
              <span className="widget-kicker font-gold">INTELIGENCIA ARTIFICIAL</span>
              <h3 className="widget-title">Asistente Creativo de Bodas</h3>
            </div>
            <span className="sparkle-ai-badge">✨ Activo</span>
          </div>

          <p className="ai-intro-text">
            Pide al instante sugerencias de ambientación en borgoña, redacción de votos nupciales o diseño del menú gourmet.
          </p>

          <div className="ai-quick-prompts">
            <button className="ai-prompt-pill" onClick={() => setActiveTab('ai')}>
              ✍️ Redactar votos matrimoniales románticos
            </button>
            <button className="ai-prompt-pill" onClick={() => setActiveTab('ai')}>
              🍷 Menú y cócteles con temática Borgoña
            </button>
            <button className="ai-prompt-pill" onClick={() => setActiveTab('ai')}>
              💌 Texto elegante para la invitación
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem 1.5rem;
        }
        .hero-wedding-card {
          position: relative;
          background-image: url('/assets/hero-bg.jpg');
          background-size: cover;
          background-position: center 35%;
          border-radius: var(--radius-lg);
          padding: 3.5rem 2.5rem;
          margin-bottom: 2.5rem;
          color: var(--champagne-100);
          overflow: hidden;
          box-shadow: var(--shadow-burgundy);
          border: 1px solid var(--border-gold-bright);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(46, 5, 16, 0.9) 0%, rgba(103, 0, 26, 0.75) 55%, rgba(30, 22, 24, 0.85) 100%);
          backdrop-filter: blur(2px);
        }
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 860px;
          margin: 0 auto;
        }
        .hero-top-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(245, 230, 200, 0.15);
          border: 1px solid var(--gold-500);
          color: var(--champagne-200);
          padding: 0.4rem 1.2rem;
          border-radius: var(--radius-pill);
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          font-weight: 700;
          margin-bottom: 1.2rem;
        }
        .hero-headline {
          font-size: 3rem;
          font-weight: 700;
          color: #FFF9EE;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .highlight-script {
          font-family: var(--font-display);
          font-style: italic;
          color: var(--champagne-300);
          font-weight: 400;
        }
        .hero-subtext {
          font-size: 1.1rem;
          color: var(--champagne-200);
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
        }
        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.2rem;
          max-width: 650px;
          margin: 0 auto 2.2rem auto;
        }
        .countdown-box {
          background: rgba(25, 4, 9, 0.75);
          border: 1px solid var(--border-gold-subtle);
          padding: 1.2rem 0.5rem;
          border-radius: var(--radius-md);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease;
        }
        .countdown-box:hover {
          transform: translateY(-3px);
          border-color: var(--gold-500);
        }
        .countdown-number {
          display: block;
          font-family: var(--font-serif);
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--champagne-100);
          line-height: 1;
          margin-bottom: 0.35rem;
        }
        .countdown-label {
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          color: var(--champagne-300);
          font-weight: 600;
        }
        .hero-quick-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .btn-outline-champagne {
          background: transparent;
          border: 1px solid var(--champagne-200);
          color: var(--champagne-100);
          padding: 0.75rem 1.4rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.925rem;
          transition: all 0.2s;
        }
        .btn-outline-champagne:hover {
          background: rgba(245, 230, 200, 0.2);
          transform: translateY(-2px);
        }

        /* Widgets Grid */
        .widgets-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.8rem;
        }
        .widget-card {
          padding: 1.8rem;
        }
        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.4rem;
        }
        .widget-kicker {
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          color: var(--burgundy-600);
          font-weight: 700;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.25rem;
        }
        .widget-title {
          font-size: 1.25rem;
          margin: 0;
          color: var(--bg-burgundy-900);
        }
        .btn-text-link {
          background: none;
          color: var(--burgundy-700);
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.5rem;
        }
        .btn-text-link:hover {
          color: var(--burgundy-500);
          transform: translateX(2px);
        }

        /* Budget Visual */
        .budget-visual-wrap {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .donut-chart-container {
          position: relative;
          width: 140px;
          height: 140px;
          flex-shrink: 0;
        }
        .circular-chart {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .circle-bg {
          fill: none;
          stroke: #F1ECE6;
          stroke-width: 3.8;
        }
        .circle-stroke-free {
          fill: none;
          stroke: var(--gold-500);
          stroke-width: 3.8;
          stroke-linecap: round;
        }
        .circle-stroke-paid {
          fill: none;
          stroke: var(--burgundy-700);
          stroke-width: 4.2;
          stroke-linecap: round;
        }
        .donut-center-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .donut-percentage {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--burgundy-700);
          font-family: var(--font-serif);
          line-height: 1;
        }
        .donut-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
          max-width: 85px;
        }
        .budget-metrics-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .metric-row {
          display: flex;
          align-items: center;
          font-size: 0.88rem;
          color: var(--text-secondary);
        }
        .metric-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 0.6rem;
        }
        .dot-burgundy { background: var(--burgundy-700); }
        .dot-champagne { background: var(--gold-500); }
        .dot-free { background: #388E3C; }
        .metric-name { flex: 1; }
        .metric-value { color: var(--text-primary); }
        .font-success { color: #2E7D32; }
        .metric-divider {
          height: 1px;
          background: var(--border-gold-subtle);
          margin: 0.2rem 0;
        }
        .total-row {
          font-weight: 700;
          color: var(--bg-burgundy-900);
        }
        .total-badge {
          background: var(--champagne-100);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-gold-subtle);
          font-size: 0.95rem;
        }

        /* Tasks Compact */
        .tasks-compact-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .task-item-compact {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          padding: 0.65rem 0.8rem;
          background: var(--surface-card-subtle);
          border: 1px solid rgba(197, 160, 89, 0.15);
          border-radius: var(--radius-md);
        }
        .task-checkbox {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 2px solid var(--burgundy-500);
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .task-checkbox.checked {
          background: var(--burgundy-700);
          border-color: var(--burgundy-700);
        }
        .task-info {
          flex: 1;
        }
        .task-name {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary);
          display: block;
          margin-bottom: 0.3rem;
        }
        .task-meta {
          display: flex;
          gap: 0.6rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          align-items: center;
          flex-wrap: wrap;
        }
        .badge-priority {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
        }
        .badge-priority.urgente {
          background: #FFEBEE;
          color: #C62828;
        }
        .badge-priority.alta {
          background: #FFF3E0;
          color: #EF6C00;
        }
        .badge-priority.media {
          background: #E8F5E9;
          color: #2E7D32;
        }

        /* RSVP Card */
        .rsvp-progress-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .rsvp-big-stat {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
        }
        .stat-number {
          font-size: 2.2rem;
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--burgundy-700);
        }
        .stat-sub {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .progress-bar-stacked {
          height: 12px;
          background: #EEE7DE;
          border-radius: var(--radius-pill);
          overflow: hidden;
          display: flex;
        }
        .bar-confirmed {
          background: linear-gradient(90deg, var(--burgundy-700) 0%, var(--burgundy-500) 100%);
        }
        .bar-pending {
          background: var(--gold-500);
        }
        .rsvp-chips {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .chip {
          font-size: 0.8rem;
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius-pill);
          font-weight: 600;
        }
        .chip.confirmed {
          background: var(--burgundy-100);
          color: var(--burgundy-700);
        }
        .chip.pending {
          background: var(--champagne-100);
          color: #8C6527;
        }
        .chip.tables-stat {
          background: white;
          border: 1px solid var(--border-gold-subtle);
          color: var(--text-secondary);
        }

        /* AI Shortcut Card */
        .ai-shortcut-card {
          background: linear-gradient(135deg, #FFFFFF 0%, #FDF8F2 100%);
        }
        .font-gold {
          color: var(--gold-600);
        }
        .sparkle-ai-badge {
          background: linear-gradient(135deg, var(--champagne-200) 0%, var(--gold-500) 100%);
          color: var(--bg-burgundy-950);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-pill);
        }
        .ai-intro-text {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 1.2rem;
        }
        .ai-quick-prompts {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .ai-prompt-pill {
          background: white;
          border: 1px solid var(--border-gold-subtle);
          padding: 0.6rem 0.9rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          color: var(--burgundy-700);
          font-weight: 600;
          text-align: left;
          transition: all 0.2s ease;
        }
        .ai-prompt-pill:hover {
          background: var(--burgundy-100);
          border-color: var(--burgundy-500);
          transform: translateX(4px);
        }

        @media (max-width: 900px) {
          .widgets-grid {
            grid-template-columns: 1fr;
          }
          .hero-headline {
            font-size: 2.1rem;
          }
          .countdown-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .budget-visual-wrap {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};
