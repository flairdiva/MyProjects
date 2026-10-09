export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, content, message } = req.body;

    if (!filename || !content) {
      return res.status(400).json({ error: 'Missing filename or file content.' });
    }

    // Your GitHub repository details
    const owner = 'flairdiva';
    const repo = 'MyProjects';
    const branch = 'main'; // or your default branch
    const path = `uploads/${filename}`; // Folder path inside your repo

    // GitHub API URL for repository contents
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    // Make the request to GitHub API using your hidden PAT
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_PAT}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Vercel-Serverless-Upload'
      },
      body: JSON.stringify({
        message: message || `Upload ${filename} via web app`,
        content: content, // Base64 encoded file content
        branch: branch
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Failed to upload to GitHub' });
    }

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
