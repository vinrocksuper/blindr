const socket = io();

const handleEditbox = () => {
    const editForm = document.getElementById('editForm');
    const editBox = document.getElementById('editbox');
    const channelSelect = document.getElementById('channelSelect');

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (editBox.value) {
            const data = {
                message: editBox.value,
                channel: channelSelect.value,
            }
            socket.emit('chat message', data);
            editBox.value = '';
        }
    });
}

const displayMessage = (msg) => {
    const messageDiv = document.createElement('div');
    messageDiv.innerText = msg;
    document.getElementById('messages').appendChild(messageDiv);
}

const handleChannelSelect = () => {
    const channelSelect = document.getElementById('channelSelect');
    const messages = document.getElementById('messages');

    channelSelect.addEventListener('change', () => {
        messages.innerHTML = '';
        switch (channelSelect.value) {
            case 'meme':
                socket.off('general'); // unsubscribes from the event
                socket.on('meme', displayMessage);
                break;
            default:
                socket.off('meme'); // unsubscribes from the event
                socket.on('general', displayMessage);
                break;
        }
    })
}

const init = () => {
    handleEditbox();
    socket.on('general', displayMessage);
    handleChannelSelect();
};

window.onload = init;