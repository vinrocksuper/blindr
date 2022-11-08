const helper = require('./helper.js');
const handleProfileEdit = (e) => {
  e.preventDefault();
  helper.hideError();

  const fname = e.target.querySelector('#firstname').value;
  const lname = e.target.querySelector('#lastname').value;
  const desc = e.target.querySelector('#description').value;
  const _csrf = e.target.querySelector('#_csrf').value;
  const age = e.target.querySelector('#age').value;

  if (!lname || !fname || !age) {
    helper.handleError('Missing required fields!');
    return false;
  }

  helper.sendPost(e.target.action, { name: `${fname} ${lname}`, desc, _csrf , age});

  return false;
}

const SetupForm = (props) => {
  return (
    <form id="profileForm"
      name="profileForm"
      onSubmit={handleProfileEdit}
      action="/makeProfile"
      method="POST"
      className="profileForm">
      <h3>Edit Profile Info</h3>
      <hr />
      {/* <label htmlFor='fname'>First Name: </label> */}
      <input id="firstname" type='text' name="fname" placeholder={'First Name'} />
      {/* <label htmlFor='lname'>Last Name: </label> */}
      <input id="lastname" type='text' name="lname" placeholder={'Last Name'} />
      <input id="age" type='number' name="age" placeholder={'Age'} min={18}/>
      <label htmlFor='desc'>Description: </label>
      <textarea id="description" type='text' name="desc" defaultValue={'Lorem Ipsum'} value={props.description} />
      <input id='_csrf' type="hidden" name='_csrf' value={props.csrf} />
      <input type='submit' />
    </form>
  )
};

const init = async () => {
  const response = await fetch('/getToken');
  const data = await response.json();
  ReactDOM.render(<SetupForm csrf={data.csrfToken} />, document.getElementById('info'));
};

window.onload = init;