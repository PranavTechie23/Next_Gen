/** Map stored upload paths to authenticated API routes. */
function toProtectedUploadUrl(storedUrl, kind) {
    const filename = String(storedUrl || '').split('/').pop();
    if (!filename) return storedUrl;
    return `/api/files/${kind}/${filename}`;
}

function normalizeUploadUrl(storedUrl) {
    if (!storedUrl || typeof storedUrl !== 'string') return storedUrl;
    if (storedUrl.startsWith('/api/files/')) return storedUrl;
    if (storedUrl.startsWith('http://') || storedUrl.startsWith('https://')) return storedUrl;

    const match = storedUrl.match(/\/uploads\/(resumes|avatars)\/([^/?#]+)/i);
    if (match) {
        return `/api/files/${match[1].toLowerCase()}/${match[2]}`;
    }
    return storedUrl;
}

module.exports = { toProtectedUploadUrl, normalizeUploadUrl };
