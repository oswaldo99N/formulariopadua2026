import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, orderBy, query, deleteDoc, doc } from '../../services/firebase';
import Swal from 'sweetalert2';

import { jsPDF } from "jspdf";

import logoPadua from '../../assets/images/logo_padua.jpg';
import logoMetanoiia from '../../assets/images/logo_metanoiia.png';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => (
    <div className="admin-sidebar">
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--color-secondary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>P</div>
            <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: '1' }}>PADUA</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7, letterSpacing: '0.1em' }}>ADMIN DASHBOARD</div>
            </div>
        </div>

        <nav className="admin-nav" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
                onClick={() => setActiveTab('dashboard')}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '12px',
                    background: activeTab === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: activeTab === 'dashboard' ? 'var(--color-secondary)' : 'rgba(255,255,255,0.7)',
                    border: 'none', textAlign: 'left', fontSize: '0.9rem', fontWeight: 500,
                    transition: 'all 0.2s'
                }}
            >
                <span>📊</span> Dashboard
            </button>
            <button
                onClick={() => setActiveTab('inscripciones')}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '12px',
                    background: activeTab === 'inscripciones' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: activeTab === 'inscripciones' ? 'var(--color-secondary)' : 'rgba(255,255,255,0.7)',
                    border: 'none', textAlign: 'left', fontSize: '0.9rem', fontWeight: 500,
                    transition: 'all 0.2s'
                }}
            >
                <span>📝</span> Inscripciones
            </button>
            <button
                onClick={() => setActiveTab('reporte')}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '12px',
                    background: activeTab === 'reporte' ? 'rgba(201,168,76,0.25)' : 'transparent',
                    color: activeTab === 'reporte' ? '#F0D07A' : 'rgba(255,255,255,0.7)',
                    border: activeTab === 'reporte' ? '1px solid rgba(201,168,76,0.4)' : 'none',
                    textAlign: 'left', fontSize: '0.9rem', fontWeight: 500,
                    transition: 'all 0.2s', cursor: 'pointer'
                }}
            >
                <span>🤖</span> Reporte IA
            </button>
        </nav>

        <button
            onClick={onLogout}
            style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px',
                background: 'rgba(200, 50, 50, 0.1)',
                color: '#ff8888',
                border: 'none', textAlign: 'left', fontSize: '0.9rem', marginBottom: '1rem',
                cursor: 'pointer'
            }}
        >
            <span>🚪</span> Cerrar Sesión
        </button>

        <div style={{ fontSize: '0.7rem', opacity: 0.4, textAlign: 'center' }}>
            v2.1.0 • Padua Admin
        </div>
    </div>
);

