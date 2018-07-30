window.CHATSHIER = {
    FILE: {
        // https://developers.line.me/en/docs/messaging-api/reference/#upload-rich-menu-image
        // According to LINE official document, the max size of richmenu image should set to 1 MB
        IMAGE_OF_RICHMENU_MAX_SIZE: 1 * 1024 * 1024,
        IMAGE_MAX_SIZE: 6 * 1024 * 1024, // 6 MB
        VIDEO_MAX_SIZE: 20 * 1024 * 1024, // 20 MB
        AUDIO_MAX_SIZE: 10 * 1024 * 1024, // 10 MB
        ORTHER_MAX_SIZE: 100 * 1024 * 1024 // 100 MB
    },
    FACEBOOK: {
        APP_ID: '203545926984167', // facebook appId
        COOKIE: true,
        XFBML: true,
        VERSION: 'v3.0'
    },
    GOOGLE_CALENDAR: {
        API_KEY: 'AIzaSyAggVIi65n65aIAbthGR8jmPCoEiLbujc8',
        CLIENT_ID: '1074711200692-ds4lin2uh3q4bs5doqsdipuak83j6te1.apps.googleusercontent.com',
        DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        SCOPES: 'https://www.googleapis.com/auth/calendar'
    },
    URL: {
        /**
         * 指向 www.chatshier 專案的伺服器位址
         */
        WWW: 'https://www.dev.chatshier.com',
        PORT: 80,
        /**
         * wwwUrl 伺服器的首頁路徑
         */
        INDEX: '/index',
        /**
         * 服務項目頁面路徑
         */
        TERMS: '/terms',
        /**
         * 隱私權頁面路徑
         */
        PRIVACY: '/privacy',
        /**
         * 外部服務發送 webhook 至本機的前輟網址，
         * 本機開發時可使用 ngrok 產生外部鏈結
         */
        WEBHOOK: 'https://service.dev.chatshier.com/webhook',
        /**
         * 指向 api-chatshier 專案的 API 伺服器位址
         */
        API: '..'
    }
};
