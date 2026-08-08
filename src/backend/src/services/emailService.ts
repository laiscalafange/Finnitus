import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// função para enviar o código de recuperação de senha por email
export async function enviarCodigoPorEmail(
  email: string,
  codigo: string
) {
  await transporter.sendMail({
    from: `"Finnitus" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Código de recuperação de senha - Finnitus",
    text: `
Olá!

Recebemos uma solicitação para alterar a senha da sua conta Finnitus.

Seu código de recuperação é:

${codigo}

Esse código é válido por 10 minutos.

Se você não solicitou a alteração da senha, ignore este e-mail.

Atenciosamente,
Equipe Finnitus
    `,
  });
}