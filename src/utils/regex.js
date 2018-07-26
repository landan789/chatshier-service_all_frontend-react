const regex = {
    domainPrefix: /^[\w-]+\./i,
    domainPort: /:\d+$/i,
    url: /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig,

    // http://emailregex.com/
    emailStrict: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    emailWeak: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
    phone: /^0\d{9,}$/,

    // wechat 的預設表情符號並不是依照 unicode 編碼，傳過來的訊息是依照 wechat 自家的特殊符號編碼而定
    // 因此要解析 wechat 的表情符號必須進行轉換
    // 1. 使用正規表達式檢測文字內是否含有 wechat 的表情符號
    // 2. 將 wechat 表情符號的編碼根據對照表進行轉換
    wechatEmojiRegex: new RegExp("/::\\)|/::~|/::B|/::\\||/:8-\\)|/::<|/::$|/::X|/::Z|/::'\\(|/::-\\||/::@|/::P|/::D|/::O|/::\\(|/::\\+|/:--b|/::Q|/::T|/:,@P|/:,@-D|/::d|/:,@o|/::g|/:\\|-\\)|/::!|/::L|/::>|/::,@|/:,@f|/::-S|/:\\?|/:,@x|/:,@@|/::8|/:,@!|/:!!!|/:xx|/:bye|/:wipe|/:dig|/:handclap|/:&-\\(|/:B-\\)|/:<@|/:@>|/::-O|/:>-\\||/:P-\\(|/::'\\||/:X-\\)|/::\\*|/:@x|/:8\\*|/:pd|/:<W>|/:beer|/:basketb|/:oo|/:coffee|/:eat|/:pig|/:rose|/:fade|/:showlove|/:heart|/:break|/:cake|/:li|/:bome|/:kn|/:footb|/:ladybug|/:shit|/:moon|/:sun|/:gift|/:hug|/:strong|/:weak|/:share|/:v|/:@\\)|/:jj|/:@@|/:bad|/:lvu|/:no|/:ok|/:love|/:<L>|/:jump|/:shake|/:<O>|/:circle|/:kotow|/:turn|/:skip|/:oY|/:#-0|/:hiphot|/:kiss|/:<&|/:&>", 'g')
};

const wechatEmojiTable = Object.freeze({
    // TODO: 補完 wechat 預設表情符號編碼
    '/::)': '😃',
    '/::~': '😖',
    '/::B': '😍',
    '/::|': '😳'
});

export default regex;
export { wechatEmojiTable };
