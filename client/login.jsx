const helper = require('./helper.js');
let data;
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!username || !pass) {
        handleLoginError({ error: 'Missing Field(s)', username, pass })
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, _csrf }, handleLoginError);
    return false;
};

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!username || !pass || !pass2) {
        handleSignupError({ error: 'Missing Field(s)', username, pass, pass2 });
        return false;
    }

    if (pass !== pass2) {
        handleSignupError({ error: 'Passwords do not match!' });
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2, _csrf }, handleSignupError);
    return false;
};

const handleLoginError = (e) => {
    ReactDOM.render(<LoginWindow csrf={data.csrfToken} toRender={e.error} />, document.getElementById('content'));
    document.getElementById('errorMessage').classList.add('has-text-danger')

    document.getElementById('user').classList.remove('is-danger');
    document.getElementById('pass').classList.remove('is-danger');

    if (e.error === "Wrong username or password") {
        document.getElementById('user').classList.add('is-danger');
        document.getElementById('pass').classList.add('is-danger');

    } else if (e.error === 'Missing Field(s)') {
        if (!e.username) {
            document.getElementById('user').classList.add('is-danger');
        }
        if (!e.pass) {
            document.getElementById('pass').classList.add('is-danger');
        }
    }
}

const handleSignupError = (e) => {
    if (e.error) {
        ReactDOM.render(<SignUpWindow csrf={data.csrfToken} toRender={e.error} />, document.getElementById('content'));
        document.getElementById('errorMessage').classList.add('has-text-danger');

        document.getElementById('user').classList.remove('is-danger');
        document.getElementById('pass').classList.remove('is-danger');
        document.getElementById('pass2').classList.remove('is-danger');

        if (e.error === "Username already exists") {
            document.getElementById('user').classList.add('is-danger');
        }
        else if (e.error === 'Missing Field(s)') {
            if (!e.username) {
                document.getElementById('user').classList.add('is-danger');
            }
            if (!e.pass) {
                document.getElementById('pass').classList.add('is-danger');
            }
            if (!e.pass2) {
                document.getElementById('pass2').classList.add('is-danger');
            }
        } else if (e.error === 'Passwords do not match!') {
            document.getElementById('pass').classList.add('is-danger');
            document.getElementById('pass2').classList.add('is-danger');
        }
    }
}

const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm box">
            <h3 className='title'>Blindrs</h3>
            <input className='input' id="user" type='text' name="username" placeholder='Username' />
            <br />
            <br />
            <input className='input' id='pass' type="password" name='pass' placeholder='Password' />
            <input id='_csrf' type="hidden" name='_csrf' value={props.csrf} />
            <input className="formSubmit button mt-4" type="submit" value="Sign in" />

            <div id='errorMessage'>
                {
                    props.toRender
                }
            </div>
            <div> Don't have an account?
                <div onClick={displaySignup} id='signupButton' className='has-text-link is-underlined'>
                    <a>Signup here</a>
                </div>
            </div>
        </form>
    );
};

const displayLogin = () => {
    ReactDOM.render(<LoginWindow csrf={data.csrfToken} />, document.getElementById('content'));
}

const displaySignup = () => {
    ReactDOM.render(<SignUpWindow csrf={data.csrfToken} />, document.getElementById('content'));
}

const SignUpWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="signupForm box">
            <h3 className='title'>Blindrs</h3>
            <input className='input' id="user" type='text' name="username" placeholder='Username' />
            <br />
            <br />
            <input className='input' id='pass' type="password" name='pass' placeholder='Password' />
            <br />
            <br />
            <input className='input' id='pass2' type="password" name='pass2' placeholder='Retype Password' />
            <input id='_csrf' type="hidden" name='_csrf' value={props.csrf} />
            <input className="formSubmit button mt-4" type="submit" value="Register" />
            <div id='errorMessage'>
                {
                    props.toRender
                }
            </div>
            <div> Already have an account?
                <div onClick={displayLogin} id='loginButton' className='has-text-link is-underlined'>
                    <a>Login here</a>
                </div>
            </div>
        </form>
    );
};


const init = async () => {
    const response = await fetch('/getToken');
    data = await response.json();
    ReactDOM.render(<LoginWindow csrf={data.csrfToken} />, document.getElementById('content'));
}

window.onload = init;
