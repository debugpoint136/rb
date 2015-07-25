/**
 * for comparing two exp over all subfam
 */

function scatterplot_show_2()
{
    /* for comparing two exp over all subfam
     */
    toggle19();
    apps.scp.bbj=browser;
    apps.scp.callback_click=scatterplot_dotclick_2;
    apps.scp.callback_mover=scatterplot_dot_mouseover;
    apps.scp.callback_submit=scatterplot_submit2;
    apps.scp.callback_menudotoption=scatterplot_clickmenu_2;
}