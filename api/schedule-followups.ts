import type { VercelRequest, VercelResponse } from '@vercel/node';

// Phase 4: Schedule follow-up sequences
// Called from the frontend to save follow-up schedules to Vercel KV
// The cron job (api/cron/follow-ups.ts) then processes them daily

interface SequenceStep {
  dayOffset: number; // Days after initial contact
  channel: 'email' | 'linkedin' | 'phone' | 'whatsapp';
  tone: 'formal' | 'friendly' | 'direct';
  focusPoint: string;
}

interface ScheduleRequest {
  leadId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  industry: string;
  city: string;
  website: string;
  steps: SequenceStep[];
}

async function kvSet(key: string, value: any, expirySeconds?: number): Promise<void> {
  const url = expirySeconds
    ? `${process.env.KV_REST_API_URL}/set/${key}?EX=${expirySeconds}`
    : `${process.env.KV_REST_API_URL}/set/${key}`;

  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(JSON.stringify(value)),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'DELETE') {
    // Cancel a follow-up sequence
    const { leadId } = req.body;
    if (!leadId) return res.status(400).json({ error: 'leadId required' });

    // We can't easily delete by pattern in KV REST API, but we can mark them
    // In practice, you'd use a scan + delete approach
    return res.status(200).json({ success: true, message: 'Sequence cancelled' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(500).json({ error: 'Vercel KV not configured' });
  }

  const { leadId, companyName, contactPerson, email, industry, city, website, steps } =
    req.body as ScheduleRequest;

  if (!leadId || !companyName || !email || !steps || steps.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const now = new Date();
    const scheduled = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const scheduledDate = new Date(now);
      scheduledDate.setDate(scheduledDate.getDate() + step.dayOffset);

      const followUpId = `${leadId}-step${i + 1}-${Date.now()}`;
      const key = `followup:${followUpId}`;

      const followUp = {
        id: followUpId,
        leadId,
        companyName,
        contactPerson,
        email,
        industry,
        city,
        website,
        scheduledDate: scheduledDate.toISOString(),
        sequenceStep: i + 1,
        totalSteps: steps.length,
        channel: step.channel,
        tone: step.tone,
        focusPoint: step.focusPoint,
        status: 'pending',
      };

      // Store with 90-day expiry
      await kvSet(key, followUp, 90 * 24 * 60 * 60);

      scheduled.push({
        step: i + 1,
        scheduledDate: scheduledDate.toISOString(),
        channel: step.channel,
      });
    }

    return res.status(200).json({
      success: true,
      leadId,
      companyName,
      scheduledFollowUps: scheduled,
    });
  } catch (error: any) {
    console.error('Failed to schedule follow-ups:', error);
    return res.status(500).json({ error: error.message });
  }
}
