import React, { useState } from 'react';
import { db, collection, addDoc, serverTimestamp } from '../../services/firebase';

const IconArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

const IconSend = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-metanoiia-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const Row = ({ label, value }) => (
    <div className="summary-row">
        <span className="summary-label">{label}</span>
        <span className="summary-value">{value || '—'}</span>
    </div>
);

const SectionTitle = ({ children }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '10px', marginTop: '4px'
    }}>
        <div style={{
            width: '4px', height: '18px',
            background: 'linear-gradient(180deg, var(--color-padua-gold), var(--color-metanoiia-teal))',
            borderRadius: '2px', flexShrink: 0
        }} />
        <h3 style={{ letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>{children}</h3>
    </div>
);



const Step6_Summary = ({ data, onBack }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Guardar en Firestore
            await addDoc(collection(db, "registros"), {
                ...data,
                createdAt: serverTimestamp(),
                userAgent: navigator.userAgent
            });

            alert('¡INSCRIPCIÓN ÉXITOSA!\n\nSe ha registrado correctamente la información del retiro espiritual. Gracias por ser parte de esta experiencia.');

            // Recargar para limpiar el formulario (simple reset)
            window.location.reload();

        } catch (error) {
            console.error("Error al guardar:", error);
            alert('Hubo un error al conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '1.8rem', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '0.3rem' }}>Confirmar Inscripción</h2>
                <p style={{ fontSize: '0.85rem' }}>Revisa los datos antes de enviar. Al confirmar, se guardará en la base de datos.</p>
            </div>

            {/* Student name header */}
            <div style={{
                textAlign: 'center',
                padding: '18px',
                background: 'linear-gradient(135deg, rgba(59,35,20,0.04), rgba(201,168,76,0.08))',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.2rem'
            }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-padua-gold)', marginBottom: '4px' }}>
                    Participante
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    {data.studentName || 'Sin nombre'}
                </div>
            </div>

            {/* Section: Student */}
            <div className="summary-section">
                <SectionTitle>Datos Personales</SectionTitle>
                <Row label="Cédula" value={data.idCard} />
                <Row label="Curso" value={data.grade} />
                <Row label="Paralelo" value={data.parallel} />
                <Row label="Edad" value={data.age ? `${data.age} años` : null} />
            </div>

            {/* Section: Guardian */}
            <div className="summary-section">
                <SectionTitle>Representante</SectionTitle>
                <Row label="Nombre" value={data.guardianName} />
                <Row label="Parentesco" value={data.guardianRelation} />
                <Row label="Teléfono" value={data.guardianPhone} />
                {data.emergencyPhone && <Row label="Emergencia" value={data.emergencyPhone} />}
            </div>

            {/* Section: Medical */}
            <div className="summary-section">
                <SectionTitle>Ficha Médica</SectionTitle>
                <Row label="Alergias" value={data.hasAllergies ? (data.allergiesDetail || 'Sí') : 'No'} />
                <Row label="Medicación" value={data.hasMedication ? (data.medicationDetail || 'Sí') : 'No'} />
                <Row label="Tipo Sangre" value={data.bloodType} />
                <Row label="Seguro" value={data.hasInsurance ? `${data.insuranceType} - ${data.insuranceDetail}` : 'No aplica'} />
                {data.hasInsurance && data.insuranceNumber && <Row label="Nro/Tel" value={data.insuranceNumber} />}
            </div>

            {/* Section: Legal */}
            <div className="summary-section" style={{ marginBottom: '1.8rem' }}>
                <SectionTitle>Autorizaciones</SectionTitle>
                <div style={{ display: 'grid', gap: '8px', paddingTop: '4px' }}>
                    {[
                        ['Normas de Convivencia', data.acceptedRules],
                        ['Exoneración y Autorización Médica', data.acceptedLiability],
                        ['Uso de Imagen Institucional', data.acceptedMedia],
                    ].map(([label, val]) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: val ? 'var(--color-text)' : 'var(--color-text-light)' }}>
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                background: val ? 'rgba(0,137,123,0.12)' : 'rgba(0,0,0,0.05)',
                                border: `1.5px solid ${val ? 'var(--color-metanoiia-teal)' : 'var(--border-soft)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {val && <CheckIcon />}
                            </div>
                            {label}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <button className="btn-secondary" onClick={onBack} disabled={isSubmitting}>
                    <IconArrowLeft /> Editar
                </button>
                <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{ flex: 1, justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}
                >
                    {isSubmitting ? 'Enviando...' : 'Confirmar e Inscribirse'} <IconSend />
                </button>
            </div>
        </div>
    );
};

export default Step6_Summary;
