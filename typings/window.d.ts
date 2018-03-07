interface Window {
    config: {
        apiKey: string,
        authDomain: string,
        databaseURL: string,
        projectId: string,
        storageBucket: string,
        messagingSenderId: string
    },
    urlConfig: {
        wwwUrl: string,
        port: number,
        index: string,
        terms: string,
        privacy: string,
        webhookUrl: string,
        apiUrl: string
    },
    chatshierConfig: {
        imageFileMaxSize: number,
        videoFileMaxSize: number,
        audioFileMaxSize: number
    }
}