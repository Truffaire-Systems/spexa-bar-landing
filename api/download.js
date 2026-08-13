// Zero-touch download endpoint.
// Looks up the latest GitHub release of the public releases repo at request
// time, finds the Windows .exe asset, and 302-redirects the browser straight
// to it. This means the landing page never needs editing when a new version
// ships — it always points at whatever "latest" is.

const RELEASES_API =
  'https://api.github.com/repos/Truffaire-Systems/spexa-sbg-pos-releases/releases/latest';

// Fallback if the GitHub API is unreachable or rate-limited: GitHub's own
// stable "latest release" page (user can click the asset there).
const FALLBACK = 'https://github.com/Truffaire-Systems/spexa-sbg-pos-releases/releases/latest';

export default async function handler(req, res) {
  try {
    const r = await fetch(RELEASES_API, {
      headers: {
        'User-Agent': 'spexa-sbg-landing',
        Accept: 'application/vnd.github+json',
      },
    });

    if (!r.ok) {
      res.setHeader('Location', FALLBACK);
      res.status(302).end();
      return;
    }

    const data = await r.json();
    const exe = (data.assets || []).find((a) => /^Spexa-SBG-Setup-.*\.exe$/i.test(a.name));
    const target = exe ? exe.browser_download_url : FALLBACK;

    // Cache the redirect at the CDN edge for 5 min so we don't hit the
    // unauthenticated GitHub API rate limit under load.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Location', target);
    res.status(302).end();
  } catch (err) {
    res.setHeader('Location', FALLBACK);
    res.status(302).end();
  }
}
