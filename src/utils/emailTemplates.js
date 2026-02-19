
export const getConfirmationEmailHTML = (data) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Inscripción</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica', 'Arial', sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3B2314 0%, #5D4037 100%); padding: 30px 20px; text-align: center; }
        .logo-container { display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px; }
        .logo-text { color: #C9A84C; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold; margin-top: 10px; }
        .content { padding: 40px 30px; color: #333333; }
        .h1 { color: #3B2314; font-size: 24px; font-weight: bold; margin-bottom: 10px; text-align: center; }
        .subtitle { color: #666666; font-size: 16px; text-align: center; margin-bottom: 30px; line-height: 1.5; }
        .card { background-color: #FAFAFA; border: 1px solid #E5E5E5; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
        .card-row { display: flex; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding: 10px 0; }
        .card-row:last-child { border-bottom: none; }
        .card-label { color: #888888; font-size: 14px; font-weight: 500; }
        .card-value { color: #3B2314; font-size: 14px; font-weight: bold; text-align: right; }
        .highlight-box { background-color: #FFF8E1; border-left: 4px solid #C9A84C; padding: 15px; margin: 20px 0; font-size: 14px; color: #5D4037; }
        .footer { background-color: #333333; color: #888888; padding: 20px; text-align: center; font-size: 12px; }
        .btn { display: inline-block; background-color: #C9A84C; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        .social-links { margin-top: 20px; }
        .social-link { color: #C9A84C; text-decoration: none; margin: 0 10px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-text">COLEGIO SAN ANTONIO DE PADUA</div>
            <h2 style="color: #ffffff; margin: 5px 0 0 0; font-weight: normal; font-size: 18px;">& METANOIIA</h2>
        </div>

        <!-- Content -->
        <div class="content">
            <h1 class="h1">¡Inscripción Exitosa!</h1>
            <p class="subtitle">
                Hola <strong>${data.guardianName}</strong>, hemos registrado correctamente la inscripción para el retiro espiritual.
            </p>

            <!-- Student Detail Card -->
            <div class="card">
                <div style="text-align: center; margin-bottom: 15px; color: #C9A84C; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                    Datos del Participante
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td class="card-label" style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">Estudiante</td>
                        <td class="card-value" style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; text-align: right;">${data.studentName}</td>
                    </tr>
                    <tr>
                        <td class="card-label" style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">Cédula</td>
                        <td class="card-value" style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; text-align: right;">${data.idCard}</td>
                    </tr>
                    <tr>
                        <td class="card-label" style="padding: 8px 0;">Curso</td>
                        <td class="card-value" style="padding: 8px 0; text-align: right;">${data.grade} "${data.parallel}"</td>
                    </tr>
                </table>
            </div>

            <div class="highlight-box">
                <strong>Importante:</strong><br>
                Recuerda revisar la lista de cosas que debes llevar en la sección de "Compromiso" del formulario o contactar con los organizadores si tienes dudas.
            </div>

            <p style="text-align: center; font-size: 14px; color: #666;">
                Este correo sirve como constancia de tu registro.<br>
                ¡Nos vemos pronto en esta experiencia transformadora!
            </p>
            
            <div style="text-align: center;">
                <a href="http://metanoiiacorporationsas.com" class="btn">Visitar Sitio Web</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>© 2026 Metanoiia Corporation S.A.S. & Colegio San Antonio de Padua</p>
            <p>Este es un mensaje automático, por favor no responder a este correo.</p>
            <div class="social-links">
                <a href="https://instagram.com/metanoiiaec" class="social-link">Instagram</a> • 
                <a href="https://facebook.com/metanoiiaec" class="social-link">Facebook</a>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};
