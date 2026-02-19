import React, { useState } from 'react';

const IconArrowRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

const IconCheck = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/* Icons for cards */
const IconBackpack = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
    </svg>
);

const IconScroll = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

const IconScale = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21v-7" />
        <path d="M19 21v-7" />
        <path d="M12 3v18" />
        <path d="M5 10a5 5 0 0 1 9.9-1" />
        <path d="M14 14a5 5 0 0 1 9.8-1" />
    </svg>
);

/* Clear Status Button Component */
const StatusBtn = ({ active, onClick, label, activeLabel }) => (
    <div
        className={`status-btn ${active ? 'active' : ''}`}
        onClick={() => onClick(!active)}
    >
        {active ? (
            <>
                <IconCheck /> {activeLabel || 'Aceptado'}
            </>
        ) : (
            label || 'Aceptar'
        )}
    </div>
);

const FeatureCard = ({ icon, title, children, active }) => (
    <div className={`feature-card ${active ? 'active' : ''}`}>
        <div className="feature-card-header">
            <div className="feature-icon-box">
                {icon}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>{title}</h3>
        </div>
        <div className="feature-card-content">
            {children}
        </div>
    </div>
);

const BASE_PACKING_LIST = [
    'Ropa cómoda y abrigada.',
    'Útiles de aseo personal.',
    'Biblia, cuaderno de apuntes y esfero.',
    'Una cobija ligera.',
];

const Step5_Clauses = ({ data, updateData, onNext, onBack }) => {
    const rulesActive = data.acceptedRules === true;
    const legalActive = data.acceptedLiability === true && data.acceptedMedia === true;

    const canProceed = rulesActive && legalActive;

    // Dynamic packing list based on medical data
    const currentPackingList = [...BASE_PACKING_LIST];
    if (data.hasMedication) {
        currentPackingList.push('Medicamentos personales (dosis y horarios).');
    }

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '0.8rem', fontSize: '2rem' }}>Compromiso y Normativa</h2>
                <p style={{ fontSize: '1rem', color: 'var(--color-text)' }}>Revisa y acepta los términos para finalizar tu inscripción.</p>
            </div>

            <div className="card-stack">

                {/* 1. MOCHILA CARD */}
                <FeatureCard icon={<IconBackpack />} title="¿Qué debo llevar?">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                        {currentPackingList.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: 'var(--color-text)' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-padua-gold)' }} />
                                {item}
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1.5rem', padding: '14px', background: 'rgba(201,168,76,0.1)', borderRadius: '12px', fontSize: '0.95rem', color: '#6B4E15', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.4rem' }}>⚠️</span>
                        <span>No llevar objetos de valor, accesorios costosos, tecnología ni dinero.</span>
                    </div>
                </FeatureCard>

                {/* 2. NORMAS CARD */}
                <FeatureCard icon={<IconScroll />} title="Normas de Convivencia" active={rulesActive}>
                    <p style={{ marginBottom: '1.2rem', fontSize: '1rem' }}>
                        Lineamientos esenciales para la experiencia:
                    </p>
                    <div className="rules-grid">
                        {[
                            ['📵 Desconexión', 'Sin celulares para mayor silencio interior.'],
                            ['🤝 Respeto', 'Trato cordial con todos los compañeros.'],
                            ['⏰ Puntualidad', 'Cumplir horarios de actividades.'],
                            ['🚫 Cero Tolerancia', 'Sin alcohol, tabaco o sustancias.'],
                        ].map(([title, desc], i) => (
                            <div key={i} style={{ padding: '14px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
                                <strong style={{ display: 'block', color: 'var(--color-primary)', fontSize: '1rem', marginBottom: '4px' }}>{title}</strong>
                                <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: '1.4' }}>{desc}</span>
                            </div>
                        ))}
                    </div>

                    <div className="action-bar">
                        <div className="action-bar-label">
                            He leído y acepto<br />las Normas de Convivencia
                        </div>
                        <StatusBtn
                            active={data.acceptedRules || false}
                            onClick={(val) => updateData({ acceptedRules: val })}
                            label="Aceptar Normas"
                            activeLabel="Normas Aceptadas"
                        />
                    </div>
                </FeatureCard>

                {/* 3. LEGAL CARD */}
                <FeatureCard icon={<IconScale />} title="Legal y Permisos" active={legalActive}>
                    <div className="legal-paper">
                        <p style={{ marginBottom: '8px' }}><strong>1. Exoneración:</strong> El Colegio no se responsabiliza por pérdidas o accidentes fortuitos.</p>
                        <p style={{ marginBottom: '8px' }}><strong>2. Emergencias:</strong> Autorizo decisiones médicas urgentes y traslados.</p>
                        <p><strong>3. Imagen:</strong> Autorizo uso de fotos/videos para fines pastorales.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        <div className="action-bar" style={{ marginTop: '0.5rem', borderTop: 'none' }}>
                            <div className="action-bar-label">
                                Exoneración y<br />Responsabilidad Médica
                            </div>
                            <StatusBtn
                                active={data.acceptedLiability || false}
                                onClick={(val) => updateData({ acceptedLiability: val })}
                                label="Autorizar"
                                activeLabel="Autorizado"
                            />
                        </div>

                        <div className="action-bar" style={{ marginTop: '0.5rem' }}>
                            <div className="action-bar-label">
                                Uso de Imagen<br />Institucional
                            </div>
                            <StatusBtn
                                active={data.acceptedMedia || false}
                                onClick={(val) => updateData({ acceptedMedia: val })}
                                label="Autorizar"
                                activeLabel="Autorizado"
                            />
                        </div>
                    </div>
                </FeatureCard>

            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3.5rem', marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                <button className="btn-secondary" onClick={onBack}>
                    <IconArrowLeft /> Atrás
                </button>
                <button
                    className="btn-primary"
                    onClick={onNext}
                    disabled={!canProceed}
                    style={{ opacity: !canProceed ? 0.5 : 1, filter: !canProceed ? 'grayscale(0.8)' : 'none' }}
                >
                    Siguiente <IconArrowRight />
                </button>
            </div>
        </div>
    );
};

export default Step5_Clauses;
