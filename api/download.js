const UPDATE_METADATA =
  'https://leyba44bx4tpjaje.public.blob.vercel-storage.com/updates/win/latest.yml';

export default async function handler(req, res) {
  try {
    const response = await fetch(UPDATE_METADATA, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Update metadata returned HTTP ${response.status}`);
    const metadata = await response.text();
    const match = metadata.match(/^path:\s*(Spexa-SBG-Setup-[\w.-]+\.exe)\s*$/m);
    if (!match) throw new Error('Update metadata did not contain a valid Windows installer');

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Location', `/updates/win/${encodeURIComponent(match[1])}`);
    res.status(302).end();
  } catch (_) {
    // Do not redirect to a pruned or stale installer when release metadata is
    // unavailable. A temporary failure is safer than serving the wrong bytes.
    res.setHeader('Cache-Control', 'no-store');
    res.status(503).send('The Windows installer is temporarily unavailable. Please try again shortly.');
  }
}
