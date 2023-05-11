const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const locationButton = document.getElementById('location-button');
const messagesContainer = document.querySelector('.messages-container');

const ws = new WebSocket('wss://ws.postman-echo.com/raw');

ws.onmessage = function(event) {
    const message = event.data;
    if (message.startsWith('https://www.openstreetmap.org/')) {
        const locationLink = document.createElement('a');
        locationLink.href = message;
        locationLink.target = '_blank';
        locationLink.textContent = 'Моя геолокация';
        messagesContainer.appendChild(locationLink);
    } else {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
    }
};

sendButton.addEventListener('click', function() {
    const message = messageInput.value;
    ws.send(message);
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messageInput.value = '';
});

locationButton.addEventListener('click', function() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const locationLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
            ws.send(locationLink);
        });
    } else {
        alert('Геолокация не поддерживается вашим браузером');
    }
});