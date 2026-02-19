import React from 'react';

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

const Step3_GuardianData = ({ data, updateData, onNext, onBack }) => {

    const handleNameChange = (e) => {
        const val = e.target.value;
        // Solo letras y espacios
        if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
            updateData({ guardianName: val });
        }
    };

    const handlePhoneChange = (field, e) => {
        const val = e.target.value;
        // Solo números y max 10
        if (/^\d*$/.test(val) && val.length <= 10) {
            updateData({ [field]: val });
        }
    };

    const handleNext = () => {
        const { guardianName, guardianPhone, guardianRelation, emergencyPhone } = data;

        if (!guardianName?.trim() || !guardianPhone?.trim() || !guardianRelation) {
            alert("Por favor complete todos los campos obligatorios.");
            return;
        }

        if (guardianPhone.length !== 10) {
            alert("El teléfono de contacto debe tener 10 dígitos.");
            return;
        }

        if (emergencyPhone && emergencyPhone.length !== 10) {
            alert("El teléfono de emergencia debe tener 10 dígitos (o déjelo vacío).");
            return;
        }

        onNext();
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '1.8rem' }}>
                <h2 style={{ marginBottom: '0.3rem' }}>Datos del Representante</h2>
                <p style={{ fontSize: '0.85rem' }}>Información del padre, madre o tutor legal responsable.</p>
            </div>

            <div style={{ display: 'grid', gap: '1.2rem' }}>
                <div className="form-group">
                    <label htmlFor="guardianName">Nombre del Representante</label>
                    <input
                        id="guardianName"
                        type="text"
                        placeholder="Nombre completo (Solo letras)"
                        value={data.guardianName || ''}
                        onChange={handleNameChange}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label htmlFor="guardianPhone">Teléfono de Contacto</label>
                        <input
                            id="guardianPhone"
                            type="tel"
                            placeholder="0991234567"
                            value={data.guardianPhone || ''}
                            onChange={(e) => handlePhoneChange('guardianPhone', e)}
                            maxLength={10}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="guardianRelation">Parentesco</label>
                        <select
                            id="guardianRelation"
                            value={data.guardianRelation || ''}
                            onChange={(e) => updateData({ guardianRelation: e.target.value })}
                        >
                            <option value="">Seleccione...</option>
                            <option value="Padre">Padre</option>
                            <option value="Madre">Madre</option>
                            <option value="Abuelo/a">Abuelo/a</option>
                            <option value="Tío/a">Tío/a</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                </div>

                {/* Divider */}
                <div className="divider">
                    <div className="divider-line" />
                    <span className="divider-text">Emergencia</span>
                    <div className="divider-line" />
                </div>

                <div className="form-group">
                    <label htmlFor="emergencyPhone">Teléfono de Emergencia Adicional</label>
                    <input
                        id="emergencyPhone"
                        type="tel"
                        placeholder="Opcional (10 dígitos)"
                        value={data.emergencyPhone || ''}
                        onChange={(e) => handlePhoneChange('emergencyPhone', e)}
                        maxLength={10}
                    />
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

export default Step3_GuardianData;
