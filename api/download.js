// Kept as a compatibility endpoint for old deployments/bookmarks. The active
// Vercel route sends /download directly to the first-party installer path.
const WINDOWS_INSTALLER = '/updates/win/Spexa-SBG-Setup-2.0.1.exe';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.setHeader('Location', WINDOWS_INSTALLER);
  res.status(302).end();
}
