const socket = io();
const helper = require('./helper.js');

let adCountdown = 5;
let shouldDisplayAds = true;

const handleEditbox = () => {
    const editForm = document.getElementById('editForm');
    const editBox = document.getElementById('editbox');
    const channelSelect = document.getElementById('channelBox');

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
    const checkAdStatus = await fetch('/getProfile');
    const status = await checkAdStatus.json();
    if(status.profile){
        shouldDisplayAds = status.profile[0].premium;
    }

    console.log('sending post')
    helper.sendPost(e.target.action, { content: editBox.value, username: userdata.docs[0].username, _csrf: data.csrfToken })
    console.log('success')
    editBox.value = '';
}

const displayAd = () => {
    const adDiv = document.createElement('div');
    adDiv.innerHTML = `    <div class='box tile is-parent is-vertical notification is-warning'>
    <div class='is-child'>
    <div class='has-background-light p-3 box'>
        THIS IS AN AD
        </div>
    </div>
</div>
<br />
`;
    document.getElementById('messages').prepend(adDiv);
}

const displayMessage = (msg) => {
    console.log(msg);
    const payload = msg.split(":");
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `
    <div class='box tile is-parent is-vertical notification is-info'>
        <div class='is-child mb-3'>
            ${payload[0]}
            
        </div>
        <div class='is-child has-background-light has-text-dark box'>
            ${payload[1]} 
        </div>
    </div>
    <br />
    `
    document.getElementById('messages').prepend(messageDiv);
    if(shouldDisplayAds){
        adCountdown--;
        if (!adCountdown) {
            displayAd();
            adCountdown = 5;
        }
    }
};

const handleChannelChange = (value) => {
    socket.removeAllListeners();
    socket.on(value.toString(), displayMessage);
}

const CreateMessage = (props) => {
    return (
        <form id="editForm"
            onSubmit={handlePost}
            action="/createMessage"
            method="POST">
            <textarea className="textarea is-medium" id="editbox" type="text" />
            <br />
            <div className="is-flex is-flex-direction-row-reverse">
                <input className='button is-medium ml-2' type="submit" />
                <input id='channelBox'type="text" className="input" onChange={e => handleChannelChange(e.target.value)} placeholder='chat-room (leave empty for global)'/>
            </div>
        </form>
    );
}

const init = async () => {
    const response = await fetch('/getProfile');
    const data = await response.json();
    if(data.profile[0]?.premium){
        shouldDisplayAds = false;
    }
    ReactDOM.render(<CreateMessage />, document.getElementById('createMessage'));
    handleEditbox();
    socket.on('global', displayMessage);
};

window.onload = init;
