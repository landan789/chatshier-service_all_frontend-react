import SignIn from './SignIn';
import SignUp from './SignUp';

let reqHeaders = new Headers();
reqHeaders.set('Content-Type', 'application/json');

const apiSign = {
    signIn: new SignIn(),
    signUp: new SignUp()
};
export default apiSign;

export { apiSign, reqHeaders };
