import chatshierLogo from '../image/logo-no-transparent.png';

const LINE = 'LINE';
const FACEBOOK = 'FACEBOOK';
const WECHAT = 'WECHAT';
const CHATSHIER = 'CHATSHIER';

export const logos = {
    [LINE]: 'https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg',
    [FACEBOOK]: 'https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png',
    [WECHAT]: 'https://cdn.worldvectorlogo.com/logos/wechat.svg',
    [CHATSHIER]: chatshierLogo
};

/**
 * @param {File | Blob} blob
 * @returns {Promise<string>}
 */
export const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        if (!blob) {
            return resolve('');
        }

        let fileReader = new FileReader();
        fileReader.onerror = reject;
        fileReader.onloadend = () => {
            let base64 = fileReader ? fileReader.result || '' : '';
            fileReader = void 0;
            return resolve(base64);
        };
        fileReader.readAsDataURL(blob);
    });
};
