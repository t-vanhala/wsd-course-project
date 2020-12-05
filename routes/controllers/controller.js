const mainPage = async({render}) => {
  render('index.ejs');
};

const showLogin = async({render}) => {
  render('login.ejs');
}
 
export { mainPage, showLogin };
