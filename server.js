const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/convert', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) return res.status(400).json({ error: 'Image URL missing' });

  try {
    const apiRes = await axios.get(`https://smfahim.xyz/4k?url=${encodeURIComponent(imageUrl)}`, {
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', 'image/jpeg');
    res.send(apiRes.data);
  } catch (err) {
    res.status(500).json({ error: 'Conversion failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
