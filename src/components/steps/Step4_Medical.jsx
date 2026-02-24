import React from 'react';
import Swal from 'sweetalert2';

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

/* Toggle Yes/No button pair */
const YesNoToggle = ({ value, onYes, onNo }) => (
    <div style={{ display: 'flex', gap: '8px' }}>
        <button
            type="button"
            onClick={onYes}
            style={{
                padding: '8px 22px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1.5px solid',
                background: value === true ? 'var(--color-padua-brown)' : 'transparent',
                borderColor: value === true ? 'var(--color-padua-brown)' : 'var(--border-soft)',
                color: value === true ? '#FDF8EE' : 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: '200ms cubic-bezier(0.4,0,0.2,1)',
            }}
        >
            Sí
        </button>
        <button
            type="button"
            onClick={onNo}
            style={{
                padding: '8px 22px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1.5px solid',
                background: value === false ? 'var(--color-padua-brown)' : 'transparent',
                borderColor: value === false ? 'var(--color-padua-brown)' : 'var(--border-soft)',
                color: value === false ? '#FDF8EE' : 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: '200ms cubic-bezier(0.4,0,0.2,1)',
            }}
        >
            No
        </button>
    </div>
);

/* Medical question block */
const MedicalBlock = ({ icon, label, value, onYes, onNo, children }) => (
    <div style={{
        background: 'rgba(255,255,255,0.5)',
        border: '1.5px solid var(--border-soft)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        display: 'grid',
        gap: '12px'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
                width: '34px', height: '34px',
                background: 'linear-gradient(135deg, var(--color-padua-gold), #E8C97E)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <label style={{
                fontSize: '0.82rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: 'var(--color-text-muted)', margin: 0
            }}>
                {label}
            </label>
        </div>
        <YesNoToggle value={value} onYes={onYes} onNo={onNo} />
        {children}
    </div>
);

/* SVG Icons */
const IconAllergy = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 3.5-2 6-4 8" />
        <path d="M9 17c-2-2-4-4.5-4-8a7 7 0 0 1 3-5.7" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

const IconPill = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" />
        <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
    </svg>
);

