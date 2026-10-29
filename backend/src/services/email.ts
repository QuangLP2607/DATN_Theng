import nodemailer from "nodemailer";

interface SendActivationEmailParams {
  email: string;
  name: string;
  token: string;
}

export const sendActivationEmail = async ({
  email,
  name,
  token,
}: SendActivationEmailParams): Promise<void> => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!host || !user || !pass || !frontendUrl) {
    throw new Error("Email service environment variables are missing");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const activationUrl =
    `${frontendUrl.replace(/\/+$/, "")}` +
    `/activate-account?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? user,
    to: email,
    subject: "Kích hoạt tài khoản EduLearning",
    text: [
      `Xin chào ${name},`,
      "",
      "Vui lòng mở liên kết bên dưới để kích hoạt tài khoản và đặt mật khẩu.",
      activationUrl,
      "",
      "Liên kết có hiệu lực trong 24 giờ.",
      "Nếu bạn không yêu cầu tài khoản này, hãy bỏ qua email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Kích hoạt tài khoản EduLearning</h2>
        <p>Xin chào ${escapeHtml(name)},</p>
        <p>
          Nhấn nút bên dưới để kích hoạt tài khoản và đặt mật khẩu.
          Liên kết có hiệu lực trong 24 giờ.
        </p>
        <p>
          <a
            href="${activationUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              color: #ffffff;
              background: #40a737;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Kích hoạt tài khoản
          </a>
        </p>
        <p>Nếu bạn không yêu cầu tài khoản này, hãy bỏ qua email.</p>
      </div>
    `,
  });
};

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
