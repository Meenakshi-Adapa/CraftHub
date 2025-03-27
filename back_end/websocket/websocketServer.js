const WebSocket = require('ws');

class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server, path: '/ws' });
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('New WebSocket connection established');

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    console.log('Received message:', data);
                    
                    // Handle different message types
                    switch(data.type) {
                        case 'ping':
                            ws.send(JSON.stringify({ type: 'pong' }));
                            break;
                        default:
                            console.log('Unknown message type:', data.type);
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });

            // Send initial connection success message
            ws.send(JSON.stringify({ type: 'connected', message: 'Successfully connected to WebSocket server' }));
        });
    }
}

module.exports = WebSocketServer;