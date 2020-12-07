import * as service from "../../services/basic_service.js";
import * as deps from "../../deps.js";

const mainPage = async({render}) => {
  render('index.ejs');
};

const showLogin = async({render}) => {
  render('./auth/login.ejs', {message: ''});
}

const login = async({request, response, render, session}) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get('email');
  const password = params.get('password');

  const res = await service.getLoginInfo(email);
  if (res.rowCount === 0) {
    render('./auth/login.ejs', {message: 'Authentication failed.'});
    return;
  }

  // Results should contain only one line because email is unique
  const userObj = res.rowsOfObjects()[0];
  const hash = userObj.password;

  const passwordCorrect = await deps.compare(password, hash);
  if (!passwordCorrect) {
    render('./auth/login.ejs', {message: 'Authentication failed.'});
    return;
  }

  await session.set('authenticated', true);
  await session.set('user', {
      id: userObj.id,
      email: userObj.email
  });
  response.redirect('/');
}

const showRegister = async({render}) => {
  render('./auth/register.ejs', {message: ''});
}

// Try register user, return message about operation.
const tryRegister = async({request}) => {
  const body = request.body();
  const params = await body.value;
  
  const email = params.get('email');
  const password = params.get('password');
  const verification = params.get('verification');

  if (password !== verification) {
    return 'The entered passwords did not match';
  }

  if (password.length < 4) {
    return 'Password must contain at least 4 characters';
  }

  const rows = await service.getLoginInfo(email);
  if (rows.length > 0) {
    return 'The email is already reserved.';
  }

  const hash = await deps.hash(password);
  await service.addUser(email, hash);
  return 'Registration successful. You can log in now.';
};

const registerUser = async({request, render}) => {
  const ret_msg = await tryRegister({request});
  render('./auth/register.ejs', {message: ret_msg});
}

export { mainPage, showLogin, login, showRegister, registerUser };
