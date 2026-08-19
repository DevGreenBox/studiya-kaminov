export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailTransport {
  readonly id: string;
  send(message: EmailMessage): Promise<{ ok: boolean; info?: string }>;
}
