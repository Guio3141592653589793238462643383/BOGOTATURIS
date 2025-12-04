"""
Servicio de envío de correos electrónicos
Utiliza SMTP para enviar notificaciones a los usuarios
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_user)
        self.from_name = os.getenv("FROM_NAME", "BogotaTuris")
    
    def send_email(self, to_email: str, subject: str, html_content: str, text_content: str = None):
        """
        Envía un correo electrónico
        
        Args:
            to_email: Dirección de correo del destinatario
            subject: Asunto del correo
            html_content: Contenido HTML del correo
            text_content: Contenido en texto plano (opcional)
        """
        try:
            # Crear mensaje
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email
            
            # Agregar contenido de texto plano si existe
            if text_content:
                part1 = MIMEText(text_content, "plain")
                message.attach(part1)
            
            # Agregar contenido HTML
            part2 = MIMEText(html_content, "html")
            message.attach(part2)
            
            # Enviar correo
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.from_email, to_email, message.as_string())
            
            return True
        except Exception as e:
            print(f"Error al enviar correo: {e}")
            return False
    
    def send_bulk_email(self, to_emails: List[str], subject: str, html_content: str, text_content: str = None):
        """
        Envía correos a múltiples destinatarios
        
        Args:
            to_emails: Lista de direcciones de correo
            subject: Asunto del correo
            html_content: Contenido HTML del correo
            text_content: Contenido en texto plano (opcional)
        """
        results = []
        for email in to_emails:
            result = self.send_email(email, subject, html_content, text_content)
            results.append({"email": email, "success": result})
        return results
    
    def send_policy_update_notification(self, to_email: str, policy_type: str, usuario_nombre: str):
        """
        Envía notificación de actualización de políticas
        
        Args:
            to_email: Correo del usuario
            policy_type: Tipo de política ('terminos' o 'tratamiento_datos')
            usuario_nombre: Nombre del usuario
        """
        policy_names = {
            'terminos': 'Términos y Condiciones',
            'tratamiento_datos': 'Tratamiento de Datos Personales'
        }
        
        policy_name = policy_names.get(policy_type, 'Políticas')
        
        subject = f"Actualización de {policy_name} - BogotaTuris"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #f9f9f9;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }}
                .button {{
                    display: inline-block;
                    padding: 12px 30px;
                    background: #667eea;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 30px;
                    color: #666;
                    font-size: 12px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔔 Actualización de Políticas</h1>
                </div>
                <div class="content">
                    <p>Hola <strong>{usuario_nombre}</strong>,</p>
                    
                    <p>Te informamos que hemos actualizado nuestros <strong>{policy_name}</strong>.</p>
                    
                    <p>Como usuario registrado de BogotaTuris, es importante que revises estos cambios para estar al tanto de cómo manejamos tu información y los términos de uso de nuestra plataforma.</p>
                    
                    <p><strong>¿Qué debes hacer?</strong></p>
                    <ul>
                        <li>Revisa los cambios en nuestros {policy_name}</li>
                        <li>Si continúas usando nuestros servicios, aceptas automáticamente las nuevas políticas</li>
                        <li>Si no estás de acuerdo, puedes contactarnos o cancelar tu cuenta</li>
                    </ul>
                    
                    <center>
                        <a href="http://localhost:5173/politicas/{policy_type}" class="button">
                            Ver {policy_name}
                        </a>
                    </center>
                    
                    <p style="margin-top: 30px;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    
                    <p>Saludos,<br><strong>El equipo de BogotaTuris</strong></p>
                </div>
                <div class="footer">
                    <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                    <p>© 2025 BogotaTuris. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Hola {usuario_nombre},
        
        Te informamos que hemos actualizado nuestros {policy_name}.
        
        Como usuario registrado de BogotaTuris, es importante que revises estos cambios.
        
        Visita: http://localhost:5173/politicas/{policy_type}
        
        Saludos,
        El equipo de BogotaTuris
        """
        
        return self.send_email(to_email, subject, html_content, text_content)
    
    def send_verification_email(self, to_email: str, usuario_nombre: str, token: str):
        """
        Envía correo de verificación de cuenta
        
        Args:
            to_email: Correo del usuario
            usuario_nombre: Nombre del usuario
            token: Token de verificación
        """
        verification_url = f"http://localhost:5173/verificar-email?token={token}"
        
        subject = "Verifica tu cuenta - BogotaTuris"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                }}
                .content {{
                    background: #ffffff;
                    padding: 40px;
                    border: 1px solid #e0e0e0;
                }}
                .button {{
                    display: inline-block;
                    padding: 15px 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white !important;
                    text-decoration: none;
                    border-radius: 8px;
                    margin-top: 20px;
                    font-weight: bold;
                    font-size: 16px;
                }}
                .button:hover {{
                    opacity: 0.9;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 30px;
                    padding: 20px;
                    color: #666;
                    font-size: 12px;
                    background: #f9f9f9;
                    border-radius: 0 0 10px 10px;
                }}
                .warning {{
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin-top: 20px;
                    border-radius: 4px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✉️ Verifica tu cuenta</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px;">¡Bienvenido a BogotaTuris!</p>
                </div>
                <div class="content">
                    <p>Hola <strong>{usuario_nombre}</strong>,</p>
                    
                    <p>¡Gracias por registrarte en BogotaTuris! 🎉</p>
                    
                    <p>Para completar tu registro y comenzar a explorar los mejores lugares de Bogotá, necesitamos verificar tu dirección de correo electrónico.</p>
                    
                    <p><strong>Haz clic en el botón de abajo para verificar tu cuenta:</strong></p>
                    
                    <center>
                        <a href="{verification_url}" class="button">
                            ✓ Verificar mi cuenta
                        </a>
                    </center>
                    
                    <p style="margin-top: 30px; font-size: 14px; color: #666;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                        <a href="{verification_url}" style="color: #667eea; word-break: break-all;">{verification_url}</a>
                    </p>
                    
                    <div class="warning">
                        <strong>⚠️ Importante:</strong> Este enlace expirará en <strong>24 horas</strong>. Si no verificas tu cuenta en ese tiempo, deberás solicitar un nuevo correo de verificación.
                    </div>
                    
                    <p style="margin-top: 30px;">Si no creaste esta cuenta, puedes ignorar este correo de forma segura.</p>
                    
                    <p>Saludos,<br><strong>El equipo de BogotaTuris</strong> 🌆</p>
                </div>
                <div class="footer">
                    <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                    <p>© 2025 BogotaTuris. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Hola {usuario_nombre},
        
        ¡Gracias por registrarte en BogotaTuris!
        
        Para completar tu registro, verifica tu correo electrónico haciendo clic en el siguiente enlace:
        
        {verification_url}
        
        Este enlace expirará en 24 horas.
        
        Si no creaste esta cuenta, puedes ignorar este correo.
        
        Saludos,
        El equipo de BogotaTuris
        """
        
        return self.send_email(to_email, subject, html_content, text_content)

    def send_password_reset_email(self, to_email: str, usuario_nombre: str, token: str):
        """
        Envía correo con enlace para restablecer contraseña
        """
        reset_url = f"http://localhost:5173/nueva-contrasena?token={token}"
        subject = "Restablece tu contraseña - BogotaTuris"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #ffffff;
                    padding: 40px;
                    border: 1px solid #e0e0e0;
                }}
                .button {{
                    display: inline-block;
                    padding: 15px 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white !important;
                    text-decoration: none;
                    border-radius: 8px;
                    margin-top: 20px;
                    font-weight: bold;
                    font-size: 16px;
                }}
                .button:hover {{
                    opacity: 0.9;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 30px;
                    padding: 20px;
                    color: #666;
                    font-size: 12px;
                    background: #f9f9f9;
                    border-radius: 0 0 10px 10px;
                }}
                .warning {{
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin-top: 20px;
                    border-radius: 4px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Restablecer contraseña</h1>
                </div>
                <div class="content">
                    <p>Hola <strong>{usuario_nombre}</strong>,</p>
                    <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
                    <p>Si fuiste tú, haz clic en el siguiente botón para crear una nueva contraseña:</p>
                    <center>
                        <a href="{reset_url}" class="button">
                            Restablecer contraseña
                        </a>
                    </center>
                    <p style="margin-top: 30px; font-size: 14px; color: #666;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                        <a href="{reset_url}" style="color: #667eea; word-break: break-all;">{reset_url}</a>
                    </p>
                    <div class="warning">
                        <strong>Importante:</strong> Este enlace expirará en <strong>1 hora</strong>. Si no solicitaste este cambio, ignora este correo.
                    </div>
                </div>
                <div class="footer">
                    <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                    <p>© 2025 BogotaTuris. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """
        text_content = f"""
        Hola {usuario_nombre},

        Para restablecer tu contraseña, visita el siguiente enlace (válido por 1 hora):

        {reset_url}

        Si no solicitaste este cambio, ignora este mensaje.

        Saludos,
        El equipo de BogotaTuris
        """
        return self.send_email(to_email, subject, html_content, text_content)

# Instancia global del servicio
email_service = EmailService()
