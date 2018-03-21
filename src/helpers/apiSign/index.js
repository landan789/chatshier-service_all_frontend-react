import SignIn from './SignIn';

let jwt = '';
let reqHeaders = new Headers();
reqHeaders.set('Content-Type', 'application/json');

const apiSign = {
    signIn: new SignIn()
};
export default apiSign;

export { apiSign, reqHeaders };
