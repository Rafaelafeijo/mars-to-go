import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { relative } from 'node:path';
import { serve } from '@hono/node-server';
import { createApp } from './app';

const port = Number(process.env.PORT ?? 8787);
// serveStatic resolves roots relative to the working directory.
const distAbs = fileURLToPath(new URL('../../web/dist', import.meta.url));
const webDist = existsSync(distAbs) ? relative(process.cwd(), distAbs) || '.' : undefined;

serve({ fetch: createApp({ webDist }).fetch, port }, (info) => {
  console.log(`mars-to-go api on :${info.port}${webDist ? ' (serving game mirror)' : ''}`);
});
