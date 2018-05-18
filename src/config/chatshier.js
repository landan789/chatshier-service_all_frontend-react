const chatshierConfig = {
    FILE_MAXSIZE: {
        image: 5 * 1024 * 1024, // 5 MB
        video: 20 * 1024 * 1024, // 20 MB
        audio: 10 * 1024 * 1024, // 10 MB
        other: 100 * 1024 * 1024 // 100 MB
    },
    FACEBOOK: {
        // appId: '178381762879392',
        appId: '198604877447165',
        cookie: true,
        xfbml: true,
        version: 'v3.0'
    },
    GOOGLE: {
        CALENDAR: {
            API_KEY: 'AIzaSyAggVIi65n65aIAbthGR8jmPCoEiLbujc8',
            CLIENT_ID: '1074711200692-ds4lin2uh3q4bs5doqsdipuak83j6te1.apps.googleusercontent.com',
            DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            SCOPES: 'https://www.googleapis.com/auth/calendar'
        }
    }
};

export default chatshierConfig;
