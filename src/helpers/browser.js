const TITLE_POSTFIX = ' | Chatshier';

const browserHelper = {
    /**
     * 設定瀏覽器分頁的標題
     *
     * @param {string} title - 欲設定的分頁標題
     */
    setTitle: (title) => {
        document.title = title + TITLE_POSTFIX;
    }
};

export default browserHelper;
