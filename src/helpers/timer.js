class TimeHelper {
    toLocalTimeString(ms) {
        let date = new Date(ms);
        let localDate = date.toLocaleDateString();
        let localTime = date.toLocaleTimeString();
        let localTimeString = localDate + localTime;
        return localTimeString;
    }

    isHistory(sentTime, currentTime) {
        let result = false;
        let sentTimeInDatetime = new Date(sentTime);
        let sentTimeInMilliseconds = sentTimeInDatetime.getTime();
        let currentTimeInMilliseconds = Date.now();
        result = sentTimeInMilliseconds <= currentTimeInMilliseconds;
        return result;
    }
}

export default new TimeHelper();
