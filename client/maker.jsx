const helper = require('./helper.js');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!age || !name) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, _csrf }, loadProfileFromServer);

    return false;
}

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

// const DomoForm = (props) => {
//     return (
//         <form id="domoForm"
//             name="domoForm"
//             onSubmit={handleDomo}
//             action="/maker"
//             method="POST"
//             className="domoForm">

//             <label htmlFor='name'>Name: </label>
//             <input id="domoName" type='text' name="name" placeholder='Domo Name' />
//             <label htmlFor="age">Password: </label>
//             <input id='domoAge' type="number" name='age' min="0" />
//             <input id='_csrf' type="hidden" name='_csrf' value={props.csrf} />
//             <input className="makeDomoSubmit" type="submit" value="Make Domo" />
//         </form>
//     );
// }

// const DomoList = (props) => {
//     if (props.domos.length === 0) {
//         return (
//             <div className='domoList'>
//                 <h3>No Domos Yet!</h3>
//             </div>
//         )
//     }
//     const domoNodes = props.domos.map(domo => {
//         return (
//             <div key={domo._id} className="domo">
//                 <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
//                 <h3 className='domoName'>Name: {domo.name}</h3>
//                 <h3 className='domoAge'>Age:{domo.age}</h3>
//             </div>
//         );
//     });

//     return (
//         <div className='domoList'>
//             {domoNodes}
//         </div>
//     )
// }

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
    if (data.name)
        ReactDOM.render(<EditProfile firstName={data.name.split(" ")[0]} lastName={data.name.split(" ")[1]} description={data.description} />, document.getElementById('editProfile'));


}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();
    console.log('data: ', data);
    ReactDOM.render(<ProfileInfo/>, document.getElementById('profileInfo'));

    ReactDOM.render(<EditProfile csrf={data.csrfToken}/>, document.getElementById('editProfile'));
    loadProfileFromServer();
    console.log('success?');
}

window.onload = init;