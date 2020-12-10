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
  const data = {
    user_email: await getLoggedUserEmail(session),
    email_to_show: "",
    errors: [],
    simple_error: "",
    success: "",
  }
  render('./auth/register.ejs', data);
}

const registerValidationRules = {
  email: [deps.required, deps.isEmail],
  password: [deps.required, deps.minLength(4)],
  verification: [deps.required, deps.minLength(4)],
};

// Try register user, return message about operation.
const tryRegister = async({request}) => {
  const body = request.body();
  const params = await body.value;

  const data = {
    email: "",
    password: "",
    verification: "",
  }
  
  data.email = params.get('email');
  data.password = params.get('password');
  data.verification = params.get('verification');

  const [passes, errors] = await deps.validate(data, registerValidationRules);
  if (!passes) {
    errors.email_to_show = data.email;
    return errors;
  }

  const msgs = {
    email: "",
    password: "",
    verification: "",
    email_to_show: data.email,
    simple_error: "",
    success: "",
  }
  if (data.password !== data.verification) {
    msgs.simple_error = 'The entered passwords did not match';
    return msgs;
  }

  const rows = await service.getLoginInfo(data.email);
  if (rows.rowCount > 0) {
    msgs.simple_error = 'The email is already reserved.'
    return msgs;
  }

  const hash = await deps.hash(data.password);
  await service.addUser(data.email, hash);
  msgs.email_to_show = '';
  msgs.success = 'Registration successful. You can log in now.';
  return msgs;
};

const registerUser = async({request, session, render}) => {
  const ret_msgs = await tryRegister({request});
  const data = {
    user_email: await getLoggedUserEmail(session),
    email_to_show: ret_msgs.email_to_show,
    errors: ret_msgs,
    simple_error: "",
    success: "",
  }
  if (ret_msgs.simple_error && ret_msgs.simple_error.length > 0)
    data.simple_error = ret_msgs.simple_error;
  if (ret_msgs.success && ret_msgs.success.length > 0)
    data.success = ret_msgs.success;
  render('./auth/register.ejs', data);
}

export { mainPage, showLogin, login, logout, showRegister, registerUser };
