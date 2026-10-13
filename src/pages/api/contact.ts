import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const ALLOWED_HOSTS = new Set([
  'monfarmexperience.it',
  'www.monfarmexperience.it',
  'localhost',
]);
const VERCEL_PROJECT_HOST = /^monfarm[a-z0-9-]*\.vercel\.app$/;

const isAllowedOrigin = (origin: string | null) => {
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    return ALLOWED_HOSTS.has(hostname) || VERCEL_PROJECT_HOST.test(hostname);
  } catch {
    return false;
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAllowedOrigin(request.headers.get('origin'))) {
    return new Response(JSON.stringify({ error: 'Origine non consentita.' }), { status: 403 });
  }

  const data = await request.formData();

  const nome     = data.get('nome')?.toString().trim() ?? '';
  const cognome  = data.get('cognome')?.toString().trim() ?? '';
  const email    = data.get('email')?.toString().trim() ?? '';
  const motivo   = data.get('motivo')?.toString().trim() ?? '';
  const messaggio = data.get('messaggio')?.toString().trim() ?? '';
  const botField = data.get('bot-field')?.toString() ?? '';

  // Honeypot — se compilato è uno spam bot
  if (botField) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const privacy = data.get('privacy')?.toString() ?? '';

  if (!nome || !cognome || !email || !motivo || !messaggio || !privacy) {
    return new Response(JSON.stringify({ error: 'Campi obbligatori mancanti.' }), { status: 400 });
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  const recipient = import.meta.env.CONTACT_TO_EMAIL || 'info@monfarmexperience.it';

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const motivoLabel: Record<string, string> = {
    'struttura-location':    'Struttura / Location',
    'operatore-insegnante':  'Operatore / Insegnante',
    'azienda-team-building': 'Azienda / Team building',
    'partecipare':          'Vorrei partecipare',
    'altro':                 'Altro',
  };

  try {
    await resend.emails.send({
      from:    'MonFarm Contatti <noreply@monfarmexperience.it>',
      to:      recipient,
      replyTo: email,
      subject: `Nuovo messaggio da ${nome} ${cognome} — ${motivoLabel[motivo] ?? motivo}`,
      html: `
        <h2>Nuovo messaggio dal form di contatto</h2>
        <p><strong>Nome:</strong> ${escapeHtml(nome)} ${escapeHtml(cognome)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Motivo:</strong> ${escapeHtml(motivoLabel[motivo] ?? motivo)}</p>
        <hr />
        <p><strong>Messaggio:</strong></p>
        <p style="white-space: pre-line;">${escapeHtml(messaggio)}</p>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('Resend error:', err);
    return new Response(JSON.stringify({ error: 'Errore invio email.' }), { status: 500 });
  }
};
