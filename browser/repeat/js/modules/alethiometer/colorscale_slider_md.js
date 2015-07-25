/**
 * @param event
 */

function colorscale_slider_md(event)
{
    event.preventDefault();
    document.body.addEventListener('mousemove',colorscale_slider_mm,false);
    document.body.addEventListener('mouseup',colorscale_slider_mu,false);
    gflag.css={bev:event.target.bev,
        viewkey:event.target.viewkey,
        oldx:event.clientX,
    }
}