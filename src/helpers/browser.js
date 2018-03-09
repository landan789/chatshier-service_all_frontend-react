const TITLE_POSTFIX = ' | Chatshier';

const browserHelper = {
    /**
     * 設定瀏覽器分頁的標題
     */
    setTitle: (title) => {
        document.title = title + TITLE_POSTFIX;
    }
};

export default browserHelper;
