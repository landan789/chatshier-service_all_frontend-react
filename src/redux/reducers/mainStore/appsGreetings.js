import { UPDATE_GREETINGS, REMOVE_GREETING,
    REMOVE_ALL_GREETINGS } from '../../actions/mainStore/appsGreetings';

export const appsGreetingsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_GREETINGS:
            for (let appId in action.appsGreetings) {
                let app = action.appsGreetings[appId];
                state[appId] = state[appId] || { greetings: {} };

                let greetings = app.greetings;
                for (let greetingId in greetings) {
                    let greeting = greetings[greetingId];
                    if (greeting.isDeleted) {
                        continue;
                    }
                    state[appId].greetings[greetingId] = greeting;
                }
            }
            return Object.assign({}, state);
        case REMOVE_GREETING:
            let appId = action.appId;
            let greetingId = action.greetingId;

            delete state[appId].greetings[greetingId];
            if (0 === Object.keys(state[appId].greetings).length) {
                delete state[appId].greetings;
                delete state[appId];
            }
            return Object.assign({}, state);
        case REMOVE_ALL_GREETINGS:
            appId = action.appId;
            if (state[appId]) {
                delete state[appId];
                return Object.assign({}, state);
            }
            return state;
        default:
            return state;
    }
};
