import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { db, collection, addDoc, serverTimestamp } from '../../services/firebase';
import { getConfirmationEmailHTML } from '../../utils/emailTemplates';
import { jsPDF } from 'jspdf';
import logoPadua from '../../assets/images/logo_padua.jpg';
import logoMetanoiia from '../../assets/images/logo_metanoiia.png';

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

const IconFacebook = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

const IconInstagram = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const IconTikTok = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
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

const SuccessView = () => (
    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{
            width: '80px', height: '80px', margin: '0 auto 1.5rem',
            background: 'rgba(0,137,123,0.1)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-metanoiia-teal)'
        }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </div>

        <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            ¡Gracias por confiar en nosotros!
        </h2>

        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem', maxWidth: '400px', marginInline: 'auto' }}>
            Más de 7 años de experiencia transformando vidas a través de retiros espirituales.
        </p>

        <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-padua-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                Síguenos en nuestras redes
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                <a href="https://www.facebook.com/metanoiiaec" target="_blank" rel="noopener noreferrer"
                    style={{ color: '#1877F2', padding: '10px', background: '#F0F9FF', borderRadius: '12px', transition: 'transform 0.2s' }}
                    className="social-icon">
                    <IconFacebook />
                </a>
                <a href="https://www.instagram.com/metanoiiaec" target="_blank" rel="noopener noreferrer"
                    style={{ color: '#E4405F', padding: '10px', background: '#FFF0F5', borderRadius: '12px', transition: 'transform 0.2s' }}
                    className="social-icon">
                    <IconInstagram />
                </a>
                <a href="https://www.tiktok.com/@metanoiiaec" target="_blank" rel="noopener noreferrer"
                    style={{ color: '#000000', padding: '10px', background: '#F5F5F5', borderRadius: '12px', transition: 'transform 0.2s' }}
                    className="social-icon">
                    <IconTikTok />
                </a>
            </div>
            <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                @metanoiiaec
            </p>
        </div>

        <button
            className="btn-primary"
            onClick={() => window.location.reload()}
            style={{ width: '100%', maxWidth: '300px' }}
        >
            Volver al Inicio
        </button>
    </div>
);

