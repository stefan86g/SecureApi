import { addClient, removeClient, broadcastMessage } from '../services/messageService.js';

describe('Message Broadcasting', () => {
  let client1, client2;

  beforeEach(() => {
    // Create mock clients with a write function.
    client1 = { write: jest.fn() };
    client2 = { write: jest.fn() };

    // Clear the client list before each test
    addClient(client1);
    addClient(client2);
  });

  afterEach(() => {
    removeClient(client1);
    removeClient(client2);
  });

  test('broadcastMessage should send payload to all clients', () => {
    const messageData = {
      sender: 'user1',
      text: 'Hello world',
      createdAt: new Date(),
    };

    broadcastMessage(messageData);

    const expectedPayload = JSON.stringify({
      sender: messageData.sender,
      text: messageData.text,
      createdAt: messageData.createdAt,
    });

    // We check that write is called for all clients.
    expect(client1.write).toHaveBeenCalledWith(`data: ${expectedPayload}\n\n`);
    expect(client2.write).toHaveBeenCalledWith(`data: ${expectedPayload}\n\n`);
  });

  test('removeClient should remove client from broadcast list', () => {
    removeClient(client1);

    const messageData = { sender: 'user2', text: 'Test', createdAt: new Date() };
    broadcastMessage(messageData);

    const expectedPayload = JSON.stringify({
      sender: messageData.sender,
      text: messageData.text,
      createdAt: messageData.createdAt,
    });

    // client1 no longer receives messages
    expect(client1.write).not.toHaveBeenCalled();
    // client2 still receives messages
    expect(client2.write).toHaveBeenCalledWith(`data: ${expectedPayload}\n\n`);
  });
});
