const helper = require('./helper.js');

const handleProfileEdit = (e) => {
    e.preventDefault();
    helper.hideError();

    const fname = e.target.querySelector('#firstname').value;
    const lname = e.target.querySelector('#lastname').value;
    const desc = e.target.querySelector('#description').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!lname || !fname) {
        helper.handleError('Missing fields');
        return false;
    }

    helper.sendPost(e.target.action, { name: `${fname} ${lname}`, desc, _csrf }, loadProfileFromServer);

    return false;
}

const EditProfile = (props) => {
    return (<form id="profileForm"
        name="profileForm"
        onSubmit={handleProfileEdit}
        action="/editProfile"
        method="POST"
        className="profileForm">
        <h3>Edit Profile Info</h3>
        <hr />
        <label htmlFor='fname'>First Name: </label>
        <input id="firstname" type='text' name="fname" placeholder={props.firstName ?? 'First Name'} />
        <label htmlFor='lname'>Last Name: </label>
        <input id="lastname" type='text' name="lname" placeholder={props.lastName ?? 'Last Name'} />
        <label htmlFor='desc'>Description: </label>
        <textarea id="description" type='text' name="desc" defaultValue={'Lorem Ipsum'} value={props.description} />
        <input id='_csrf' type="hidden" name='_csrf' value={props.csrf} />
        <input type='submit' />
    </form>)
}

const ProfileInfo = (props) => {
    return (
        <div>
            <h1>Profile Info</h1>
            <div>Name: {props.firstName ?? 'Who are '} {props.lastName ?? 'you? '} {props.age ?? 'missing age?'}</div>
            <div>{props.description ?? 'missing desc?'}</div>
        </div>
    )
}

const loadProfileFromServer = async () => {
    const response = await fetch('/getProfile');
    const data = await response.json();

    console.log('data: ', data);
    if (data.profile[0]){
        ReactDOM.render(<EditProfile firstName={data.profile[0].name.split(" ")[0]} lastName={data.profile[0].name.split(" ")[1]} description={data.profile[0].description} />, document.getElementById('editProfile'));
        ReactDOM.render(<ProfileInfo firstName={data.profile[0].name.split(" ")[0]} lastName={data.profile[0].name.split(" ")[1]} description={data.profile[0].description}/>, document.getElementById('profileInfo'));
    }
       
    

}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();
    // console.log('data: ', data);
    ReactDOM.render(<ProfileInfo/>, document.getElementById('profileInfo'));

    ReactDOM.render(<EditProfile csrf={data.csrfToken}/>, document.getElementById('editProfile'));
    loadProfileFromServer();
    // console.log('success?');
}

window.onload = init;