const Step6_Summary = ({ data, onBack }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const generateAndUploadPDF = async (data) => {
        const doc = new jsPDF();

        const cPrimary = [59, 35, 20];
        const cGold = [201, 168, 76];
        const cText = [40, 40, 40];
        const cMuted = [110, 110, 110];
        const cWhite = [255, 255, 255];

        // ── HEADER ────────────────────────────────────────────────
        doc.setFillColor(...cPrimary);
        doc.rect(0, 0, 210, 28, 'F');

        // Right panel — gradient café → blanco (8 strips)
        const strips = 8;
        const sw = 48 / strips;
        for (let s = 0; s < strips; s++) {
            const t = s / (strips - 1);
            doc.setFillColor(
                Math.round(59 + (255 - 59) * t),
                Math.round(35 + (252 - 35) * t),
                Math.round(20 + (245 - 20) * t)
            );
            doc.rect(162 + s * sw, 0, sw + 0.5, 28, 'F');
        }

        // Gold separator
        doc.setFillColor(...cGold);
        doc.rect(0, 28, 210, 1.5, 'F');

        // Logos
        const loadImg = (src) => new Promise((res, rej) => {
            const i = new Image(); i.src = src;
            i.onload = () => res(i); i.onerror = rej;
        });
        try {
            const [imgP, imgM] = await Promise.all([loadImg(logoPadua), loadImg(logoMetanoiia)]);
            doc.addImage(imgP, 'JPEG', 2, 2, 24, 24);
            const mW = imgM.naturalWidth || 1, mH = imgM.naturalHeight || 1;
            const maxW = 44, maxH = 24;
            let rW = maxW, rH = maxW * mH / mW;
            if (rH > maxH) { rH = maxH; rW = maxH * mW / mH; }
            doc.addImage(imgM, 'PNG', 162 + (48 - rW) / 2, (28 - rH) / 2, rW, rH);
        } catch (e) { /* logos optional */ }

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...cWhite);
        doc.setFontSize(15);
        doc.text('FICHA DE INSCRIPCIÓN', 96, 12, null, null, 'center');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        const sub = doc.splitTextToSize('RETIRO ESPIRITUAL · U.E. FISCOMISIONAL SAN ANTONIO DE PADUA & METANOIIA', 130);
        doc.text(sub, 96, 20, null, null, 'center');

        // ── CONTENT ───────────────────────────────────────────────
        let y = 36;

        const section = (title) => {
            doc.setFillColor(...cGold);
            doc.rect(10, y - 5, 190, 7, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...cWhite);
            doc.text(title, 14, y);
            y += 8;
            doc.setTextColor(...cText); doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
        };

        const field = (label, value, x, maxW) => {
            doc.setFont('helvetica', 'bold'); doc.setTextColor(...cText);
            const lw = doc.getTextWidth(`${label}: `);
            doc.text(`${label}: `, x, y);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(String(value || '—'), maxW - lw);
            doc.text(lines, x + lw, y);
            return lines.length;
        };

        const row2 = (lL, lV, rL, rV, h = 6) => {
            const a = field(lL, lV, 12, 88);
            const b = field(rL, rV, 110, 88);
            y += Math.max(a, b) * 4.5 + (h - 4.5);
        };
        const row1 = (label, value, h = 6) => {
            const n = field(label, value, 12, 186);
            y += n * 4.5 + (h - 4.5);
        };
        const check = (v) => v ? '✔ SÍ' : '✘ NO';

        // 1. Estudiante
        section('1. DATOS DEL ESTUDIANTE');
        row2('Nombre', data.studentName, 'Cédula', data.idCard);
        row2('Género', data.gender, 'Edad', `${data.age} años`);
        row1('Curso', `${data.grade || ''} "${data.parallel || ''}"`);
        y += 2;

        // 2. Representante
        section('2. DATOS DEL REPRESENTANTE');
        row2('Nombre', data.guardianName, 'Parentesco', data.guardianRelation);
        row2('Teléfono', data.guardianPhone, 'Email', data.guardianEmail || '—');
        row1('Emergencia', data.emergencyPhone || 'No registrado');
        y += 2;

        // 3. Médica
        section('3. INFORMACIÓN MÉDICA');
        row2('Tipo de Sangre', data.bloodType || 'No especificado',
            'Seguro Médico', data.hasInsurance ? `SÍ — ${data.insuranceType || ''}` : 'NO');
        if (data.hasInsurance) row1('Detalle Seguro', `${data.insuranceDetail || ''} · Tel: ${data.insuranceNumber || ''}`);
        row2('Alergias', data.hasAllergies ? `SÍ — ${data.allergiesDetail || ''}` : 'NO',
            'Medicación', data.hasMedication ? `SÍ — ${data.medicationDetail || ''}` : 'NO');
        y += 2;

        // 4. Autorizaciones
        if (y > 210) { doc.addPage(); y = 20; }
        section('4. COMPROMISOS Y AUTORIZACIONES');
        doc.setFontSize(8.5);

        const auth = (label, val, desc) => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...(val ? [5, 100, 60] : [160, 30, 30]));
            doc.text(`${check(val)}  ${label}`, 14, y);
            doc.setFont('helvetica', 'normal'); doc.setTextColor(...cMuted);
            doc.text(desc, 18, y + 4);
            doc.setTextColor(...cText);
            y += 10;
        };
        auth('Normas de Convivencia', data.acceptedRules,
            'El estudiante y representante aceptan el reglamento del retiro.');
        auth('Exoneración y Responsabilidad Médica', data.acceptedLiability,
            'Autorizan atención médica de urgencia y exoneran de responsabilidad por pérdidas.');
        auth('Uso de Imagen para Fines Institucionales', data.acceptedMedia,
            'Autorizan el uso de fotografías y videos para fines pastorales e institucionales.');
        auth('Política de Tratamiento de Datos (Habeas Data)', data.habeasData,
            'Aceptan el tratamiento de la información para fines del retiro.');

        // ── FIRMAS ───────────────────────────────────────────────
        if (y > 250) { doc.addPage(); y = 30; }
        y = Math.max(y, 240);
        doc.setFontSize(9); doc.setTextColor(...cText);
        doc.setDrawColor(...cPrimary); doc.setLineWidth(0.4);
        doc.line(20, y, 90, y);
        doc.line(120, y, 190, y);
        y += 4;
        doc.setFont('helvetica', 'bold');
        doc.text('Firma del Representante', 55, y, null, null, 'center');
        doc.text('Firma del Estudiante', 155, y, null, null, 'center');
        y += 4;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...cMuted);
        doc.text(data.guardianName || '', 55, y, null, null, 'center');
        doc.text(data.studentName || '', 155, y, null, null, 'center');

        // ── FOOTER ───────────────────────────────────────────────
        doc.setFontSize(7); doc.setTextColor(170);
        const pages = doc.internal.getNumberOfPages();
        for (let p = 1; p <= pages; p++) {
            doc.setPage(p);
            doc.text(`Generado el ${new Date().toLocaleString()} · U.E. Fiscomisional San Antonio de Padua & Metanoiia · Pág ${p}/${pages}`, 105, 292, null, null, 'center');
        }

        // ── CLOUDINARY UPLOAD ─────────────────────────────────────
        const pdfBlob = new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
        const filename = `${data.studentName?.replace(/\s+/g, '_') || 'inscripcion'}_${Date.now()}`;
        const formData = new FormData();
        formData.append('file', pdfBlob, `${filename}.pdf`);
        formData.append('upload_preset', 'pdfs_retirospadua2026');
        formData.append('public_id', `fichas/${filename}`);

        const response = await fetch(
            'https://api.cloudinary.com/v1_1/dc1oohqwu/raw/upload',
            { method: 'POST', body: formData }
        );
        if (!response.ok) throw new Error(`Cloudinary error: ${response.status}`);
        const result = await response.json();
        // Add fl_attachment so the link forces download instead of inline render
        const downloadUrl = result.secure_url.replace('/raw/upload/', '/raw/upload/fl_attachment/');
        return downloadUrl;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // 1. Generar PDF y subir a Firebase Storage (con timeout de 5s)
            let pdfURL = null;
            try {
                const timeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                );
                pdfURL = await Promise.race([generateAndUploadPDF(data), timeout]);
                console.log('✅ PDF subido:', pdfURL);
            } catch (pdfErr) {
                console.warn('⚠️ PDF omitido (continúa sin PDF):', pdfErr.message);
            }

            // 2. Guardar en Firestore
            await addDoc(collection(db, "registros"), {
                ...data,
                createdAt: serverTimestamp(),
                userAgent: navigator.userAgent
            });
            console.log('✅ Registro guardado en Firestore');

            // 3. Enviar correo (opcional, no bloquea el éxito)
            if (data.guardianEmail) {
                try {
                    const templateParams = {
                        to_email: data.guardianEmail,
                        to_name: data.guardianName,
                        student_name: data.studentName,
                        message: `¡Hola ${data.guardianName}! Tu representado ${data.studentName} ha sido inscrito exitosamente.`,
                        html_message: getConfirmationEmailHTML(data, pdfURL),
                        reply_to: 'metanoiiaec@gmail.com',
                    };
                    await emailjs.send('service_a29qagj', 'template_anwz2rc', templateParams, 'cyFaYsemWSPVWLP6M');
                    console.log('✅ Correo enviado a:', data.guardianEmail);
                } catch (mailErr) {
                    console.warn('⚠️ Correo no se pudo enviar (inscripción registrada igual):', mailErr.message);
                }
            }

            // Mostrar vista de éxito
            setIsSuccess(true);

        } catch (error) {
            console.error('❌ Error crítico al guardar:', error);
            alert('Hubo un error al conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return <SuccessView />;
    }

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
                <Row label="Género" value={data.gender} />
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
