const UPDATE_METADATA =
  'https://leyba44bx4tpjaje.public.blob.vercel-storage.com/updates/win/latest.yml';
const FALLBACK_INSTALLER = '/updates/win/Spexa-SBG-Setup-2.0.2.exe';

export default async function handler(req, res) {
  let installer = FALLBACK_INSTALLER;

  try {
    const response = await fetch(UPDATE_METADATA, { cache: 'no-store' });
    if (response.ok) {
      const metadata = await response.text();
      const match = metadata.match(/^path:\s*(Spexa-SBG-Setup-[\w.-]+\.exe)\s*$/m);
      if (match) installer = `/updates/win/${encodeURIComponent(match[1])}`;
    }
  } catch (_) {
    // Use the release fallback while the short-lived metadata request recovers.
  }

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  res.setHeader('Location', installer);
  res.status(302).end();
}
