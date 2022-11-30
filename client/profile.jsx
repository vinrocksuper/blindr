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
    console.log('sending put');

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
    console.log('changing password put');

    helper.sendPut(e.target.action, { oldPass, newPass, newPass2, _csrf }, handlePasswordSuccess);

    return false;
}

const handlePasswordSuccess = (e) => {

    ReactDOM.render(<EditPassword toRender={e.message || e.error}/>, document.getElementById('editPassword'));
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
                        <input id="firstname" type='text' name="fname" placeholder={props.firstName ?? 'First Name'} />
                    </div>
                    <div>
                        <label htmlFor='lname'>Last Name: </label>
                        <input id="lastname" type='text' name="lname" placeholder={props.lastName ?? 'Last Name'} />
                    </div>
                    <div>
                        <label htmlFor='desc'>Description: </label>
                        <textarea id="description" type='text' name="desc" defaultValue={'Lorem Ipsum'} value={props.description} />
                    </div>
                    <input id='_csrf' type="hidden" name='_csrf' value={token} />
                    <div>
                        <label htmlFor="premium">Premium Enabled: </label>
                        <input id='premium' type="checkbox" name='premium' defaultChecked={props.premium} />
                    </div>
                    <input className='button' type='submit' />
                </div>
            </form>
        </div>
    );
};

const EditPassword = (props) => {
    return (
        <div className='column'>
            <form id="passwordForm"
                name="passwordForm"
                onSubmit={handlePasswordEdit}
                action="/editPassword"
                method="PUT"
                className="box">
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
                <input id='passwordSubmit' className='button' type='submit' />
            </form>
            <div>{props.toRender}</div>
        </div>
    );
}

const ProfileInfo = (props) => {
    return (
        <div>
            <h1>Profile Info</h1>
            <div>{props.firstName ?? 'Who are '} {props.lastName ?? 'you? '} {props.age ?? 'missing age?'}</div>
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
        ReactDOM.render(<EditProfile firstName={data.profile[0].name.split(" ")[0]} lastName={data.profile[0].name.split(" ")[1]} description={data.profile[0].description} premium={data.profile[0].premium} />, document.getElementById('editProfile'));
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

window.onload = init;