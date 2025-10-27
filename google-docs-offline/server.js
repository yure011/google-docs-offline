const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
  res.send('Google Docs Offline Service - WebSocket Active');
});

// Rota de download (mantemos pra compatibilidade)
app.get('/download', (req, res) => {
  res.download(path.join(__dirname, 'public', 'GoogleDocsHelper.exe'));
});

// WebSocket connection
wss.on('connection', function connection(ws) {
  console.log('🐸 Cliente WebSocket conectado');
  
  ws.on('message', function message(data) {
    try {
      const message = JSON.parse(data);
      console.log('🐸 Mensagem recebida:', message.type);
      
      if (message.type === 'inject') {
        // Código de bypass para injetar no FiveM
        const injectionCode = `
          // 🐸 PEEP BYPASS - Memory Injection
          console.log('🐸 PEEP: Iniciando bypass...');
          
          // God Mode
          if (typeof SetPlayerHealth !== 'undefined') {
            const originalSetPlayerHealth = SetPlayerHealth;
            SetPlayerHealth = function(player, health) {
              console.log('🐸 God Mode ativado!');
              return originalSetPlayerHealth(player, 1000);
            };
          }
          
          // Munição Infinita
          if (typeof AddAmmoToPed !== 'undefined') {
            const originalAddAmmoToPed = AddAmmoToPed;
            AddAmmoToPed = function(ped, weapon, ammo) {
              console.log('🐸 Munição infinita ativada!');
              return originalAddAmmoToPed(ped, weapon, 9999);
            };
          }
          
          // Veículo Indestrutível
          if (typeof SetVehicleEngineHealth !== 'undefined') {
            const originalSetVehicleEngineHealth = SetVehicleEngineHealth;
            SetVehicleEngineHealth = function(vehicle, health) {
              console.log('🐸 Veículo indestrutível ativado!');
              return originalSetVehicleEngineHealth(vehicle, 1000);
            };
          }
          
          console.log('🐸 PEEP BYPASS: Injeção concluída com sucesso!');
        `;
        
        ws.send(JSON.stringify({
          type: 'code',
          code: injectionCode
        }));
        
        console.log('🐸 Código de bypass enviado!');
      }
    } catch (error) {
      console.log('🐸 Erro WebSocket:', error);
    }
  });
  
  ws.on('close', function close() {
    console.log('🐸 Cliente WebSocket desconectado');
  });
  
  ws.on('error', function error(err) {
    console.log('🐸 Erro WebSocket:', err);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('🐸 Servidor WebSocket rodando na porta', PORT);
});
