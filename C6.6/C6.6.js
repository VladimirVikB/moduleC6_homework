
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const locationButton = document.getElementById('location-button');
const messagesContainer = document.querySelector('.messages-container');

const ws = new WebSocket('wss://ws.postman-echo.com/raw');

//Обрабатываем сообщение от сервера, проверяем если не геолокация то выводим
ws.onmessage = function(event) {
    const message = event.data;
    if (!message.startsWith('https://www.openstreetmap.org/')) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.classList.add('server-message');
        messagesContainer.appendChild(messageElement);
    }
};

sendButton.addEventListener('click', function() {
    const message = messageInput.value;
    ws.send(message);
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('user-message');
    messagesContainer.appendChild(messageElement);
    messageInput.value = '';
});

locationButton.addEventListener('click', function() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const locationLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
            const locationLinkElement = document.createElement('a');
            locationLinkElement.href = locationLink;
            locationLinkElement.target = '_blank';
            locationLinkElement.textContent = 'Гео-локация';
            const messageElement = document.createElement('div');
            messageElement.appendChild(locationLinkElement);
            messageElement.classList.add('user-message');
            messagesContainer.appendChild(messageElement);
            ws.send(locationLink);
        });
    } else {
        alert('Геолокация не поддерживается вашим браузером');
    }
});