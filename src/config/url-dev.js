/*
 * 開發時需將此檔案複製一份並將檔名修改為 url.js 並修改成開發用參數
 */
const urlConfig = {
    /**
     * 指向 www.chatshier 專案的伺服器位址
     */
    wwwUrl: 'https://www.chatshier.com',
    port: 80,
    /**
     * wwwUrl 伺服器的首頁路徑
     */
    index: '/index.html',
    /**
     * 服務項目頁面路徑
     */
    terms: '/terms.html',
    /**
     * 隱私權頁面路徑
     */
    privacy: '/privacy.html',
    /**
     * 外部服務發送 webhook 至本機的前輟網址，
     * 本機開發時可使用 ngrok 產生外部鏈結，
     * 如: https://ab971dae.ngrok.io
     */
    webhookUrl: 'https://dev-chatshier.herokuapp.com/webhook',
    /**
     * 指向 service.chatshier 專案的 API 伺服器位址
     */
    apiUrl: '//api.chatshier.com/'
};

export default urlConfig;