const StatCard = ({ title, value, icon, color, trend }) => (
    <div style={{
        background: 'var(--color-surface)',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        border: '1px solid var(--border-soft)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default'
    }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: `var(--bg-warm)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', color: `var(--color-${color || 'primary'})`
            }}>
                {icon}
            </div>
            {trend && <span style={{ fontSize: '0.75rem', color: '#10B981', background: '#DCFCE7', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>{trend}</span>}
        </div>
        <div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1.2 }}>{value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{title}</div>
        </div>
    </div>
);

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterParallel, setFilterParallel] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // AI Report State
    const [aiReport, setAiReport] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_GROQ_API_KEY || '');
    const [apiKeyVisible, setApiKeyVisible] = useState(false);
    const [reportModel, setReportModel] = useState('llama-3.3-70b-versatile');

    // Auto-load data when authenticated
    useEffect(() => {
        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    // Simple Authentication
    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin2026') {
            setIsAuthenticated(true);
            fetchData();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'Contraseña incorrecta',
                confirmButtonColor: '#C9A84C'
            });
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "registros"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRegistros(data);
        } catch (error) {
            console.error("Error fetching documents: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudieron cargar los datos. Verifica tu conexión a internet.',
                confirmButtonColor: '#C9A84C'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará el registro permanentemente y no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#C9A84C',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteDoc(doc(db, "registros", id));
                setRegistros(prev => prev.filter(item => item.id !== id));
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El registro ha sido eliminado exitosamente.',
                    confirmButtonColor: '#C9A84C',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Error removing document: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al intentar eliminar el registro.',
                    confirmButtonColor: '#C9A84C'
                });
            }
        }
    };

    const generatePDF = async (record, isBulk = false, doc = null) => {
        if (!doc) doc = new jsPDF();

        const cPrimary = [59, 35, 20];
        const cGold = [201, 168, 76];
        const cText = [40, 40, 40];
        const cMuted = [110, 110, 110];
        const cWhite = [255, 255, 255];

        // ── HEADER ────────────────────────────────────────────────
        // Full-width dark bar
        doc.setFillColor(...cPrimary);
        doc.rect(0, 0, 210, 28, 'F');

        // Right panel — gradient: café → blanco (8 strips)
        const strips = 8;
        const stripW = 48 / strips;
        const startR = 59, startG = 35, startB = 20;   // café oscuro (#3B2314)
        const endR = 255, endG = 252, endB = 245;        // blanco cálido
        for (let s = 0; s < strips; s++) {
            const t = s / (strips - 1);
            const r = Math.round(startR + (endR - startR) * t);
            const g = Math.round(startG + (endG - startG) * t);
            const b = Math.round(startB + (endB - startB) * t);
            doc.setFillColor(r, g, b);
            doc.rect(162 + s * stripW, 0, stripW + 0.5, 28, 'F');
        }

        // Gold separator line
        doc.setFillColor(...cGold);
        doc.rect(0, 28, 210, 1.5, 'F');

        // Load and draw logos
        const loadImg = (src) => new Promise((res, rej) => {
            const i = new Image(); i.src = src;
            i.onload = () => res(i); i.onerror = rej;
        });
        try {
            const [imgPadua, imgMeta] = await Promise.all([loadImg(logoPadua), loadImg(logoMetanoiia)]);
            doc.addImage(imgPadua, 'JPEG', 2, 2, 24, 24);   // left zone

            // Metanoiia — proportional, large, centered in right panel
            const mW = imgMeta.naturalWidth || imgMeta.width || 1;
            const mH = imgMeta.naturalHeight || imgMeta.height || 1;
            const maxH = 24; const maxW = 44;
            let rW = maxW, rH = maxW * mH / mW;
            if (rH > maxH) { rH = maxH; rW = maxH * mW / mH; }
            const mX = 162 + (48 - rW) / 2;
            const mY = (28 - rH) / 2;
            doc.addImage(imgMeta, 'PNG', mX, mY, rW, rH);
        } catch (e) { /* logos optional */ }

        // Title — center zone only (cols 28–162)
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...cWhite);
        doc.setFontSize(15);
        doc.text('FICHA DE INSCRIPCIÓN', 96, 12, null, null, 'center');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        const subTitle = doc.splitTextToSize(
            'RETIRO ESPIRITUAL · U.E. FISCOMISIONAL SAN ANTONIO DE PADUA & METANOIIA', 130
        );
        doc.text(subTitle, 96, 20, null, null, 'center');

        // ── HELPERS ───────────────────────────────────────────────
        let y = 36;

        const section = (title) => {
            doc.setFillColor(...cGold);
            doc.rect(10, y - 5, 190, 7, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(...cWhite);
            doc.text(title, 14, y);
            y += 8;
            doc.setTextColor(...cText);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
        };

        // Single compact field (label bold + value normal, same line)
        const field = (label, value, x, maxW) => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...cText);
            const lw = doc.getTextWidth(`${label}: `);
            doc.text(`${label}: `, x, y);
            doc.setFont('helvetica', 'normal');
            const val = String(value || '—');
            const lines = doc.splitTextToSize(val, maxW - lw);
            doc.text(lines, x + lw, y);
            return lines.length;
        };

        // Two-column row: left field + right field, then advance y by lineH
        const row2 = (lLabel, lVal, rLabel, rVal, lineH = 6) => {
            const lLines = field(lLabel, lVal, 12, 88);
            const rLines = field(rLabel, rVal, 110, 88);
            y += Math.max(lLines, rLines) * 4.5 + (lineH - 4.5);
        };

        // Single full-width field
        const row1 = (label, value, lineH = 6) => {
            const lines = field(label, value, 12, 186);
            y += lines * 4.5 + (lineH - 4.5);
        };

        const check = (v) => v ? '✔ SÍ' : '✘ NO';

        // ── 1. ESTUDIANTE ─────────────────────────────────────────
        section('1. DATOS DEL ESTUDIANTE');
        row2('Nombre', record.studentName, 'Cédula', record.idCard);
        row2('Género', record.gender, 'Edad', `${record.age} años`);
        row1('Curso', `${record.grade || ''} "${record.parallel || ''}"`);
        y += 2;

        // ── 2. REPRESENTANTE ──────────────────────────────────────
        section('2. DATOS DEL REPRESENTANTE');
        row2('Nombre', record.guardianName, 'Parentesco', record.guardianRelation);
        row2('Teléfono', record.guardianPhone, 'Email', record.guardianEmail || '—');
        row1('Emergencia', record.emergencyPhone || 'No registrado');
        y += 2;

        // ── 3. MÉDICA ─────────────────────────────────────────────
        section('3. INFORMACIÓN MÉDICA');
        row2('Tipo de Sangre', record.bloodType || 'No especificado',
            'Seguro Médico', record.hasInsurance ? `SÍ — ${record.insuranceType || ''}` : 'NO');
        if (record.hasInsurance) row1('Detalle Seguro', `${record.insuranceDetail || ''} · Tel: ${record.insuranceNumber || ''}`);
        row2('Alergias', record.hasAllergies ? `SÍ — ${record.allergiesDetail || ''}` : 'NO',
            'Medicación', record.hasMedication ? `SÍ — ${record.medicationDetail || ''}` : 'NO');
        y += 2;

        // ── 4. AUTORIZACIONES ────────────────────────────────────
        if (y > 210) { doc.addPage(); y = 20; }
        section('4. COMPROMISOS Y AUTORIZACIONES');
        doc.setFontSize(8.5);

        const auth = (label, val, desc) => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...(val ? [5, 100, 60] : [160, 30, 30]));
            doc.text(`${check(val)}  ${label}`, 14, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...cMuted);
            doc.text(desc, 18, y + 4);
            doc.setTextColor(...cText);
            y += 10;
        };

        auth('Normas de Convivencia', record.acceptedRules,
            'El estudiante y representante aceptan el reglamento del retiro.');
        auth('Exoneración y Responsabilidad Médica', record.acceptedLiability,
            'Autorizan atención médica de urgencia y exoneran de responsabilidad por pérdidas.');
        auth('Uso de Imagen para Fines Institucionales', record.acceptedMedia,
            'Autorizan el uso de fotografías y videos para fines pastorales e institucionales.');
        auth('Política de Tratamiento de Datos (Habeas Data)', record.habeasData,
            'Aceptan el tratamiento de la información para fines del retiro.');

        // ── FIRMAS ───────────────────────────────────────────────
        if (y > 250) { doc.addPage(); y = 30; }
        y = Math.max(y, 240);

        doc.setFontSize(9);
        doc.setTextColor(...cText);

        // Digital signature image
        if (record.signature) {
            try { doc.addImage(record.signature, 'PNG', 32, y - 18, 36, 16); } catch (e) { }
        }

        doc.setDrawColor(...cPrimary);
        doc.setLineWidth(0.4);
        doc.line(20, y, 90, y);
        doc.line(120, y, 190, y);
        y += 4;

        doc.setFont('helvetica', 'bold');
        doc.text('Firma del Representante', 55, y, null, null, 'center');
        doc.text('Firma del Estudiante', 155, y, null, null, 'center');
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...cMuted);
        doc.text(record.guardianName || '', 55, y, null, null, 'center');
        doc.text(record.studentName || '', 155, y, null, null, 'center');

        // ── FOOTER ───────────────────────────────────────────────
        doc.setFontSize(7);
        doc.setTextColor(170);
        const pages = doc.internal.getNumberOfPages();
        for (let p = 1; p <= pages; p++) {
            doc.setPage(p);
            doc.text(
                `Generado el ${new Date().toLocaleDateString()} · U.E. Fiscomisional San Antonio de Padua & Metanoiia · Pág ${p}/${pages}`,
                105, 292, null, null, 'center'
            );
        }

        if (!isBulk) doc.save(`Ficha_${record.studentName?.replace(/\s+/g, '_') || 'Inscripcion'}.pdf`);
        return doc;
    };



    const downloadAllPDFs = async () => {
        const doc = new jsPDF();
        for (let i = 0; i < filteredData.length; i++) {
            if (i > 0) doc.addPage();
            await generatePDF(filteredData[i], true, doc);
        }
        doc.save(`Fichas_Todas_(${filteredData.length}).pdf`);
    };

    const downloadCSV = () => {
        const headers = ["ID", "Fecha", "Estudiante", "Cédula", "Género", "Curso", "Paralelo", "Representante", "Email", "Teléfono", "Parentesco", "Seguro", "Tipo Seguro", "Alergias", "Medicación"];
        const csvRows = [headers.join(",")];

        registros.forEach(row => {
            const values = [
                row.id,
                row.createdAt?.seconds ? new Date(row.createdAt.seconds * 1000).toISOString() : '',
                `"${row.studentName || ''}"`,
                row.idCard || '',
                row.gender || 'N/A',
                row.grade || '',
                row.parallel || '',
                `"${row.guardianName || ''}"`,
                row.guardianEmail || '',
                row.guardianPhone || '',
                row.guardianRelation || '',
                row.hasInsurance ? 'Sí' : 'No',
                row.insuranceType || '',
                row.hasAllergies ? 'Sí' : 'No',
                row.hasMedication ? 'Sí' : 'No'
            ];
            csvRows.push(values.join(","));
        });

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", `inscripciones_padua_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const downloadContactsCSV = () => {
        const headers = ["Estudiante", "Representante", "Teléfono", "Email"];
        const csvRows = [headers.join(",")];

        filteredData.forEach(row => {
            const values = [
                `"${row.studentName || ''}"`,
                `"${row.guardianName || ''}"`,
                row.guardianPhone || '',
                row.guardianEmail || ''
            ];
            csvRows.push(values.join(","));
        });

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", `contactos_padua_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // ── AI REPORT ────────────────────────────────────────────
    const generateAIReport = async () => {
        if (!apiKey.trim()) {
            Swal.fire({ icon: 'warning', title: 'API Key requerida', text: 'Ingresa tu API Key de Groq para generar el reporte.', confirmButtonColor: '#C9A84C' });
            return;
        }
        if (registros.length === 0) {
            Swal.fire({ icon: 'info', title: 'Sin datos', text: 'No hay registros para analizar.', confirmButtonColor: '#C9A84C' });
            return;
        }

        setAiLoading(true);
        setAiError(null);
        setAiReport(null);

        // Construir resumen de datos para el prompt
        const totalInscritos = stats.total;
        const fechaReporte = new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });
        const primerRegistro = registros.length > 0 && registros[registros.length - 1]?.createdAt?.seconds
            ? new Date(registros[registros.length - 1].createdAt.seconds * 1000).toLocaleDateString('es-EC')
            : 'N/A';
        const ultimoRegistro = registros[0]?.createdAt?.seconds
            ? new Date(registros[0].createdAt.seconds * 1000).toLocaleDateString('es-EC')
            : 'N/A';

        const cursosList = Object.entries(stats.byCourse || {})
            .sort((a, b) => b[1] - a[1])
            .map(([c, n]) => `${c}: ${n} estudiantes (${((n / totalInscritos) * 100).toFixed(1)}%)`)
            .join(', ');

        const bloodList = Object.entries(stats.bloodTypes || {})
            .sort((a, b) => b[1] - a[1])
            .map(([t, n]) => `${t}: ${n}`)
            .join(', ');

        const insuranceList = stats.topInsurances?.map(([name, n]) => `${name}: ${n}`).join(', ') || 'Sin datos';

        const velocityDays = Object.entries(stats.velocity || {})
            .slice(-10)
            .map(([d, n]) => `${d}: ${n} insc.`)
            .join(', ');

        const allergiesDetail = registros
            .filter(r => r.hasAllergies && r.allergiesDetail)
            .map(r => r.allergiesDetail?.trim())
            .filter(Boolean)
            .join('; ') || 'No reportadas';

        const medicationDetail = registros
            .filter(r => r.hasMedication && r.medicationDetail)
            .map(r => r.medicationDetail?.trim())
            .filter(Boolean)
            .join('; ') || 'No reportados';

        const prompt = `Eres un asistente experto en gestión educativa y análisis de datos para retiros espirituales estudiantiles. Genera un REPORTE EJECUTIVO COMPLETO Y DETALLADO en español sobre el Retiro Espiritual 2026 de la Unidad Educativa Fiscomisional San Antonio de Padua (en colaboración con Metanoiia), con la siguiente información real:

═══════════════════════════════════════════
DATOS GENERALES
═══════════════════════════════════════════
- Fecha del reporte: ${fechaReporte}
- Total de inscritos: ${totalInscritos}
- Primer registro: ${primerRegistro}
- Último registro: ${ultimoRegistro}
- Hombres: ${stats.men} (${((stats.men / totalInscritos) * 100).toFixed(1)}%)
- Mujeres: ${stats.women} (${((stats.women / totalInscritos) * 100).toFixed(1)}%)
- Edad promedio: ${stats.averageAge} años

DISTRIBUCIÓN DE EDADES:
${Object.entries(stats.byAge || {}).map(([r, n]) => `  • ${r} años: ${n} estudiantes`).join('\n')}

DISTRIBUCIÓN ACADÉMICA (por curso):
${Object.entries(stats.byCourse || {}).sort((a, b) => b[1] - a[1]).map(([c, n]) => `  • ${c}: ${n} estudiantes`).join('\n')}

═══════════════════════════════════════════
SALUD Y DATOS MÉDICOS
═══════════════════════════════════════════
- Con seguro médico: ${stats.insurance} (${((stats.insurance / totalInscritos) * 100).toFixed(1)}%)
- Sin seguro médico: ${totalInscritos - stats.insurance} (${(((totalInscritos - stats.insurance) / totalInscritos) * 100).toFixed(1)}%)
- Principales aseguradoras: ${insuranceList}
- Con alergias reportadas: ${stats.allergies} (${((stats.allergies / totalInscritos) * 100).toFixed(1)}%)
  Detalle alergias: ${allergiesDetail}
- Con medicación activa: ${stats.medication} (${((stats.medication / totalInscritos) * 100).toFixed(1)}%)
  Detalle medicamentos: ${medicationDetail}
- Tipos de sangre presentes: ${bloodList}

═══════════════════════════════════════════
VELOCIDAD DE INSCRIPCIÓN (últimos registros)
═══════════════════════════════════════════
${velocityDays}

═══════════════════════════════════════════
COMPROMISOS Y AUTORIZACIONES
═══════════════════════════════════════════
- Aceptaron normas de convivencia: ${registros.filter(r => r.acceptedRules).length}/${totalInscritos}
- Autorizaron exoneración médica: ${registros.filter(r => r.acceptedLiability).length}/${totalInscritos}
- Autorizaron uso de imagen: ${registros.filter(r => r.acceptedMedia).length}/${totalInscritos}
- Aceptaron habeas data: ${registros.filter(r => r.habeasData).length}/${totalInscritos}
- Con firma digital: ${registros.filter(r => r.signature).length}/${totalInscritos}

FORMATO DE SALIDA — MUY IMPORTANTE:
- Usa ## para los títulos de cada sección (ejemplo: ## 1. RESUMEN EJECUTIVO)
- Usa **texto en negrita** para destacar datos clave, cifras importantes y términos relevantes
- Usa tablas markdown (| col | col |) cuando sea apropiado para comparar datos numéricos
- Usa listas con guión (- item) para enumeraciones y recomendaciones
- NO uses asteriscos dobles para hacer listas, solo para negritas inline
- NO repitas los datos crudos que ya tienes arriba, en cambio analízalos e interprételaos

SECCIONES REQUERIDAS:

## 1. RESUMEN EJECUTIVO
Párrafo de 4-5 líneas con los hallazgos más importantes.

## 2. ANÁLISIS DE PARTICIPACIÓN Y DEMOGRAFÍA
Análisis detallado de géneros, edades, distribución. Incluye una tabla comparativa si aplica.

## 3. ANÁLISIS ACADÉMICO POR NIVEL
Interpretación de la distribución por cursos. Tabla con ranking de participación por nivel.

## 4. INFORME MÉDICO Y DE SALUD
Análisis de alergias, medicamentos, seguros, tipos de sangre. Tabla resumen médico. Recomendaciones específicas para el personal de salud durante el retiro.

## 5. COMPROMISOS Y AUTORIZACIONES LEGALES
Análisis del nivel de cumplimiento legal y de autorizaciones.

## 6. PROYECCIÓN Y TENDENCIA DE INSCRIPCIONES
Análisis de velocidad de inscripción e interpretación de tendencias.

## 7. RECOMENDACIONES PARA EL EQUIPO ORGANIZADOR
Mínimo 6 recomendaciones concretas, específicas y accionables numeradas.

## 8. CONCLUSIÓN
Cierre profesional del reporte.

Usa un tono profesional, formal y propositivo. Sé específico con los números reales. El reporte debe ser ejecutivo, completo y accionable.`;

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey.trim()}`
                },
                body: JSON.stringify({
                    model: reportModel,
                    messages: [
                        { role: 'system', content: 'Eres un experto en análisis educativo y gestión de retiros espirituales estudiantiles. Redactas reportes formales, detallados y útiles en español.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.4,
                    max_tokens: 3000
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `HTTP ${response.status}: Error al conectar con OpenAI.`);
            }

            const data = await response.json();
            const reportText = data.choices?.[0]?.message?.content || 'No se pudo generar el reporte.';
            setAiReport({
                text: reportText,
                generatedAt: new Date().toLocaleString('es-EC'),
                total: totalInscritos,
                model: reportModel
            });
        } catch (err) {
            setAiError(err.message || 'Error desconocido al generar el reporte.');
        } finally {
            setAiLoading(false);
        }
    };

    const downloadReportPDF = async () => {
        if (!aiReport) return;
        const D = new jsPDF();
        const cPri = [59, 35, 20], cGold = [201, 168, 76], cText = [40, 40, 40];
        const cMuted = [120, 110, 100], cWhite = [255, 255, 255], cLite = [245, 240, 232];
        const M = 12, CW = 186;
        let y = 0;

        const checkPage = (need = 10) => { if (y + need > 280) { D.addPage(); y = 16; } };

        const drawHeader = () => {
            D.setFillColor(...cPri); D.rect(0, 0, 210, 30, 'F');
            D.setFillColor(...cGold); D.rect(0, 30, 210, 1.5, 'F');
            D.setFont('helvetica', 'bold'); D.setTextColor(...cWhite); D.setFontSize(13);
            D.text('REPORTE EJECUTIVO — RETIRO ESPIRITUAL 2026', 105, 13, null, null, 'center');
            D.setFont('helvetica', 'normal'); D.setFontSize(7.5);
            D.text(`Modelo: ${aiReport.model}  ·  Generado: ${aiReport.generatedAt}  ·  Total inscritos: ${aiReport.total}`, 105, 23, null, null, 'center');
        };

        const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.src = src; i.onload = () => res(i); i.onerror = rej; });
        try {
            const [imgPadua, imgMeta] = await Promise.all([loadImg(logoPadua), loadImg(logoMetanoiia)]);
            drawHeader();
            D.addImage(imgPadua, 'JPEG', 3, 3, 24, 24);
            const mW = imgMeta.naturalWidth || 1, mH = imgMeta.naturalHeight || 1;
            let rW = 44, rH = 44 * mH / mW;
            if (rH > 24) { rH = 24; rW = 24 * mW / mH; }
            D.addImage(imgMeta, 'PNG', 162 + (48 - rW) / 2, (30 - rH) / 2, rW, rH);
        } catch (e) { drawHeader(); }
        y = 40;

        // ── Helpers ──────────────────────────────────────────────
        const strip = (s) => s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/^#+\s*/, '').replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim();

        const sectionBar = (title) => {
            checkPage(14); y += 4;
            D.setFillColor(...cPri); D.rect(M, y - 6, CW, 9, 'F');
            D.setFillColor(...cGold); D.rect(M, y + 3, 28, 1.2, 'F');
            D.setFont('helvetica', 'bold'); D.setFontSize(9.5); D.setTextColor(...cWhite);
            D.text(strip(title).toUpperCase(), M + 4, y);
            D.setFont('helvetica', 'normal'); D.setTextColor(...cText);
            y += 12;
        };

        // Render one line with inline bold segments
        const renderInlinePDF = (rawText, indent = M, fsz = 8.5) => {
            if (!rawText.trim()) { y += 2; return; }
            const segs = rawText.split(/\*\*(.*?)\*\*/g);
            // Build flat word list with bold flag for wrapping
            let curX = indent;
            const maxX = M + CW;
            D.setFontSize(fsz);
            segs.forEach((seg, si) => {
                if (!seg) return;
                const bold = si % 2 === 1;
                D.setFont('helvetica', bold ? 'bold' : 'normal');
                if (bold) { D.setTextColor(...cPri); } else { D.setTextColor(...cText); }
                const words = seg.split(' ');
                words.forEach((word, wi) => {
                    if (!word && wi > 0) return;
                    const w = D.getTextWidth(word + ' ');
                    if (curX + w > maxX && curX > indent) {
                        y += fsz * 0.45 + 1.5;
                        checkPage(fsz * 0.45 + 2);
                        curX = indent;
                    }
                    D.text(word + (wi < words.length - 1 ? ' ' : ''), curX, y);
                    curX += w;
                });
            });
            D.setFont('helvetica', 'normal'); D.setTextColor(...cText);
            y += fsz * 0.45 + 2.5;
        };

        const bulletPDF = (rawText) => {
            checkPage(8);
            D.setFillColor(...cGold); D.circle(M + 3, y - 1.2, 1, 'F');
            renderInlinePDF(rawText, M + 7);
        };

        const numberedPDF = (num, rawText) => {
            checkPage(8);
            D.setFont('helvetica', 'bold'); D.setFontSize(8.5); D.setTextColor(...cGold);
            D.text(`${num}.`, M + 1, y);
            D.setFont('helvetica', 'normal'); D.setTextColor(...cText);
            renderInlinePDF(rawText, M + 8);
        };

        const renderTablePDF = (rows) => {
            if (!rows.length) return;
            const cols = rows[0].length;
            const cw = CW / cols;
            rows.forEach((row, ri) => {
                checkPage(9);
                if (ri === 0) {
                    D.setFillColor(...cPri); D.rect(M, y - 5.5, CW, 8, 'F');
                    D.setFont('helvetica', 'bold'); D.setFontSize(8); D.setTextColor(...cWhite);
                } else {
                    if (ri % 2 === 0) { D.setFillColor(...cLite); } else { D.setFillColor(255, 255, 255); }
                    D.rect(M, y - 5.5, CW, 8, 'F');
                    D.setFont('helvetica', 'normal'); D.setFontSize(8); D.setTextColor(...cText);
                }
                row.forEach((cell, ci) => {
                    const maxCW = cw - 3;
                    const cellText = strip(cell).substring(0, Math.floor(maxCW / 1.9));
                    D.text(cellText, M + ci * cw + 2, y);
                });
                y += 7;
                if (ri === 0) { D.setDrawColor(...cGold); D.setLineWidth(0.4); D.line(M, y - 1, M + CW, y - 1); }
            });
            D.setDrawColor(...cMuted); D.setLineWidth(0.2);
            D.rect(M, y - rows.length * 7 - 2, CW, rows.length * 7 + 2, 'S');
            D.setDrawColor(0); y += 5;
        };

        // ── Parse & Render Report ─────────────────────────────────
        const rawLines = aiReport.text.split('\n');
        let li = 0;
        while (li < rawLines.length) {
            const line = rawLines[li];
            const tr = line.trim();

            if (/^#{1,3}\s/.test(tr)) { sectionBar(tr); li++; continue; }
            if (!tr) { y += 2; li++; continue; }
            if (tr.startsWith('|')) {
                const tbl = [];
                while (li < rawLines.length && rawLines[li].trim().startsWith('|')) {
                    const tl = rawLines[li].trim();
                    if (!tl.match(/^\|[-|\s]+\|$/)) tbl.push(tl.replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
                    li++;
                }
                renderTablePDF(tbl);
                continue;
            }
            if (/^[-*•]\s/.test(tr)) { bulletPDF(tr.replace(/^[-*•]\s*/, '')); li++; continue; }
            const nm = tr.match(/^(\d+)\.\s+(.+)/);
            if (nm) { numberedPDF(nm[1], nm[2]); li++; continue; }
            renderInlinePDF(tr);
            li++;
        }

        // ── Participants Table ────────────────────────────────────
        checkPage(20); y += 6;
        sectionBar('LISTA COMPLETA DE PARTICIPANTES');

        D.setFontSize(8); D.setTextColor(...cMuted);
        D.text(`Total: ${registros.length}  ·  Hombres: ${stats.men}  ·  Mujeres: ${stats.women}  ·  Con seguro: ${stats.insurance}  ·  Con alergias: ${stats.allergies}  ·  Con medicación: ${stats.medication}`, M, y);
        y += 8;

        const pCols = ['#', 'Nombre del Estudiante', 'Cédula', 'Curso', 'G', 'Representante / Tel.', 'Salud'];
        const pW = [7, 50, 22, 22, 6, 58, 21];

        const drawTableHeader = () => {
            D.setFillColor(...cPri); D.rect(M, y - 5.5, CW, 8, 'F');
            D.setFont('helvetica', 'bold'); D.setFontSize(7.5); D.setTextColor(...cWhite);
            let px = M + 1;
            pCols.forEach((h, hi) => { D.text(h, px, y); px += pW[hi]; });
            y += 7;
            D.setFont('helvetica', 'normal'); D.setFontSize(7.5); D.setTextColor(...cText);
        };
        drawTableHeader();

        [...registros].sort((a, b) => (a.studentName || '').localeCompare(b.studentName || '')).forEach((r, idx) => {
            if (y > 278) { D.addPage(); y = 16; drawTableHeader(); }
            if (idx % 2 === 0) { D.setFillColor(252, 250, 246); } else { D.setFillColor(255, 255, 255); }
            D.rect(M, y - 5, CW, 7, 'F');
            const health = [r.hasInsurance ? `Seg` : '', r.hasAllergies ? 'Alergia' : '', r.hasMedication ? 'Medic.' : '', r.bloodType || ''].filter(Boolean).join(', ');
            const row = [String(idx + 1), (r.studentName || '').substring(0, 26), r.idCard || '', `${r.grade || ''} "${r.parallel || ''}"`, r.gender === 'Masculino' ? 'M' : 'F', `${(r.guardianName || '').substring(0, 20)}  ${r.guardianPhone || ''}`, health];
            D.setTextColor(...cText);
            let px = M + 1;
            row.forEach((v, vi) => { D.text(v, px, y); px += pW[vi]; });
            D.setDrawColor(238, 232, 220); D.setLineWidth(0.1); D.line(M, y + 2, M + CW, y + 2);
            y += 7;
        });

        const pages = D.internal.getNumberOfPages();
        for (let p = 1; p <= pages; p++) {
            D.setPage(p);
            D.setFontSize(6.5); D.setTextColor(170);
            D.text(`Reporte Ejecutivo · Retiro Espiritual 2026 · U.E. Fiscomisional San Antonio de Padua & Metanoiia · Pág ${p} / ${pages}`, 105, 293, null, null, 'center');
        }
        D.save(`Reporte_Retiro_Espiritual_2026_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // ── Markdown helpers (pantalla) ──────────────────────────
    const renderInlineMd = (text, keyPfx = '') =>
        text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
            i % 2 === 1
                ? <strong key={`${keyPfx}-b${i}`} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{part}</strong>
                : part
        );

    const parseReportBlocks = (text) => {
        const lines = text.split('\n');
        const blocks = [];
        let i = 0;
        while (i < lines.length) {
            const tr = lines[i].trim();
            if (/^#{1,3}\s/.test(tr)) { blocks.push({ type: 'header', text: tr.replace(/^#+\s*/, '') }); i++; continue; }
            if (!tr) { blocks.push({ type: 'spacer' }); i++; continue; }
            if (tr.startsWith('|')) {
                const rows = [];
                while (i < lines.length && lines[i].trim().startsWith('|')) {
                    const tl = lines[i].trim();
                    if (!tl.match(/^\|[-|\s]+\|$/)) rows.push(tl.replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
                    i++;
                }
                blocks.push({ type: 'table', rows }); continue;
            }
            if (/^[-*•]\s/.test(tr)) { blocks.push({ type: 'bullet', text: tr.replace(/^[-*•]\s*/, '') }); i++; continue; }
            const nm = tr.match(/^(\d+)\.\s+(.+)/);
            if (nm) { blocks.push({ type: 'numbered', num: nm[1], text: nm[2] }); i++; continue; }
            blocks.push({ type: 'paragraph', text: tr }); i++;
        }
        return blocks;
    };

    const filteredData = registros.filter(item => {
        const searchLower = searchTerm.toLowerCase();

        // Search in Name, ID, or Phone
        const matchName = item.studentName?.toLowerCase().includes(searchLower) || '';
        const matchId = item.idCard?.includes(searchTerm) || '';
        const matchPhone = item.guardianPhone?.includes(searchTerm) || '';

        // Specific Filters
        const matchCourse = filterCourse ? item.grade === filterCourse : true;
        const matchGender = filterGender ? item.gender === filterGender : true;
        const matchParallel = filterParallel ? item.parallel === filterParallel : true;

        let matchDate = true;
        if (filterDate && item.createdAt?.seconds) {
            const recordDate = new Date(item.createdAt.seconds * 1000).toISOString().split('T')[0];
            matchDate = recordDate === filterDate;
        }

        return (matchName || matchId || matchPhone) && matchCourse && matchGender && matchParallel && matchDate;
    });

    // Statistics Calculation
    const stats = React.useMemo(() => {
        const total = registros.length;
        if (total === 0) return { total: 0, men: 0, women: 0, allergies: 0, medication: 0, insurance: 0, velocity: {}, averageAge: 0, byAge: {}, byCourse: {}, topInsurances: [], bloodTypes: {} };

        let men = 0, women = 0, allergies = 0, medication = 0, insurance = 0;
        let sumAge = 0;
        const byCourse = {};
        const byAge = {};
        const bloodTypes = {};
        const insurances = {};
        const velocity = {};

        registros.forEach(r => {
            // Count Gender
            if (r.gender === 'Masculino') men++;
            else if (r.gender === 'Femenino') women++;

            // Health
            if (r.hasAllergies) allergies++;
            if (r.hasMedication) medication++;
            if (r.hasInsurance) {
                insurance++;
                const type = r.insuranceType?.trim() || 'No especificado';
                insurances[type] = (insurances[type] || 0) + 1;
            }

            // Course
            const course = r.grade || 'Sin Asignar';
            byCourse[course] = (byCourse[course] || 0) + 1;

            // Age
            if (r.age) {
                const age = parseInt(r.age);
                if (!isNaN(age)) {
                    sumAge += age;
                    const range = age < 12 ? '<12' : age <= 14 ? '12-14' : age <= 16 ? '15-16' : '17+';
                    byAge[range] = (byAge[range] || 0) + 1;
                }
            }

            // Blood Type
            if (r.bloodType) {
                bloodTypes[r.bloodType] = (bloodTypes[r.bloodType] || 0) + 1;
            }

            // Velocity (Registrations per day)
            if (r.createdAt?.seconds) {
                const date = new Date(r.createdAt.seconds * 1000).toISOString().split('T')[0];
                velocity[date] = (velocity[date] || 0) + 1;
            }
        });

        const topInsurances = Object.entries(insurances)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        const averageAge = total > 0 && sumAge > 0 ? (sumAge / total).toFixed(1) : 0;

        // Sort Velocity by date
        const sortedVelocity = Object.keys(velocity).sort().reduce((obj, key) => {
            obj[key] = velocity[key];
            return obj;
        }, {});

        return {
            total, men, women, allergies, medication, insurance,
            byCourse, byAge, bloodTypes, topInsurances, velocity: sortedVelocity, averageAge
        };
    }, [registros]);

    if (!isAuthenticated) {
        return (
            <div style={{
                height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-warm)', flexDirection: 'column', gap: '20px'
            }}>
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Acceso Administrativo</h2>
                    <form onSubmit={handleLogin} style={{ display: 'grid', gap: '15px' }}>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                        />
                        <button className="btn-primary" type="submit" style={{ justifyContent: 'center' }}>
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsAuthenticated(false)} />

            <main className="admin-main">
                <div className="admin-header">
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
                            {activeTab === 'dashboard' ? 'Panel General' : activeTab === 'inscripciones' ? 'Gestión de Inscripciones' : 'Reporte Inteligente IA'}
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                            {activeTab === 'dashboard' ? 'Resumen estadístico del retiro 2026.' : activeTab === 'inscripciones' ? 'Administra y exporta los registros de estudiantes.' : 'Genera un reporte ejecutivo completo con análisis de IA.'}
                        </p>
                    </div>
                    <div className="admin-header-actions">
                        <button onClick={downloadAllPDFs} className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.9rem', boxShadow: 'var(--shadow-lg)' }}>
                            📄 Descargar Fichas (PDF)
                        </button>
                        <button onClick={downloadCSV} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.9rem', background: '#fff' }}>
                            📥 Exportar CSV
                        </button>
                        <button onClick={downloadContactsCSV} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.9rem', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
                            📞 Exportar Contactos
                        </button>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        {/* Statistics Cards Main */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <StatCard title="Total Inscritos" value={stats.total} icon="👥" color="primary" trend={`${stats.velocity?.[new Date().toISOString().split('T')[0]] || 0} hoy`} />
                            <StatCard title="Hombres" value={stats.men} icon="👨" color="padua-brown" />
                            <StatCard title="Mujeres" value={stats.women} icon="👩" color="padua-gold" />
                            <StatCard title="Con Seguro" value={`${stats.insurance}`} icon="🛡️" color="metanoiia-teal" />
                        </div>

                        {/* ADVANCED STATS GRID */}
                        <div className="admin-stats-grid">

                            {/* 1. Velocity Chart (Registros por Día) */}
                            <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    📈 Velocidad de Inscripción <span style={{ fontSize: '0.8em', color: 'var(--color-text-light)', fontWeight: '400' }}>(Últimos 7 días)</span>
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', paddingTop: '20px' }}>
                                    {Object.entries(stats.velocity || {}).slice(-7).map(([date, count]) => (
                                        <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>{count}</div>
                                            <div style={{
                                                width: '100%',
                                                height: `${Math.min((count / (Math.max(...Object.values(stats.velocity)) || 1)) * 100, 100)}%`,
                                                background: 'var(--color-padua-gold)',
                                                borderRadius: '6px 6px 0 0',
                                                opacity: 0.8,
                                                minHeight: '4px'
                                            }} />
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)', transform: 'rotate(-45deg)', transformOrigin: 'left top', whiteSpace: 'nowrap', marginTop: '4px' }}>
                                                {new Date(date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Age Distribution */}
                            <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    🎂 Distribución de Edad
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-padua-brown)', lineHeight: 1 }}>{stats.averageAge || 0}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Edad Promedio</div>
                                    </div>
                                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {Object.entries(stats.byAge || {}).map(([range, count]) => (
                                            <div key={range} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                                                <div style={{ width: '60px', color: 'var(--color-text-muted)' }}>{range}</div>
                                                <div style={{ flex: 1, height: '8px', background: 'var(--bg-dashboard)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${(count / stats.total) * 100}%`, background: 'var(--color-padua-brown)', borderRadius: '4px' }} />
                                                </div>
                                                <div style={{ width: '30px', textAlign: 'right', fontWeight: 600 }}>{count}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ROW 3: Detailed Breakdowns */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                            {/* 3. Academic Distribution (Courses) */}
                            <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', gridColumn: 'span 2' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>📚 Distribución Académica</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '8px', alignItems: 'end', height: '160px' }}>
                                    {Object.entries(stats.byCourse || {}).map(([course, count]) => {
                                        const percent = (count / stats.total) * 100;
                                        return (
                                            <div key={course} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>{count}</div>
                                                <div style={{
                                                    width: '100%', maxWidth: '40px',
                                                    height: `${Math.max(percent, 5)}%`,
                                                    background: 'var(--color-secondary)',
                                                    borderRadius: '4px 4px 0 0',
                                                    opacity: 0.8
                                                }} />
                                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '6px', textAlign: 'center', lineHeight: 1.1 }}>
                                                    {course.replace('Bachillerato', 'B').replace('EGB', '')}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. Top Insurances */}
                            <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', color: 'var(--color-primary)' }}>🏥 Aseguradoras Top</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {stats.topInsurances?.length > 0 ? stats.topInsurances.map(([name, count], idx) => (
                                        <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-dashboard)', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '24px', height: '24px', background: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>{idx + 1}</div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{name || 'No especificado'}</span>
                                            </div>
                                            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{count}</span>
                                        </div>
                                    )) : <div style={{ color: 'var(--color-text-light)', fontStyle: 'italic' }}>No hay datos de seguros.</div>}
                                </div>
                            </div>

                            {/* 4. Blood Types Pie-ish */}
                            <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', color: 'var(--color-primary)' }}>🩸 Tipos de Sangre</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {Object.entries(stats.bloodTypes || {}).map(([type, count]) => (
                                        <div key={type} style={{
                                            padding: '8px 16px', borderRadius: '20px',
                                            background: type.includes('+') ? '#FEF2F2' : '#EFF6FF',
                                            border: `1px solid ${type.includes('+') ? '#FECACA' : '#BFDBFE'}`,
                                            display: 'flex', flexDirection: 'column', alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: type.includes('+') ? '#DC2626' : '#2563EB' }}>{type}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{count} est.</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* 5. Health Summary (Restyled) */}
                        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ background: '#FFF7ED', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FED7AA' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#D97706', fontFamily: 'var(--font-mono)' }}>{stats.allergies}</div>
                                <div style={{ fontSize: '0.9rem', color: '#9A3412', fontWeight: 600 }}>⚠️ Alergias Reportadas</div>
                                <div style={{ fontSize: '0.8rem', color: '#C2410C', marginTop: '4px' }}>{((stats.allergies / stats.total) * 100).toFixed(1)}% del total</div>
                            </div>
                            <div style={{ background: '#FEF2F2', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FECACA' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#DC2626', fontFamily: 'var(--font-mono)' }}>{stats.medication}</div>
                                <div style={{ fontSize: '0.9rem', color: '#991B1B', fontWeight: 600 }}>💊 Tratamientos Activos</div>
                                <div style={{ fontSize: '0.8rem', color: '#B91C1C', marginTop: '4px' }}>{((stats.medication / stats.total) * 100).toFixed(1)}% del total</div>
                            </div>
                        </div>

                    </div>
                )}

                {activeTab === 'inscripciones' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        {/* Filters Toolbar */}
                        <div className="admin-filters">
                            <div style={{ flex: 1, position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%', padding: '10px 10px 10px 36px', border: '1px solid var(--border-soft)', borderRadius: '8px',
                                        background: 'var(--bg-dashboard)', fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                            <select
                                value={filterCourse}
                                onChange={(e) => setFilterCourse(e.target.value)}
                                style={{ width: '150px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontSize: '0.9rem' }}
                            >
                                <option value="">Curso: Todos</option>
                                <option value="8vo">8vo EGB</option>
                                <option value="9no">9no EGB</option>
                                <option value="10mo">10mo EGB</option>
                                <option value="1ro_bach">1ro Bach</option>
                                <option value="2do_bach">2do Bach</option>
                                <option value="3ro_bach">3ro Bach</option>
                            </select>
                            <select
                                value={filterParallel}
                                onChange={(e) => setFilterParallel(e.target.value)}
                                style={{ width: '120px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontSize: '0.9rem' }}
                            >
                                <option value="">Paralelo</option>
                                {['A', 'B', 'C', 'D', 'E', 'F'].map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            <select
                                value={filterGender}
                                onChange={(e) => setFilterGender(e.target.value)}
                                style={{ width: '140px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontSize: '0.9rem' }}
                            >
                                <option value="">Género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                style={{ width: 'auto', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontSize: '0.9rem' }}
                            />
                            <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, background: 'var(--bg-dashboard)', padding: '5px 10px', borderRadius: '6px' }}>
                                {filteredData.length} registros
                            </div>
                        </div>

                        {/* Data Table */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border-soft)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--bg-dashboard)', borderBottom: '1px solid var(--border-soft)' }}>
                                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Fecha</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Estudiante</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>ID & Estado</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Curso</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Email</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Contacto</th>
                                            <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Cargando datos...</td></tr>
                                        ) : filteredData.length === 0 ? (
                                            <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No se encontraron registros.</td></tr>
                                        ) : (
                                            filteredData.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    style={{ borderBottom: '1px solid var(--border-soft)', transition: 'background 0.1s' }}
                                                    className="hover:bg-slate-50"
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-dashboard)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                                                        {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>{item.studentName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '2px' }}>
                                                            {item.gender === 'Masculino' ? '♂ Masculino' : item.gender === 'Femenino' ? '♀ Femenino' : ''}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.idCard}</div>
                                                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                                            {item.hasInsurance && <span title="Seguro" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>}
                                                            {item.hasAllergies && <span title="Alergias" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></span>}
                                                            {item.hasMedication && <span title="Medicación" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></span>}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span style={{
                                                            background: 'var(--bg-dashboard)', padding: '4px 8px', borderRadius: '6px',
                                                            fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--border-soft)'
                                                        }}>
                                                            {item.grade} <span style={{ color: 'var(--color-secondary)' }}>"{item.parallel}"</span>
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', color: 'var(--color-text-light)', fontSize: '0.8rem' }}>
                                                        {item.guardianEmail || '-'}
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <div style={{ fontSize: '0.85rem' }}>{item.guardianPhone}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{item.guardianName}</div>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setSelectedRecord(item); }}
                                                                style={{
                                                                    padding: '6px', borderRadius: '6px', border: '1px solid var(--border-soft)',
                                                                    background: '#fff', cursor: 'pointer', color: 'var(--color-text-muted)'
                                                                }}
                                                                title="Ver Detalles"
                                                            >
                                                                👁️
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); generatePDF(item); }}
                                                                style={{
                                                                    padding: '6px', borderRadius: '6px', border: '1px solid var(--color-padua-gold)',
                                                                    background: '#fff', cursor: 'pointer', color: 'var(--color-padua-gold)'
                                                                }}
                                                                title="Descargar PDF"
                                                            >
                                                                📄
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                                                style={{
                                                                    padding: '6px', borderRadius: '6px', border: '1px solid #FECACA',
                                                                    background: '#FEF2F2', cursor: 'pointer', color: '#DC2626'
                                                                }}
                                                                title="Eliminar Registro"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══ TAB: REPORTE IA ═══════════════════════════════ */}
                {activeTab === 'reporte' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>

                        {/* Configuración */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                                🤖 Generador de Reporte con Inteligencia Artificial
                            </h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.92rem', lineHeight: 1.6 }}>
                                Genera un reporte ejecutivo completo y detallado analizando todos los <strong>{registros.length} inscritos</strong> del Retiro Espiritual 2026.
                                El análisis incluye demografía, datos médicos, tendencias de inscripción y recomendaciones para el equipo organizador.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'flex-end', marginBottom: '8px' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        API Key de Groq
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={apiKeyVisible ? 'text' : 'password'}
                                            placeholder="gsk_..."
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            style={{ width: '100%', padding: '10px 44px 10px 12px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontSize: '0.9rem', fontFamily: 'monospace', background: '#FAFAFA', boxSizing: 'border-box' }}
                                        />
                                        <button onClick={() => setApiKeyVisible(!apiKeyVisible)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.5 }}>
                                            {apiKeyVisible ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                        Conectado a <strong>Groq AI</strong> — ultra rápido, gratis. La key se usa directamente desde tu navegador.
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Modelo
                                    </label>
                                    <select value={reportModel} onChange={(e) => setReportModel(e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontSize: '0.9rem', background: '#FAFAFA' }}>
                                        <option value="llama-3.3-70b-versatile">Llama 3.3 70B (recomendado)</option>
                                        <option value="llama-3.1-8b-instant">Llama 3.1 8B (ultra rápido)</option>
                                        <option value="llama3-70b-8192">Llama 3 70B</option>
                                        <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                                        <option value="gemma2-9b-it">Gemma 2 9B</option>
                                    </select>
                                </div>

                                <button
                                    onClick={generateAIReport}
                                    disabled={aiLoading}
                                    style={{
                                        padding: '10px 28px', borderRadius: '10px',
                                        background: aiLoading ? '#9CA3AF' : 'linear-gradient(135deg, var(--color-primary), #7C3F1E)',
                                        color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.95rem',
                                        cursor: aiLoading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                                        boxShadow: aiLoading ? 'none' : '0 4px 15px rgba(59,35,20,0.4)',
                                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
                                    }}
                                >
                                    {aiLoading ? (
                                        <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Analizando...</>
                                    ) : (
                                        <><span>✨</span> Generar Reporte IA</>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Loading */}
                        {aiLoading && (
                            <div style={{ background: '#fff', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center', border: '1px solid var(--border-soft)', marginBottom: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 2s linear infinite', display: 'inline-block' }}>🤖</div>
                                <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Analizando {registros.length} registros...</h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>La IA está procesando todos los datos del retiro. Esto puede tomar unos segundos.</p>
                                <div style={{ width: '200px', height: '4px', background: 'var(--bg-dashboard)', borderRadius: '4px', margin: '1.5rem auto 0', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: 'var(--color-padua-gold)', borderRadius: '4px', animation: 'loadingBar 1.5s ease-in-out infinite' }} />
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {aiError && !aiLoading && (
                            <div style={{ background: '#FEF2F2', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '2rem', border: '1px solid #FECACA', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.4rem' }}>❌</span>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#991B1B', marginBottom: '4px' }}>Error al generar el reporte</div>
                                    <div style={{ color: '#7F1D1D', fontSize: '0.9rem' }}>{aiError}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '8px' }}>Verifica que tu API Key de Groq sea válida en console.groq.com</div>
                                </div>
                            </div>
                        )}

                        {/* Reporte Generado */}
                        {aiReport && !aiLoading && (
                            <>
                                {/* Barra de acciones del reporte */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)' }} />
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                            Reporte generado — <strong>{aiReport.model}</strong> · {aiReport.generatedAt} · {aiReport.total} participantes
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={downloadReportPDF} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            📄 Descargar PDF Completo
                                        </button>
                                        <button onClick={() => { setAiReport(null); setAiError(null); }} className="btn-secondary" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>
                                            🔄 Nuevo Reporte
                                        </button>
                                    </div>
                                </div>

                                {/* Texto del reporte */}
                                <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
                                    <div style={{ borderBottom: '2px solid var(--color-padua-gold)', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.8rem' }}>📋</span>
                                        <div>
                                            <h2 style={{ margin: 0, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>Reporte Ejecutivo — Retiro Espiritual 2026</h2>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>U.E. Fiscomisional San Antonio de Padua & Metanoiia</p>
                                        </div>
                                    </div>

                                    <div style={{ lineHeight: '1.75', color: 'var(--color-text)', fontSize: '0.92rem' }}>
                                        {parseReportBlocks(aiReport.text).map((block, idx) => {
                                            if (block.type === 'spacer') return <div key={idx} style={{ height: '6px' }} />;

                                            if (block.type === 'header') return (
                                                <div key={idx} style={{ marginTop: '2.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0' }}>
                                                    <div style={{ width: '4px', alignSelf: 'stretch', background: 'var(--color-padua-gold)', borderRadius: '4px', flexShrink: 0, marginRight: '12px' }} />
                                                    <div style={{ flex: 1, padding: '10px 18px', background: 'linear-gradient(90deg, var(--color-primary) 0%, #6B3219 100%)', borderRadius: '8px', color: '#fff', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                                        {block.text}
                                                    </div>
                                                </div>
                                            );

                                            if (block.type === 'bullet') return (
                                                <div key={idx} style={{ display: 'flex', gap: '10px', paddingLeft: '8px', marginBottom: '6px', alignItems: 'flex-start' }}>
                                                    <span style={{ color: 'var(--color-padua-gold)', fontWeight: 900, fontSize: '1rem', flexShrink: 0, marginTop: '1px' }}>▸</span>
                                                    <span>{renderInlineMd(block.text, `b${idx}`)}</span>
                                                </div>
                                            );

                                            if (block.type === 'numbered') return (
                                                <div key={idx} style={{ display: 'flex', gap: '12px', paddingLeft: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                                                    <span style={{ minWidth: '26px', height: '26px', background: 'var(--color-primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0, marginTop: '1px' }}>{block.num}</span>
                                                    <span style={{ paddingTop: '3px' }}>{renderInlineMd(block.text, `n${idx}`)}</span>
                                                </div>
                                            );

                                            if (block.type === 'table') return (
                                                <div key={idx} style={{ overflowX: 'auto', margin: '1rem 0', borderRadius: '10px', border: '1px solid var(--border-soft)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                                        <tbody>
                                                            {block.rows.map((row, ri) => (
                                                                <tr key={ri} style={{ background: ri === 0 ? 'var(--color-primary)' : ri % 2 === 0 ? '#FDFAF5' : '#fff', borderBottom: '1px solid var(--border-soft)' }}>
                                                                    {row.map((cell, ci) => (
                                                                        ri === 0
                                                                            ? <th key={ci} style={{ padding: '10px 14px', textAlign: 'left', color: '#fff', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{cell.replace(/\*\*/g, '')}</th>
                                                                            : <td key={ci} style={{ padding: '8px 14px', color: 'var(--color-text)' }}>{renderInlineMd(cell, `t${idx}-${ri}-${ci}`)}</td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );

                                            // paragraph
                                            return (
                                                <p key={idx} style={{ marginBottom: '8px', marginTop: 0 }}>{renderInlineMd(block.text, `p${idx}`)}</p>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Lista de Participantes */}
                                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border-soft)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-warm)' }}>
                                        <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            👥 Lista de Participantes <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', background: 'var(--bg-dashboard)', padding: '2px 10px', borderRadius: '12px' }}>{registros.length} inscritos</span>
                                        </h3>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Ordenado alfabéticamente</span>
                                    </div>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                                            <thead>
                                                <tr style={{ background: 'var(--bg-dashboard)' }}>
                                                    {['#', 'Estudiante', 'Cédula', 'Curso', 'Género', 'Representante', 'Teléfono', 'Email', 'Salud'].map(h => (
                                                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...registros]
                                                    .sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''))
                                                    .map((item, idx) => (
                                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border-soft)', background: idx % 2 === 0 ? '#fff' : 'var(--bg-warm)' }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#FFF8ED'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : 'var(--bg-warm)'}
                                                        >
                                                            <td style={{ padding: '8px 14px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{idx + 1}</td>
                                                            <td style={{ padding: '8px 14px' }}>
                                                                <div style={{ fontWeight: 600 }}>{item.studentName}</div>
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{item.age} años</div>
                                                            </td>
                                                            <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.idCard}</td>
                                                            <td style={{ padding: '8px 14px' }}>
                                                                <span style={{ background: 'var(--bg-dashboard)', padding: '3px 8px', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', border: '1px solid var(--border-soft)', whiteSpace: 'nowrap' }}>
                                                                    {item.grade} <span style={{ color: 'var(--color-secondary)' }}>"{item.parallel}"</span>
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: '8px 14px' }}>
                                                                <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600, background: item.gender === 'Masculino' ? '#EFF6FF' : '#FDF2F8', color: item.gender === 'Masculino' ? '#2563EB' : '#9D174D' }}>
                                                                    {item.gender === 'Masculino' ? '♂ M' : '♀ F'}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: '8px 14px' }}>
                                                                <div>{item.guardianName}</div>
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{item.guardianRelation}</div>
                                                            </td>
                                                            <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.guardianPhone}</td>
                                                            <td style={{ padding: '8px 14px', fontSize: '0.78rem', color: 'var(--color-text-light)' }}>{item.guardianEmail || '-'}</td>
                                                            <td style={{ padding: '8px 14px' }}>
                                                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                                    {item.hasInsurance && <span title={`Seguro: ${item.insuranceType}`} style={{ padding: '2px 6px', background: '#DCFCE7', color: '#15803D', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}>🛡️</span>}
                                                                    {item.hasAllergies && <span title={item.allergiesDetail} style={{ padding: '2px 6px', background: '#FEF3C7', color: '#D97706', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}>⚠️</span>}
                                                                    {item.hasMedication && <span title={item.medicationDetail} style={{ padding: '2px 6px', background: '#FEE2E2', color: '#DC2626', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}>💊</span>}
                                                                    {item.bloodType && <span style={{ padding: '2px 6px', background: '#FEE2E2', color: '#DC2626', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>{item.bloodType}</span>}
                                                                    {!item.hasInsurance && !item.hasAllergies && !item.hasMedication && <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>—</span>}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Estado vacío — sin reporte generado aún */}
                        {!aiReport && !aiLoading && !aiError && (
                            <div style={{ background: '#fff', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center', border: '2px dashed var(--border-soft)' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
                                <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Reporte Inteligente</h3>
                                <p style={{ color: 'var(--color-text-muted)', maxWidth: '440px', margin: '0 auto', fontSize: '0.92rem', lineHeight: 1.6 }}>
                                    Ingresa tu API Key de OpenAI arriba y presiona <strong>"Generar Reporte IA"</strong> para obtener un análisis completo y detallado de todas las inscripciones del retiro.
                                </p>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    {['📊 Análisis demográfico', '🏥 Informe médico', '📚 Distribución académica', '✅ Estado de autorizaciones', '💡 Recomendaciones', '👥 Lista de participantes'].map(f => (
                                        <span key={f} style={{ padding: '6px 14px', background: 'var(--bg-warm)', borderRadius: '20px', fontSize: '0.82rem', color: 'var(--color-text-muted)', border: '1px solid var(--border-soft)' }}>{f}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Detail Modal */}
                {selectedRecord && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, backdropFilter: 'blur(4px)', padding: '20px'
                    }} onClick={() => setSelectedRecord(null)}>
                        <div style={{
                            background: '#fff', width: '100%', maxWidth: '800px', borderRadius: '24px',
                            boxShadow: 'var(--shadow-soft)', overflow: 'hidden',
                            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
                            animation: 'fadeIn 0.2s ease-out'
                        }} onClick={(e) => e.stopPropagation()}>

                            {/* Modal Header */}
                            <div style={{
                                padding: '24px 32px', borderBottom: '1px solid var(--border-soft)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                background: 'var(--bg-warm)'
                            }}>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>
                                        {selectedRecord.studentName}
                                    </h3>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                        ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedRecord.id}</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedRecord(null)} style={{ background: 'rgba(0,0,0,0.05)', width: '36px', height: '36px', borderRadius: '50%', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                            </div>

                            {/* Modal Content */}
                            <div style={{ padding: '32px', overflowY: 'auto' }}>
                                <div className="admin-grid-2">
                                    <div>
                                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-light)', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 700 }}>Información Personal</h4>
                                        <div style={{ display: 'grid', gap: '12px', fontSize: '0.95rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-soft)', paddingBottom: '4px' }}>
                                                <span style={{ color: 'var(--color-text-muted)' }}>Cédula</span>
                                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{selectedRecord.idCard}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-soft)', paddingBottom: '4px' }}>
                                                <span style={{ color: 'var(--color-text-muted)' }}>Edad</span>
                                                <span>{selectedRecord.age} años</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-soft)', paddingBottom: '4px' }}>
                                                <span style={{ color: 'var(--color-text-muted)' }}>Género</span>
                                                <span>{selectedRecord.gender}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-soft)', paddingBottom: '4px' }}>
                                                <span style={{ color: 'var(--color-text-muted)' }}>Curso</span>
                                                <span>{selectedRecord.grade} "{selectedRecord.parallel}"</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-light)', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 700 }}>Representante</h4>
                                        <div style={{ display: 'grid', gap: '12px', fontSize: '0.95rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-soft)', paddingBottom: '4px' }}>
                                                <span style={{ color: 'var(--color-text-muted)' }}>Nombre</span>
                                                <span style={{ textAlign: 'right' }}>{selectedRecord.guardianName}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-soft)', paddingBottom: '4px' }}>
                                                <span style={{ color: 'var(--color-text-muted)' }}>Email</span>
                                                <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedRecord.guardianEmail || '-'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-soft)', paddingBottom: '4px' }}>
                                                <span style={{ color: 'var(--color-text-muted)' }}>Parentesco</span>
                                                <span>{selectedRecord.guardianRelation}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-soft)', paddingBottom: '4px' }}>
                                                <span style={{ color: 'var(--color-text-muted)' }}>Teléfono</span>
                                                <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedRecord.guardianPhone}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-soft)', paddingBottom: '4px' }}>
                                                <span style={{ color: 'var(--color-text-muted)' }}>Emergencia</span>
                                                <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedRecord.emergencyPhone || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '32px' }}>
                                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-light)', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 700 }}>Ficha Médica</h4>
                                    <div className="admin-grid-3">
                                        <div style={{ background: selectedRecord.hasInsurance ? '#ECFDF5' : 'var(--bg-dashboard)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Seguro Médico</div>
                                            <div style={{ fontWeight: 600, color: selectedRecord.hasInsurance ? '#059669' : 'var(--color-text)' }}>{selectedRecord.hasInsurance ? 'SÍ' : 'NO'}</div>
                                            {selectedRecord.hasInsurance && (
                                                <div style={{ fontSize: '0.8rem', marginTop: '8px', color: '#047857' }}>{selectedRecord.insuranceType}</div>
                                            )}
                                        </div>
                                        <div style={{ background: selectedRecord.hasAllergies ? '#FFF7ED' : 'var(--bg-dashboard)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Alergias</div>
                                            <div style={{ fontWeight: 600, color: selectedRecord.hasAllergies ? '#D97706' : 'var(--color-text)' }}>{selectedRecord.hasAllergies ? 'SÍ' : 'NO'}</div>
                                            {selectedRecord.hasAllergies && (
                                                <div style={{ fontSize: '0.8rem', marginTop: '8px', color: '#B45309' }}>{selectedRecord.allergiesDetail}</div>
                                            )}
                                        </div>
                                        <div style={{ background: selectedRecord.hasMedication ? '#FEF2F2' : 'var(--bg-dashboard)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Medicación</div>
                                            <div style={{ fontWeight: 600, color: selectedRecord.hasMedication ? '#DC2626' : 'var(--color-text)' }}>{selectedRecord.hasMedication ? 'SÍ' : 'NO'}</div>
                                            {selectedRecord.hasMedication && (
                                                <div style={{ fontSize: '0.8rem', marginTop: '8px', color: '#B91C1C' }}>{selectedRecord.medicationDetail}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* NEW: Legal & Signature Section */}
                                <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px dashed var(--border-soft)' }}>
                                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-light)', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 700 }}>Legal y Autorizaciones</h4>

                                    <div className="admin-grid-auto">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                <span style={{ color: selectedRecord.acceptedRules ? '#059669' : '#9CA3AF' }}>{selectedRecord.acceptedRules ? '✅' : '⬜'}</span>
                                                <span style={{ color: selectedRecord.acceptedRules ? 'var(--color-text)' : 'var(--color-text-muted)' }}>Normas de Convivencia</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                <span style={{ color: selectedRecord.acceptedLiability ? '#059669' : '#9CA3AF' }}>{selectedRecord.acceptedLiability ? '✅' : '⬜'}</span>
                                                <span style={{ color: selectedRecord.acceptedLiability ? 'var(--color-text)' : 'var(--color-text-muted)' }}>Exoneración de Responsabilidad</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                <span style={{ color: selectedRecord.acceptedMedia ? '#059669' : '#9CA3AF' }}>{selectedRecord.acceptedMedia ? '✅' : '⬜'}</span>
                                                <span style={{ color: selectedRecord.acceptedMedia ? 'var(--color-text)' : 'var(--color-text-muted)' }}>Uso de Imagen</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                <span style={{ color: selectedRecord.habeasData ? '#059669' : '#9CA3AF' }}>{selectedRecord.habeasData ? '✅' : '⬜'}</span>
                                                <span style={{ color: selectedRecord.habeasData ? 'var(--color-text)' : 'var(--color-text-muted)' }}>Hábeas Data</span>
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Firma Digital</div>
                                            {selectedRecord.signature ? (
                                                <div style={{ padding: '8px', border: '1px dashed var(--border-soft)', borderRadius: '8px', background: '#F9FAFB' }}>
                                                    <img src={selectedRecord.signature} alt="Firma" style={{ maxWidth: '120px', maxHeight: '60px' }} />
                                                </div>
                                            ) : (
                                                <div style={{ padding: '20px', border: '1px dashed var(--border-soft)', borderRadius: '8px', background: '#F9FAFB', color: '#9CA3AF', fontSize: '0.8rem' }}>
                                                    Sin Firma
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Modal Footer */}
                            <div style={{ padding: '24px 32px', background: 'var(--bg-dashboard)', borderTop: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button onClick={() => generatePDF(selectedRecord)} className="btn-primary" style={{ padding: '12px 24px', background: 'var(--color-padua-gold)' }}>
                                    📄 Descargar Ficha PDF
                                </button>
                                <button onClick={() => setSelectedRecord(null)} className="btn-secondary">
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
