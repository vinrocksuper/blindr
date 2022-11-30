const helper = require('./helper.js');

const handleProfileEdit = (e) => {
    e.preventDefault();
    helper.hideError();

    const fname = e.target.querySelector('#firstname').value;
    const lname = e.target.querySelector('#lastname').value;
    const desc = e.target.querySelector('#description').value;
    const _csrf = e.target.querySelector('#_csrf').value;
    const premium = e.target.querySelector('#premium').checked;

    if (!lname || !fname) {
        helper.handleError('Missing fields');
        return false;
    }

    helper.sendPut(e.target.action, { name: `${fname} ${lname}`, desc, _csrf, premium: premium }, loadProfileFromServer);

    return false;
}


const handlePasswordEdit = (e) => {
    e.preventDefault();
    helper.hideError();

    const oldPass = e.target.querySelector('#oldPass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!oldPass || !newPass || !newPass2) {
        helper.handleError('Missing fields');
        return false;
    }
    helper.sendPut(e.target.action, { oldPass, newPass, newPass2, _csrf }, handlePasswordSuccess);

    return false;
}

const handlePasswordSuccess = (e) => {
    if (e.message) {
        ReactDOM.render(<EditPassword toRender={e.message} />, document.getElementById('editPassword'));
        document.querySelector('#resultMessage').classList.add('has-text-success');
        if (document.querySelector('#oldPass').classList.contains('is-danger')) {
            document.querySelector('#oldPass').classList.toggle('is-danger');
        }
        if (document.querySelector('#resultMessage').classList.contains('has-text-danger')) {
            document.querySelector('#resultMessage').classList.toggle('has-text-danger');
        }
        if (document.querySelector('#newPass').classList.contains('is-danger')) {
            document.querySelector('#newPass').classList.toggle('is-danger');
            document.querySelector('#newPass2').classList.toggle('is-danger');
        }
    } else if (e.error) {
        ReactDOM.render(<EditPassword toRender={e.error} />, document.getElementById('editPassword'));
        if (e.error == 'Incorrect Password') {
            document.querySelector('#oldPass').classList.add('is-danger');
        } else {
            document.querySelector('#newPass').classList.add('is-danger');
            document.querySelector('#newPass2').classList.add('is-danger');
        }
        document.querySelector('#resultMessage').classList.add('has-text-danger');
        if (document.querySelector('#resultMessage').classList.contains('has-text-success')) {
            document.querySelector('#resultMessage').classList.toggle('has-text-success');
        }
    } else {
        ReactDOM.render(<EditPassword toRender={'Unsure what went wrong'} />, document.getElementById('editPassword'));
    }
}

let token;
const EditProfile = (props) => {
    return (
        <div className='column ml-0'>
            <form id="profileForm"
                name="profileForm"
                onSubmit={handleProfileEdit}
                action="/editProfile"
                method="PUT"
                className="profileForm box">
                <h3 className='title'>Edit Profile Info</h3>
                <div>
                    <div>
                        <label htmlFor='fname'>First Name: </label>
                        <input id="firstname" className="input" type='text' name="fname" placeholder={props.firstName ?? 'First Name'} />
                    </div>
                    <div>
                        <label htmlFor='lname'>Last Name: </label>
                        <input id="lastname" type='text' className="input" name="lname" placeholder={props.lastName ?? 'Last Name'} />
                    </div>
                    <div>
                        <label htmlFor='desc'>Description: </label>
                        <textarea id="description" type='text' className="textarea" name="desc" />
                    </div>
                    <input id='_csrf' type="hidden" name='_csrf' value={token} />
                    <div>
                        <label htmlFor="premium">Premium Enabled: </label>
                        <input id='premium' className="checkbox" type="checkbox" name='premium' defaultChecked={props.premium} />
                    </div>
                    <br/>
                    <input className='button' type='submit' />
                </div>
            </form>
        </div>
    );
};

const EditPassword = (props) => {
    return (
        <div className='column box'>
            <form id="passwordForm"
                name="passwordForm"
                onSubmit={handlePasswordEdit}
                action="/editPassword"
                method="PUT">
                <h3 className='title'>Edit Password</h3>
                <div>
                    <label htmlFor='passwordOld'>Old Password: </label>
                    <input id='oldPass' className="input" name='passwordOld' type="password" />
                </div>
                <div>
                    <label htmlFor='passwordNew'>New Password: </label>
                    <input id='newPass' className="input" name='passwordNew' type="password" />
                </div>
                <div>
                    <label htmlFor='passwordNew2'>Re-enter New Password: </label>
                    <input id='newPass2' className="input" name='passwordNew2' type="password" />
                </div>
                <input id='_csrf' type="hidden" name='_csrf' value={token} />
                <br />
                <input id='passwordSubmit' className='button' type='submit' />
                <div id='resultMessage'>
                    {props.toRender}
                </div>
            </form>
        </div>
    );
}

const ProfileInfo = (props) => {
    return (
        <div className='box'>
            <h1 className='title'>Profile Info</h1>
            <div>{props.firstName + ' ' ?? 'Who are '} {props.lastName + ' ' ?? 'you? '} {props.age ?? 'missing age?'}</div>
            <div>{props.description ?? 'missing desc?'}</div>
            <div>{props.premium ? 'Premium' : 'Not Premium'}</div>
        </div>
    )
}

const loadProfileFromServer = async () => {
    const response = await fetch('/getProfile');
    const data = await response.json();
    console.log(data);
    if (data.profile[0]) {
        ReactDOM.render(<EditProfile firstName={data.profile[0].name.split(" ")[0]} lastName={data.profile[0].name.split(" ")[1]}  premium={data.profile[0].premium} />, document.getElementById('editProfile'));
        ReactDOM.render(<ProfileInfo firstName={data.profile[0].name.split(" ")[0]} lastName={data.profile[0].name.split(" ")[1]} description={data.profile[0].description} age={data.profile[0].age} premium={data.profile[0].premium} />, document.getElementById('profileInfo'));
    }
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();
    token = data.csrfToken;
    ReactDOM.render(<ProfileInfo />, document.getElementById('profileInfo'));
    ReactDOM.render(<EditProfile csrf={data.csrfToken} />, document.getElementById('editProfile'));
    ReactDOM.render(<EditPassword csrf={data.csrfToken} />, document.getElementById('editPassword'));
    loadProfileFromServer();
}

window.addEventListener('load', () => {
    init();
});