/**
 * Created by dpuru on 2/27/15.
 */
/** __pca__ */
function pca_busy(msg) {
    var b = apps.pca.busy;
    b.style.display = 'block';
    b.style.width = apps.pca.width;
    b.style.height = apps.pca.height;
    b.says.innerHTML = msg;
    apps.pca.dotholder.appendChild(b);
}
/** __pca__ ends */