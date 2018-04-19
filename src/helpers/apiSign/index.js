import SignIn from './SignIn';
import SignUp from './SignUp';
import SignOut from './SignOut';
import Refresh from './refresh';

let reqHeaders = new Headers();
reqHeaders.set('Accept', 'application/json');

const apiSign = {
    signIn: new SignIn(),
    signUp: new SignUp(),
    signOut: new SignOut(),
    refresh: new Refresh()
};
export default apiSign;

export { apiSign, reqHeaders };
