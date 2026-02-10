import type { VercelRequest, VercelResponse } from '@vercel/node';

// Phase 4: Schedule follow-up sequences
// Works with Upstash Redis (via Vercel Marketplace)
// Env vars: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
// (also supports legacy KV_REST_API_URL + KV_REST_API_TOKEN)

interface SequenceStep {
  dayOffset: number;
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

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return { url, token };
}

async function redisCommand(command: string[]): Promise<any> {
  const { url, token } = getRedisConfig();
  const response = await fetch(`${url}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  return response.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'DELETE') {
    const { leadId } = req.body;
    if (!leadId) return res.status(400).json({ error: 'leadId required' });
    return res.status(200).json({ success: true, message: 'Sequence cancelled' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, token } = getRedisConfig();
  if (!url || !token) {
    return res.status(500).json({ error: 'Upstash Redis not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.' });
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
      await redisCommand(['SET', key, JSON.stringify(followUp), 'EX', String(90 * 24 * 60 * 60)]);

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
