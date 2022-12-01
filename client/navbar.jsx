const LoggedInNavbar = () => {
    return (
        <nav className="navbar">
            <a href="/app" className="navbar-brand logo">
                <img id="logo" src="/assets/img/blind.png" alt="logo" />
                <span className="navbar-item is-size-3">BLINDRS</span>
            </a>
            <a className="navbar-item" href="/profile"><i className="fa-regular fa-user"></i></a>
            <a className='navbar-item' href="/logout"><i className="fa-solid fa-right-from-bracket"></i></a>
        </nav>
    );
}

const init = () => {
    ReactDOM.render(<LoggedInNavbar />, document.getElementById('appNav'));
}

// Needs to do it this way otherwise init will be overwritten
window.addEventListener('load', () => {
    init();
});