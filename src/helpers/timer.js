module.exports = (function() {
    function Timer() {};
    Timer.prototype.toLocalTimeString = function(ms) {
        let date = new Date(ms);
        let localDate = date.toLocaleDateString();
        let localTime = date.toLocaleTimeString();
        let localTimeString = localDate + localTime;
        return localTimeString;
    };
    return new Timer();
})();
