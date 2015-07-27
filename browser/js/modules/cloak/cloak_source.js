/*** __cloak__ ***/
function invisible_shield(dom) {
    var pos = absolutePosition(dom);
    if (pos[0] + pos[1] < 0) return;
// means div2 is visible
    invisibleBlanket.style.display = 'block';
    invisibleBlanket.style.left = pos[0];
    invisibleBlanket.style.top = pos[1];
    invisibleBlanket.style.width = dom.clientWidth;
    invisibleBlanket.style.height = dom.clientHeight;
}
function cloakPage() {
// cast shadow over entire page
    pagecloak.style.display = 'block';
    pagecloak.style.height = Math.max(window.innerHeight, document.body.offsetHeight);
    pagecloak.style.width = Math.max(window.innerWidth, document.body.offsetWidth);
}

Browser.prototype.cloak = function () {
    if (!this.main) return;
    loading_cloak(this.main);
};

Browser.prototype.shieldOn = function () {
    if (!this.main || !this.shield) return;
    var d = this.main;
    var s = this.shield;
    s.style.display = 'block';
    s.style.width = d.offsetWidth;
    s.style.height = d.offsetHeight;
};

Browser.prototype.shieldOff = function () {
    if (!this.shield) return;
    this.shield.style.display = 'none';
};

Browser.prototype.unveil = function () {
    loading_done();
};

function loading_cloak(dom) {
// images/loading.gif size: 128x128
    var pos = absolutePosition(dom);
    waitcloak.style.display = 'block';
    waitcloak.style.left = pos[0];
    waitcloak.style.top = pos[1];
    var w = dom.clientWidth;
    var h = dom.clientHeight;
    waitcloak.style.width = w;
    waitcloak.style.height = h;
// roller
    waitcloak.firstChild.style.marginTop = h > 128 ? (h - 128) / 2 : 0;
    waitcloak.firstChild.style.marginLeft = w > 128 ? (w - 128) / 2 : 0;
}
function loading_done() {
    waitcloak.style.display = 'none';
}

/*** __cloak__ ends ***/
