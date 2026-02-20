import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { db, storage, collection, addDoc, serverTimestamp, ref, uploadBytes, getDownloadURL } from '../../services/firebase';
import { getConfirmationEmailHTML } from '../../utils/emailTemplates';
import { jsPDF } from 'jspdf';

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
        const colorPrimary = [59, 35, 20];
        const colorGold = [201, 168, 76];
        const colorText = [40, 40, 40];
        const colorLight = [100, 100, 100];

        // Header
        doc.setFillColor(...colorPrimary);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.text('FICHA DE INSCRIPCIÓN', 105, 11, null, null, 'center');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('RETIRO ESPIRITUAL - U.E. FISCOMISIONAL SAN ANTONIO DE PADUA & METANOIIA', 105, 19, null, null, 'center');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Generado el: ' + new Date().toLocaleString(), 105, 25, null, null, 'center');

        let yPos = 42;
        doc.setTextColor(...colorText);

        const drawSection = (title) => {
            doc.setFillColor(...colorGold);
            doc.rect(15, yPos - 6, 180, 8, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.text(title, 20, yPos);
            yPos += 12;
            doc.setTextColor(...colorText);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
        };

        const drawField = (label, value) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${label}:`, 20, yPos);
            const lw = doc.getTextWidth(`${label}: `);
            doc.setFont('helvetica', 'normal');
            const splitText = doc.splitTextToSize(`${value || '-'}`, 170 - lw);
            doc.text(splitText, 20 + lw, yPos);
            yPos += (splitText.length * 5) + 4;
        };

        drawSection('1. DATOS DEL ESTUDIANTE');
        drawField('Nombre', data.studentName);
        drawField('Cédula', data.idCard);
        drawField('Género', data.gender);
        drawField('Curso', `${data.grade} "${data.parallel || ''}"`);
        drawField('Edad', `${data.age} años`);
        yPos += 4;

        drawSection('2. DATOS DEL REPRESENTANTE');
        drawField('Nombre', data.guardianName);
        drawField('Parentesco', data.guardianRelation);
        drawField('Teléfono', data.guardianPhone);
        drawField('Email', data.guardianEmail);
        drawField('Contacto de emergencia', data.emergencyPhone || 'No registrado');
        yPos += 4;

        drawSection('3. INFORMACIÓN MÉDICA');
        drawField('Tipo de Sangre', data.bloodType || 'No especificado');
        drawField('Seguro Médico', data.hasInsurance ? `SÍ — ${data.insuranceType} (${data.insuranceDetail})` : 'NO');
        drawField('Alergias', data.hasAllergies ? `SÍ — ${data.allergiesDetail}` : 'NO');
        drawField('Medicación', data.hasMedication ? `SÍ — ${data.medicationDetail}` : 'NO');
        yPos += 4;

        if (yPos > 220) { doc.addPage(); yPos = 30; }

        drawSection('4. COMPROMISO Y AUTORIZACIONES');
        doc.setFontSize(9);
        const chk = (v) => v ? '[SI]' : '[NO]';
        doc.text(`${chk(data.acceptedRules)}  Normas de Convivencia`, 22, yPos); yPos += 8;
        doc.text(`${chk(data.acceptedLiability)}  Exoneración y Responsabilidad Médica`, 22, yPos); yPos += 8;
        doc.text(`${chk(data.acceptedMedia)}  Uso de Imagen para Fines Institucionales`, 22, yPos); yPos += 8;
        doc.text(`${chk(data.habeasData)}  Política de Tratamiento de Datos (Habeas Data)`, 22, yPos); yPos += 16;

        // Signature area
        yPos = Math.max(yPos, 240);
        doc.setLineWidth(0.4);
        doc.line(25, yPos, 90, yPos);
        doc.line(120, yPos, 185, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'bold');
        doc.text('Firma del Representante', 57, yPos, null, null, 'center');
        doc.text('Firma del Estudiante', 152, yPos, null, null, 'center');
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(data.guardianName || '', 57, yPos, null, null, 'center');
        doc.text(data.studentName || '', 152, yPos, null, null, 'center');

        // Footer
        doc.setTextColor(150);
        doc.setFontSize(7);
        doc.text(`Documento generado el ${new Date().toLocaleDateString()} | Imprimir y firmar físicamente`, 105, 288, null, null, 'center');

        // Upload to Firebase Storage
        const pdfBlob = doc.output('blob');
        const filename = `fichas/${data.studentName?.replace(/\s+/g, '_') || 'inscripcion'}_${Date.now()}.pdf`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, pdfBlob, { contentType: 'application/pdf' });
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // 1. Generar PDF y subir a Firebase Storage
            let pdfURL = null;
            try {
                pdfURL = await generateAndUploadPDF(data);
                console.log('PDF subido:', pdfURL);
            } catch (pdfErr) {
                console.error('Error al generar/subir PDF:', pdfErr);
                // No bloquear si el PDF falla
            }

            // 2. Guardar en Firestore
            await addDoc(collection(db, "registros"), {
                ...data,
                createdAt: serverTimestamp(),
                userAgent: navigator.userAgent
            });



            // 3. Enviar Correo (EmailJS)
            if (data.guardianEmail) {
                const templateParams = {
                    to_email: data.guardianEmail,
                    to_name: data.guardianName,
                    student_name: data.studentName,
                    message: `¡Hola ${data.guardianName}! Tu representado ${data.studentName} ha sido inscrito exitosamente en el Retiro Espiritual.`,
                    html_message: getConfirmationEmailHTML(data, pdfURL),
                    reply_to: 'metanoiiaec@gmail.com',
                };

                // NOTE: Replace PUBLIC_KEY with your actual public key
                await emailjs.send('service_a29qagj', 'template_anwz2rc', templateParams, 'cyFaYsemWSPVWLP6M');
                console.log("Correo enviado a:", data.guardianEmail);
            }

            // Mostrar vista de éxito
            setIsSuccess(true);

        } catch (error) {
            console.error("Error al guardar:", error);
            alert('Hubo un error al conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.');
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
