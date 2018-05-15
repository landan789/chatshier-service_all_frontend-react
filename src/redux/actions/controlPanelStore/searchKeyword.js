export const UPDATE_SEARCH_KEYWORD = 'UPDATE_SEARCH_KEYWORD';

export const updateSearchKeyword = (searchKeyword) => {
    return { type: UPDATE_SEARCH_KEYWORD, searchKeyword: searchKeyword };
};
