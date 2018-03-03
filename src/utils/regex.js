const regex = {
    domainPrefix: /^[\w-]+\./i,
    domainPort: /:\d+$/i,

    // http://emailregex.com/
    emailStrict: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    emailWeak: /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/
};

export default regex;
