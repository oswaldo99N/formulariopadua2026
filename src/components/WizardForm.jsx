import { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/main.css';
import Step3_GuardianData from './steps/Step3_GuardianData';
import Step4_Medical from './steps/Step4_Medical';
import Step5_Clauses from './steps/Step5_Clauses';
import Step6_Summary from './steps/Step6_Summary';

import logoPadua from '../assets/images/logo_padua.jpg';
import logoMetanoiia from '../assets/images/logo_metanoiia.png';

/* ── SVG Icon Helpers ─────────────────────────────────────── */
const IconCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconArrowRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const IconPrint = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
    </svg>
);

const IconCross = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

/* ── Women / Men icons (SVG) ─────────────────────────────── */
const IconWoman = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3" />
        <path d="M9 20v-5l-1-3a5 5 0 0 1 8 0l-1 3v5" />
        <path d="M9 20h6" />
        <path d="M10.5 14.5l1.5 5.5 1.5-5.5" />
    </svg>
);

const IconMan = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3" />
        <path d="M6 21v-5a6 6 0 0 1 12 0v5" />
        <line x1="12" y1="12" x2="12" y2="15" />
    </svg>
);

/* ── Step Labels ─────────────────────────────────────────── */
const STEP_LABELS = ['Bienvenida', 'Estudiante', 'Representante', 'Médica', 'Compromiso', 'Resumen'];
const TOTAL_STEPS = 6;

/* ══════════════════════════════════════════════════════════
   PASO 1 — Bienvenida
═══════════════════════════════════════════════════════════ */
const Step1_Welcome = ({ onNext, setRetreatType, updateData }) => (
    <div className="animate-fade-in" style={{ textAlign: 'center' }}>

        {/* Decorative divider */}
        <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            justifyContent: 'center', marginBottom: '2rem'
        }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--border-soft)' }} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-padua-gold)" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
            <div style={{ width: '40px', height: '1px', background: 'var(--border-soft)' }} />
        </div>

        <h1 style={{ marginBottom: '0.5rem', fontStyle: 'italic' }}>Retiro Espiritual</h1>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-padua-gold)', marginBottom: '0.75rem' }}>
            Unidad Educativa Fiscomisional San Antonio de Padua
        </p>
        <p style={{ maxWidth: '380px', margin: '0 auto 3rem', fontSize: '1rem', color: 'var(--color-text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-heading)' }}>
            "Descubre, Conecta, Renueva. Un viaje hacia tu interior."
        </p>

        <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-light)', marginBottom: '1.2rem' }}>
            Selecciona tu retiro
        </p>

        <div style={{ display: 'grid', gap: '14px', maxWidth: '380px', margin: '0 auto' }}>
            <button
                className="btn-retreat btn-retreat-women"
                onClick={() => { setRetreatType('women'); updateData({ gender: 'Femenino' }); onNext(); }}
            >
                <IconWoman />
                <span>Retiro de Mujeres</span>
            </button>
            <button
                className="btn-retreat btn-retreat-men"
                onClick={() => { setRetreatType('men'); updateData({ gender: 'Masculino' }); onNext(); }}
            >
                <IconMan />
                <span>Retiro de Hombres</span>
            </button>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════════
   PASO 2 — Datos del Estudiante
   ═══════════════════════════════════════════════════════════ */
