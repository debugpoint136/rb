/**
 * @param event
 */

function colorscale_slider_mu(event)
{
    document.body.removeEventListener('mousemove',colorscale_slider_mm,false);
    document.body.removeEventListener('mouseup',colorscale_slider_mu,false);
    draw_genomebev_experiment(apps.gg.view[gflag.css.viewkey],gflag.css.bev);
}