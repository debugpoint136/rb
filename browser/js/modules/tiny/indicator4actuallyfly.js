function indicator4actuallyfly() {
    if (indicator4.count == 20) {
        indicator4.style.display = 'none';
        return;
    }
    indicator4.count++;
    indicator4.style.width = parseInt(indicator4.style.width) + indicator4.wshrink;
    indicator4.style.height = parseInt(indicator4.style.height) + indicator4.hshrink;
    indicator4.style.left = parseInt(indicator4.style.left) + indicator4.xincrement;
    indicator4.style.top = parseInt(indicator4.style.top) + indicator4.yincrement;
    setTimeout(indicator4actuallyfly, 10);
}