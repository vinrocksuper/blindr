const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getProfile', mid.requiresLogin, controllers.Profile.getProfile);
  app.get('/getUsername', mid.requiresLogin, controllers.Account.getUsername);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/app', mid.requiresLogin, controllers.Account.homePage);

  app.get('/profile', mid.requiresLogin, controllers.Profile.profilePage);
  app.get('/editProfile', mid.requiresLogin, controllers.Profile.editProfilePage);
  app.put('/editProfile', mid.requiresLogin, controllers.Profile.editProfile);
  app.put('/editPassword', mid.requiresLogin, controllers.Account.editPassword);

  app.post('/makeProfile', mid.requiresLogin, controllers.Profile.makeProfile);

  app.post('/createMessage', mid.requiresLogin, controllers.Messages.createMessage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
