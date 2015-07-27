/**
 * @param event
 */

function mcmMoveMU(event) {
    indicator3.style.display = 'none';
    document.body.removeEventListener('mousemove', mcmMoveM, false);
    document.body.removeEventListener('mouseup', mcmMoveMU, false);
}