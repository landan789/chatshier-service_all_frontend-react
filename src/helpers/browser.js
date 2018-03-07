const TITLE_POSTFIX = ' | Chatshier';

const browser = {
    /**
     * 設定瀏覽器分頁的標題
     */
    setTitle: (title) => {
        document.title = title + TITLE_POSTFIX;
    }
};

export default browser;
