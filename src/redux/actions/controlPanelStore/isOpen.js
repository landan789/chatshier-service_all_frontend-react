export const TOGGLE_PANEL = 'TOGGLE_PANEL';
export const CLOSE_PANEL = 'CLOSE_PANEL';

export const togglePanel = () => {
    return { type: TOGGLE_PANEL };
};

export const closePanel = () => {
    return { type: CLOSE_PANEL };
};
