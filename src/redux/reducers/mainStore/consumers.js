import { UPDATE_CONSUMERS } from '../../actions/mainStore/consumers';

export const consumersReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_CONSUMERS:
            for (let platformUid in action.consumers) {
                /** @type {Chatshier.Consumers} */
                let consumer = action.consumers[platformUid];
                state[platformUid] = consumer;
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
