import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, orderBy, query, deleteDoc, doc } from '../../services/firebase';

import { jsPDF } from "jspdf";

import logoPadua from '../../assets/images/logo_padua.jpg';
import logoMetanoiia from '../../assets/images/logo_metanoiia.png';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => (
    <div style={{
        width: '260px',
        background: 'var(--color-primary)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 1.5rem',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100
    }}>
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--color-secondary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>P</div>
            <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: '1' }}>PADUA</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7, letterSpacing: '0.1em' }}>ADMIN DASHBOARD</div>
            </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
            alert('Contraseña incorrecta');
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
            alert("Error al cargar datos. Verifica tu conexión.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro permanentemente? Esta acción no se puede deshacer.')) {
            try {
                await deleteDoc(doc(db, "registros", id));
                setRegistros(prev => prev.filter(item => item.id !== id));
                alert("Registro eliminado exitosamente.");
            } catch (error) {
                console.error("Error removing document: ", error);
                alert("Error al eliminar el registro.");
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
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex' }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsAuthenticated(false)} />

            <main style={{ flex: 1, marginLeft: '260px', padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
                            {activeTab === 'dashboard' ? 'Panel General' : 'Gestión de Inscripciones'}
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                            {activeTab === 'dashboard' ? 'Resumen estadístico del retiro 2026.' : 'Administra y exporta los registros de estudiantes.'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

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
                        <div style={{
                            background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-soft)',
                            display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
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
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
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
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
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

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px' }}>
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
