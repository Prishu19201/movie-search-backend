const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const searchUrl = `https://hdmovie2.ml/?s=${encodeURIComponent(query)}`;
        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);

        const results = [];
        $('.ml-item').each((i, element) => {
            const title = $(element).find('.mli-info h2').text().trim();
            const link = $(element).find('a').attr('href');
            const image = $(element).find('img').attr('src');
            results.push({ title, link, image });
        });

        res.json({ results });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

// For local testing (GitHub Actions will handle deployment)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
