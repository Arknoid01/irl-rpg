// Partage d'une image générée sur l'appareil. Sous Capacitor : écrite dans le
// cache (@capacitor/filesystem) puis passée au partage natif (@capacitor/share).
// Sur le web : Web Share avec fichier, sinon téléchargement. Aucun réseau.

function b64ToBlob(b64, type) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type });
}

/**
 * @param {string} b64  PNG en base64 (sans préfixe data:)
 * @returns {Promise<true|'downloaded'|false>}
 */
export async function shareImage(b64, { fileName = 'cairn.png', title = '', text = '' } = {}) {
  const cap = typeof window !== 'undefined' ? window.Capacitor : undefined;
  const Share = cap && cap.Plugins && cap.Plugins.Share;
  const Fs = cap && cap.Plugins && cap.Plugins.Filesystem;
  if (Share && Fs) {
    try {
      const { uri } = await Fs.writeFile({ path: fileName, data: b64, directory: 'CACHE' });
      await Share.share({ title, text, files: [uri] });
      return true;
    } catch { return false; }
  }
  try {
    const file = new File([b64ToBlob(b64, 'image/png')], fileName, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title, text });
      return true;
    }
    const a = document.createElement('a');
    a.href = `data:image/png;base64,${b64}`;
    a.download = fileName;
    a.click();
    return 'downloaded';
  } catch { return false; }
}
