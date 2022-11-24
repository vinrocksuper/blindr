const socket = io();
const helper = require('./helper.js');

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
            };
            socket.emit('chat message', data);

        }
    });
};

const handlePost = async (e) => {
    e.preventDefault();
    helper.hideError();
    const editBox = document.getElementById('editbox');
    const user = await fetch('/getUsername');
    const userdata = await user.json();
    const response = await fetch('/getToken');
    const data = await response.json();
    
    console.log(userdata);
    helper.sendPost(e.target.action, {content: editBox.value, username: userdata.docs[0].username, _csrf: data.csrfToken})

    editBox.value = '';
}


const displayMessage = (msg) => {
    const payload = msg.split(":");
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `
    <div class='box tile is-parent is-vertical notification is-info'>
        <div class='is-child my-1'>
            ${payload[0]}
        </div>
        <hr class='my-2'/>
        <div class='is-child'>
            ${payload[1]} 
        </div>
    </div>
    <br />
    `
    document.getElementById('messages').appendChild(messageDiv);

};

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
    });
};

const CreateMessage = (props) => {
    return (
        <form id="editForm"
        onSubmit={handlePost}
        action="/createMessage"
        method="POST"
        >
            <textarea className="textarea is-medium" id="editbox" type="text" />
            <br />
            <div className="is-flex is-flex-direction-row-reverse">
                <input className='button is-medium ml-2' type="submit" />
                <select className="select is-medium ml-3" id="channelSelect">
                    <option value="general">General</option>
                    <option value="meme">Meme</option>
                </select>
            </div>

        </form>
    );
}

const init = () => {
    ReactDOM.render(<CreateMessage />, document.getElementById('createMessage'));
    handleEditbox();
    socket.on('general', displayMessage);
    handleChannelSelect();
};

window.onload = init;
