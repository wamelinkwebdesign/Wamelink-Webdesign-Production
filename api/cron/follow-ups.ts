import type { VercelRequest, VercelResponse } from '@vercel/node';

// Phase 4: Daily cron job to process follow-up sequences
// Runs every day at 8 AM UTC via Vercel Cron
// Uses Upstash Redis REST API

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

async function scanKeys(pattern: string): Promise<string[]> {
  const keys: string[] = [];
  let cursor = '0';

  do {
    const result = await redisCommand(['SCAN', cursor, 'MATCH', pattern, 'COUNT', '100']);
    cursor = result.result[0];
    keys.push(...result.result[1]);
  } while (cursor !== '0');

  return keys;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { url, token } = getRedisConfig();
  if (!url || !token) {
    return res.status(500).json({ error: 'Upstash Redis not configured' });
  }

  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const keys = await scanKeys('followup:*');

    let processed = 0;
    let sent = 0;
    let errors = 0;

    for (const key of keys) {
      const result = await redisCommand(['GET', key]);
      if (!result.result) continue;

      const followUp = JSON.parse(result.result);
      if (followUp.status !== 'pending') continue;

      const scheduledDay = followUp.scheduledDate.split('T')[0];
      if (scheduledDay !== today) continue;

      processed++;

      try {
        // Generate message via Claude API
        let messageBody = '';
        let subject = '';

        if (process.env.ANTHROPIC_API_KEY) {
          const genResponse = await fetch(
            `https://${req.headers.host}/api/generate-message`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                lead: {
                  companyName: followUp.companyName,
                  contactPerson: followUp.contactPerson,
                  industry: followUp.industry,
                  city: followUp.city,
                  website: followUp.website,
                },
                channel: followUp.channel,
                tone: followUp.tone,
                language: 'nl',
                context: `Dit is follow-up ${followUp.sequenceStep} van ${followUp.totalSteps}. Focus: ${followUp.focusPoint}`,
              }),
            }
          );

          if (genResponse.ok) {
            const genData = await genResponse.json();
            subject = genData.subject;
            messageBody = genData.body;
          }
        }

        // If email channel, send automatically
        if (followUp.channel === 'email' && followUp.email && messageBody && process.env.RESEND_API_KEY) {
          const emailResponse = await fetch(
            `https://${req.headers.host}/api/send-email`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: followUp.email,
                subject,
                html: messageBody.replace(/\n/g, '<br>'),
              }),
            }
          );

          if (emailResponse.ok) {
            sent++;
          }
        }

        // Mark as completed
        followUp.status = followUp.channel === 'email' ? 'sent' : 'pending-manual';
        followUp.processedAt = new Date().toISOString();
        followUp.generatedSubject = subject;
        followUp.generatedMessage = messageBody;

        await redisCommand(['SET', key, JSON.stringify(followUp), 'EX', String(30 * 24 * 60 * 60)]);
      } catch (err: any) {
        errors++;
        console.error(`Error processing follow-up ${key}:`, err.message);
      }
    }

    return res.status(200).json({
      success: true,
      date: today,
      processed,
      sent,
      errors,
      totalKeysScanned: keys.length,
    });
  } catch (error: any) {
    console.error('Cron job failed:', error);
    return res.status(500).json({ error: error.message });
  }
}
