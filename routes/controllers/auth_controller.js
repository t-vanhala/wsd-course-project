import * as service from "../../services/basic_service.js";
import { getUsersDayAvgMood } from "../../services/summary_service.js";
import * as deps from "../../deps.js";
import { stringifyDate, getLoggedUserEmail } from "../../utils/utils.js";

const mainPage = async({render, session}) => {
  // Today and yesterday avg moods for the landing page
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const res_today = await getUsersDayAvgMood(stringifyDate(today));
  const res_yesterday = await getUsersDayAvgMood(stringifyDate(yesterday));

  const today_mood = res_today[0].avg_gen_mood;
  const yesterday_mood = res_yesterday[0].avg_gen_mood;
  render('index.ejs', {user_email: await getLoggedUserEmail(session),
    today_mood: today_mood, yesterday_mood: yesterday_mood});
};

const showLogin = async({render, session}) => {
  render('./auth/login.ejs', {user_email: await getLoggedUserEmail(session),
    message: ''});
}

const login = async({request, response, render, session}) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get('email');
  const password = params.get('password');

  const res = await service.getLoginInfo(email);
  if (res.rowCount === 0) {
    render('./auth/login.ejs', {user_email: await getLoggedUserEmail(session),
      message: 'Invalid email or password'});
    return;
  }

  // Results should contain only one line because email is unique
  const userObj = res.rowsOfObjects()[0];
  const hash = userObj.password;

  const passwordCorrect = await deps.compare(password, hash);
  if (!passwordCorrect) {
    render('./auth/login.ejs', {user_email: await getLoggedUserEmail(session),
      message: 'Invalid email or password'});
    return;
  }

  await session.set('authenticated', true);
  await session.set('user', {
      id: userObj.id,
      email: userObj.email
  });
  response.redirect('/');
}

const logout = async({response, session}) => {
  await session.set('authenticated', null);
  await session.set('user', null);

  response.redirect('/auth/login');
}

const showRegister = async({session, render}) => {
  render('./auth/register.ejs', {user_email: await getLoggedUserEmail(session),
    message: ''});
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

const registerUser = async({request, session, render}) => {
  const ret_msg = await tryRegister({request});
  render('./auth/register.ejs', {user_email: await getLoggedUserEmail(session),
    message: ret_msg});
}

export { mainPage, showLogin, login, logout, showRegister, registerUser };
