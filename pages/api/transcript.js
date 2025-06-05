// pages/api/transcript.js

function getVideoId(url) {
  const match = url.match(/(?:v=|\/|youtu\.be\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
}

async function fetchTranscript(videoId) {
  try {
    const res = await fetch(`https://youtubetranscript.com/api/transcript/${videoId}`);
    const json = await res.json();
    const transcript = json.transcript.map(t => t.text).join("\n");
    return { transcript };
  } catch (e) {
    return { error: "Transcript fetch failed or not found." };
  }
}

export default async function handler(req, res) {
  const url = req.method === 'POST' ? req.body?.url : req.query.url;

  if (!url) {
    return res.status(400).json({ error: "Missing YouTube URL parameter." });
  }

  const videoId = getVideoId(url);
  if (!videoId) {
    return res.status(400).json({ error: "Invalid YouTube URL." });
  }

  const result = await fetchTranscript(videoId);
  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json({ transcript: result.transcript });
}
