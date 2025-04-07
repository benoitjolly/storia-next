const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Route par défaut
app.get('/', (req, res) => {
  res.send('Serveur WebSocket en cours d\'exécution');
});

// Compteur de connexions
let connectedClients = 0;

// Gestion des événements de socket
io.on('connection', (socket) => {
  connectedClients++;
  
  console.log(`Nouveau client connecté. ID: ${socket.id}`);
  console.log(`Nombre de clients connectés: ${connectedClients}`);
  
  // Envoyer un message de bienvenue au client qui vient de se connecter
  socket.emit('message', {
    id: Date.now().toString(),
    type: 'info',
    message: `Bienvenue! Vous êtes connecté au serveur WebSocket. Votre ID: ${socket.id}`,
    timestamp: new Date()
  });
  
  // Informer tous les clients qu'un nouveau client s'est connecté
  io.emit('notification', {
    id: Date.now().toString(),
    type: 'success',
    message: `Un nouveau client s'est connecté. Total: ${connectedClients}`,
    timestamp: new Date()
  });
  
  // Écouter les messages du client
  socket.on('message', (data) => {
    console.log(`Message reçu de ${socket.id}:`, data);
    
    // Diffuser le message à tous les clients
    io.emit('message', data);
  });
  
  // Écouter les notifications du client
  socket.on('notification', (data) => {
    console.log(`Notification reçue de ${socket.id}:`, data);
    
    // Diffuser la notification à tous les clients
    io.emit('notification', data);
  });
  
  // Gérer la déconnexion du client
  socket.on('disconnect', () => {
    connectedClients--;
    console.log(`Client déconnecté. ID: ${socket.id}`);
    console.log(`Nombre de clients connectés: ${connectedClients}`);
    
    // Informer tous les clients qu'un client s'est déconnecté
    io.emit('notification', {
      id: Date.now().toString()+Math.random().toString(),
      type: 'warning',
      message: `Un client s'est déconnecté. Total: ${connectedClients}`,
      timestamp: new Date()
    });
  });
});

// Port d'écoute
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Serveur WebSocket démarré sur le port ${PORT}`);
}); 