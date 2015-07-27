/**
 * @param term
 */

function mcm_addterm_closure(term) {
    return function () {
        mcm_addterm(term);
    };
}