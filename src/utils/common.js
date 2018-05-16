import chatshierLogo from '../image/logo-no-transparent.png';

const LINE = 'LINE';
const FACEBOOK = 'FACEBOOK';
const WECHAT = 'WECHAT';
const CHATSHIER = 'CHATSHIER';

export const fixHttpsResource = (url) => {
    if ('https:' === window.location.protocol && 0 === url.indexOf('http://')) {
        return url.replace('/^http:/i', window.location.protocol);
    }
    return url;
};

export const logos = {
    [LINE]: 'https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg',
    [FACEBOOK]: 'https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png',
    [WECHAT]: 'https://cdn.worldvectorlogo.com/logos/wechat.svg',
    [CHATSHIER]: chatshierLogo
};
