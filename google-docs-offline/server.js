const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Google Docs Offline Service');
});

app.get('/download', (req, res) => {
    res.download(path.join(__dirname, 'public', 'GoogleDocsHelper.exe'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});