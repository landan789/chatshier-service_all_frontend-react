const TITLE_POSTFIX = ' | Chatshier';

const browser = {
    setTitle: (title) => {
        document.title = title + TITLE_POSTFIX;
    }
};

export default browser;
