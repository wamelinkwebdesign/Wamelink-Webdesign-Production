import type { VercelRequest, VercelResponse } from '@vercel/node';

// Phase 4: Automated follow-up cron job
// This runs daily via Vercel Cron (see vercel.json)
// Environment variables needed: RESEND_API_KEY, ANTHROPIC_API_KEY, CRON_SECRET, KV_REST_API_URL, KV_REST_API_TOKEN

// Storage: Uses Vercel KV (Redis) to store scheduled follow-ups
// The frontend saves follow-up sequences to KV, and this cron checks daily

interface ScheduledFollowUp {
  id: string;
  leadId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  industry: string;
  city: string;
  website: string;
  scheduledDate: string; // ISO date
  sequenceStep: number;
  totalSteps: number;
  channel: 'email' | 'linkedin' | 'phone' | 'whatsapp';
  tone: 'formal' | 'friendly' | 'direct';
  focusPoint: string;
  status: 'pending' | 'sent' | 'failed';
}

async function kvGet(key: string): Promise<any> {
  const res = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
  const data = await res.json();
  return data.result ? JSON.parse(data.result) : null;
}

async function kvSet(key: string, value: any): Promise<void> {
  await fetch(`${process.env.KV_REST_API_URL}/set/${key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(JSON.stringify(value)),
  });
}

async function kvKeys(pattern: string): Promise<string[]> {
  const res = await fetch(`${process.env.KV_REST_API_URL}/keys/${pattern}`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
  const data = await res.json();
  return data.result || [];
}

async function generateFollowUpMessage(followUp: ScheduledFollowUp): Promise<{ subject: string; body: string }> {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');

  const stepLabel =
    followUp.sequenceStep === 1
      ? 'eerste follow-up'
      : followUp.sequenceStep === 2
      ? 'tweede follow-up'
      : 'laatste follow-up';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: `Je bent een sales copywriter voor Wamelink Webdesign. Schrijf een ${stepLabel} e-mail in het Nederlands. De ontvanger heeft nog niet gereageerd op eerdere berichten. Wees beleefd maar creëer urgentie. Houd het kort (50-100 woorden). Antwoord ALLEEN in JSON: {"subject": "...", "body": "..."}`,
      messages: [
        {
          role: 'user',
          content: `Follow-up voor ${followUp.companyName} (${followUp.contactPerson}) in ${followUp.city}. Branche: ${followUp.industry}. ${followUp.focusPoint ? `Focus: ${followUp.focusPoint}` : ''} Dit is stap ${followUp.sequenceStep} van ${followUp.totalSteps}.`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse AI response');
  return JSON.parse(jsonMatch[0]);
}

async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Dennis Wamelink <dennis@wamelinkwebdesign.nl>',
      to: [to],
      subject,
      html: body.replace(/\n/g, '<br />'),
      text: body,
    }),
  });

  return response.ok;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const today = new Date().toISOString().split('T')[0];
  const results = { processed: 0, sent: 0, failed: 0, errors: [] as string[] };

  try {
    // Get all pending follow-up keys
    const keys = await kvKeys('followup:*');

    for (const key of keys) {
      const followUp: ScheduledFollowUp = await kvGet(key);
      if (!followUp || followUp.status !== 'pending') continue;

      // Check if scheduled for today or earlier
      const scheduledDate = followUp.scheduledDate.split('T')[0];
      if (scheduledDate > today) continue;

      results.processed++;

      try {
        if (followUp.channel === 'email' && followUp.email) {
          // Generate personalized follow-up
          const message = await generateFollowUpMessage(followUp);

          // Send it
          const sent = await sendEmail(followUp.email, message.subject, message.body);

          if (sent) {
            followUp.status = 'sent';
            results.sent++;
          } else {
            followUp.status = 'failed';
            results.failed++;
            results.errors.push(`Failed to send to ${followUp.email}`);
          }
        } else {
          // Non-email channels: mark as pending-manual (needs human action)
          followUp.status = 'sent'; // Mark as processed
          results.sent++;
        }

        // Update the follow-up record
        await kvSet(key, followUp);
      } catch (err: any) {
        results.failed++;
        results.errors.push(`${followUp.companyName}: ${err.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      date: today,
      ...results,
    });
  } catch (error: any) {
    console.error('Cron job failed:', error);
    return res.status(500).json({ error: error.message });
  }
}
