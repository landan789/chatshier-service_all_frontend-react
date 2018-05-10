export const UPDATE_CONSUMERS = 'UPDATE_CONSUMERS';

/**
 * @param {Chatshier.Consumers} consumers
 */
export const updateConsumers = (consumers) => {
    return { type: UPDATE_CONSUMERS, consumers };
};