const IconShield = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const Step4_Medical = ({ data, updateData, onNext, onBack }) => {

    const handleNext = () => {
        // Validación básica de requeridos
        if (data.hasAllergies === true && !data.allergiesDetail?.trim()) {
            Swal.fire({ icon: 'warning', title: 'Información incompleta', text: 'Por favor especifique los detalles de la alergia.', confirmButtonColor: '#C9A84C' });
            return;
        }

        if (data.hasMedication === true && !data.medicationDetail?.trim()) {
            Swal.fire({ icon: 'warning', title: 'Información incompleta', text: 'Por favor especifique los detalles del medicamento (dosis/horario).', confirmButtonColor: '#C9A84C' });
            return;
        }

        if (data.hasInsurance === undefined) {
            Swal.fire({ icon: 'warning', title: 'Información incompleta', text: 'Por favor indique si tiene seguro médico.', confirmButtonColor: '#C9A84C' });
            return;
        }

        if (data.hasInsurance === true) {
            if (!data.insuranceType || data.insuranceType === 'No aplica') {
                Swal.fire({ icon: 'warning', title: 'Información incompleta', text: 'Por favor seleccione el tipo de seguro (Público o Privado).', confirmButtonColor: '#C9A84C' });
                return;
            }
            if (!data.insuranceDetail?.trim()) {
                Swal.fire({ icon: 'warning', title: 'Información incompleta', text: 'Por favor especifique el nombre de la aseguradora o seguro médico.', confirmButtonColor: '#C9A84C' });
                return;
            }
        }

        if (!data.bloodType) {
            Swal.fire({ icon: 'warning', title: 'Información incompleta', text: 'Por favor seleccione el tipo de sangre.', confirmButtonColor: '#C9A84C' });
            return;
        }

        onNext();
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '1.8rem' }}>
                <h2 style={{ marginBottom: '0.3rem' }}>Ficha Médica</h2>
                <p style={{ fontSize: '0.85rem' }}>Información confidencial y vital para la seguridad del participante.</p>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Alergias */}
                <MedicalBlock
                    icon={<IconAllergy />}
                    label="¿Tiene Alergias?"
                    value={data.hasAllergies}
                    onYes={() => updateData({ hasAllergies: true })}
                    onNo={() => updateData({ hasAllergies: false, allergiesDetail: '' })}
                >
                    {data.hasAllergies && (
                        <div className="animate-fade-in">
                            <textarea
                                placeholder="Especifique alimentos, medicamentos, materiales, etc..."
                                value={data.allergiesDetail || ''}
                                onChange={(e) => updateData({ allergiesDetail: e.target.value })}
                                rows="2"
                            />
                        </div>
                    )}
                </MedicalBlock>

                {/* Medicación */}
                <MedicalBlock
                    icon={<IconPill />}
                    label="¿Toma Medicación Constante?"
                    value={data.hasMedication}
                    onYes={() => updateData({ hasMedication: true })}
                    onNo={() => updateData({ hasMedication: false, medicationDetail: '' })}
                >
                    {data.hasMedication && (
                        <div className="animate-fade-in">
                            <textarea
                                placeholder="Indique nombre del medicamento, dosis y horario..."
                                value={data.medicationDetail || ''}
                                onChange={(e) => updateData({ medicationDetail: e.target.value })}
                                rows="2"
                            />
                        </div>
                    )}
                </MedicalBlock>

                {/* Seguro Médico */}
                <MedicalBlock
                    icon={<IconShield />}
                    label="¿Cuenta con Seguro Médico?"
                    value={data.hasInsurance}
                    onYes={() => updateData({ hasInsurance: true, insuranceDetail: '', insuranceType: '', insuranceNumber: '' })}
                    onNo={() => updateData({ hasInsurance: false, insuranceType: 'No aplica', insuranceDetail: 'No aplica', insuranceNumber: '' })}
                >
                    {data.hasInsurance && (
                        <div className="animate-fade-in" style={{ display: 'grid', gap: '12px', marginTop: '8px' }}>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                                    Tipo de Seguro
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {['Público', 'Privado'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => updateData({ insuranceType: type })}
                                            style={{
                                                flex: 1,
                                                padding: '8px',
                                                borderRadius: '8px',
                                                border: '1px solid',
                                                borderColor: data.insuranceType === type ? 'var(--color-padua-brown)' : 'var(--border-soft)',
                                                background: data.insuranceType === type ? 'var(--color-padua-brown)' : 'transparent',
                                                color: data.insuranceType === type ? '#fff' : 'var(--color-text)',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                                    Nombre de la Aseguradora / Institución
                                </label>
                                <input
                                    type="text"
                                    placeholder={data.insuranceType === 'Público' ? 'Ej. IESS, ISSFA, ISSPOL' : 'Ej. Humana, SaludSA, BMI...'}
                                    value={data.insuranceDetail || ''}
                                    onChange={(e) => updateData({ insuranceDetail: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-soft)', background: 'var(--bg-field)' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                                    Número de Póliza o Teléfono (Opcional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Opcional"
                                    value={data.insuranceNumber || ''}
                                    onChange={(e) => updateData({ insuranceNumber: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-soft)', background: 'var(--bg-field)' }}
                                />
                            </div>
                        </div>
                    )}
                </MedicalBlock>

                {/* Tipo sangre */}
                <div className="form-group">
                    <label htmlFor="bloodType">Tipo de Sangre</label>
                    <select
                        id="bloodType"
                        value={data.bloodType || ''}
                        onChange={(e) => updateData({ bloodType: e.target.value })}
                    >
                        <option value="">Seleccione...</option>
                        <option>O+</option>
                        <option>O-</option>
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                    </select>
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

export default Step4_Medical;
