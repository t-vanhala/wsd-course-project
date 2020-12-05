import * as service from "../../services/service.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

const mainPage = async({render}) => {
  render('index.ejs');
};

const showLogin = async({render}) => {
  render('login.ejs');
}

const showRegister = async({render}) => {
  render('register.ejs');
}

const registerUser = async({request, response}) => {
  const body = request.body();
  const params = await body.value;
  
  const email = params.get('email');
  const password = params.get('password');
  const verification = params.get('verification');

  if (password !== verification) {
    response.body = 'The entered passwords did not match';
    return;
  }

  const already_used = await service.areExistingUsers(email);
  if (already_used) {
    response.body = 'The email is already reserved.';
    return;
  }

  const hash = await bcrypt.hash(password);
  await service.addUser(email, hash);
  response.body = 'Registration successful!';
};

export { mainPage, showLogin, showRegister, registerUser };
