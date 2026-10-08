export interface MailMessage {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface MailResult {
  previewUrl: string | null;
}

// Contrato de envio de e-mail.
export interface IMailProvider {
  sendMail(message: MailMessage): Promise<MailResult>;
}