const Step2_StudentData = ({ data, updateData, onNext, onBack }) => {

    const handleNameChange = (e) => {
        const val = e.target.value;
        if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
            updateData({ studentName: val });
        }
    };

    const handleAgeChange = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val) && val.length <= 2) {
            updateData({ age: val });
        }
    };

    const handleIdChange = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val) && val.length <= 10) {
            updateData({ idCard: val });
        }
    };

    const handleNext = () => {
        const { studentName, age, idCard, grade, parallel, gender } = data;

        if (!studentName?.trim() || !age || !idCard || !grade || !parallel || !gender) {
            Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor complete todos los campos obligatorios (incluyendo Paralelo).', confirmButtonColor: '#C9A84C' });
            return;
        }

        if (idCard.length !== 10) {
            Swal.fire({ icon: 'warning', title: 'Cédula inválida', text: 'La cédula debe tener 10 dígitos obligatorios.', confirmButtonColor: '#C9A84C' });
            return;
        }

        onNext();
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '1.8rem' }}>
                <h2 style={{ marginBottom: '0.3rem' }}>Datos del Estudiante</h2>
                <p style={{ fontSize: '0.85rem' }}>Completa la información personal del participante.</p>
            </div>

            <div style={{ display: 'grid', gap: '1.2rem' }}>
                <div className="form-group">
                    <label htmlFor="studentName">Nombre Completo</label>
                    <input
                        id="studentName"
                        type="text"
                        placeholder="Ej. María Fernanda Pérez (Solo letras)"
                        value={data.studentName || ''}
                        onChange={handleNameChange}
                    />
                </div>

                <div className="grid-2">
                    <div className="form-group">
                        <label htmlFor="age">Edad</label>
                        <input
                            id="age"
                            type="text"
                            inputMode="numeric"
                            placeholder="Ej. 15"
                            value={data.age || ''}
                            onChange={handleAgeChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="idCard">Cédula</label>
                        <input
                            id="idCard"
                            type="text"
                            inputMode="numeric"
                            placeholder="Ej. 1712345678 (10 dígitos)"
                            value={data.idCard || ''}
                            onChange={handleIdChange}
                            maxLength={10}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="grade">Curso y Paralelo</label>
                    <div className="grid-2-auto">
                        <select
                            id="grade"
                            value={data.grade || ''}
                            onChange={(e) => updateData({ grade: e.target.value })}
                        >
                            <option value="">Selecciona tu curso...</option>
                            <option value="8vo">8vo EGB</option>
                            <option value="9no">9no EGB</option>
                            <option value="10mo">10mo EGB</option>
                            <option value="1ro_bach">1ro Bachillerato</option>
                            <option value="2do_bach">2do Bachillerato</option>
                            <option value="3ro_bach">3ro Bachillerato</option>
                        </select>
                        <select
                            id="parallel"
                            value={data.parallel || ''}
                            onChange={(e) => updateData({ parallel: e.target.value })}
                        >
                            <option value="">Paralelo</option>
                            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                            <option value="Técnico">Técnico</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.2rem', gap: '12px' }}>
                <button className="btn-secondary" onClick={onBack}>
                    <IconArrowLeft /> Atrás
                </button>
                <button className="btn-primary" onClick={handleNext}>
                    Siguiente <IconArrowRight />
                </button>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   WIZARD PRINCIPAL
═══════════════════════════════════════════════════════════ */
export default function WizardForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [retreatType, setRetreatType] = useState(null);

    const updateData = (newData) => setFormData(prev => ({ ...prev, ...newData }));
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    /* ── Normal Wizard ───────────────────────────────────── */
    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>

            {/* Main Glass Card */}
            <div className="glass-panel" style={{ padding: '52px 56px' }}>

                {/* ── Header: Logos ── */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem',
                    paddingBottom: '2rem',
                    borderBottom: '1px solid var(--border-soft)',
                }}>
                    {/* Logo Padua */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '14px'
                    }}>
                        <div style={{
                            width: '64px', height: '64px',
                            borderRadius: '50%',
                            background: '#fff',
                            boxShadow: '0 4px 16px rgba(59,35,20,0.12)',
                            border: '2px solid var(--color-padua-gold)',
                            overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <img src={logoPadua} alt="Unidad Educativa Fiscomisional San Antonio de Padua"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-padua-gold)' }}>
                                U.E. Fiscomisional
                            </div>
                            <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1.2 }}>
                                San Antonio<br />de Padua
                            </div>
                        </div>
                    </div>

                    {/* Center ornament */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.3 }}>
                        <div style={{ width: '1px', height: '30px', background: 'var(--color-primary)' }} />
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="var(--color-padua-gold)">
                            <polygon points="6,0 7.5,4.5 12,4.5 8.25,7.5 9.75,12 6,9 2.25,12 3.75,7.5 0,4.5 4.5,4.5" />
                        </svg>
                        <div style={{ width: '1px', height: '30px', background: 'var(--color-primary)' }} />
                    </div>

                    {/* Logo Metanoiia */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '14px', flexDirection: 'row-reverse'
                    }}>
                        <div style={{
                            width: '64px', height: '64px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            <img src={logoMetanoiia} alt="Metanoiia"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1, letterSpacing: '0.05em' }}>
                                METANOIIA
                            </div>
                            <div style={{ fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-metanoiia-teal)', marginTop: '4px' }}>
                                CORPORATION S.A.S.
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Progress ── */}
                <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-light)' }}>
                        Paso {step} de {TOTAL_STEPS}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-padua-gold)' }}>
                        {STEP_LABELS[step - 1]}
                    </span>
                </div>

                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
                </div>

                {/* Step dots */}
                <div className="step-dots" style={{ marginBottom: '2.5rem' }}>
                    {STEP_LABELS.map((_, i) => (
                        <div
                            key={i}
                            className={`step-dot ${i + 1 === step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}`}
                            title={STEP_LABELS[i]}
                        />
                    ))}
                </div>

                {/* ── Step Content ── */}
                {step === 1 && <Step1_Welcome onNext={nextStep} setRetreatType={setRetreatType} updateData={updateData} />}
                {step === 2 && <Step2_StudentData data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
                {step === 3 && <Step3_GuardianData data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
                {step === 4 && <Step4_Medical data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
                {step === 5 && <Step5_Clauses data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
                {step === 6 && <Step6_Summary data={formData} onBack={prevStep} />}
            </div>
        </div>
    );
}
