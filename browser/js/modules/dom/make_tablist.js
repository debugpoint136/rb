/**
 * switching tabs, two layout (tabs on left, tabs on top)
 * @param param
 * @return table<br><br><br>
 */

function make_tablist(param)
{
    /* switching tabs, two layout (tabs on left, tabs on top)
     tabtop: true if tabs on top row
     tabpadding:
     */
    var table=document.createElement('table');
    table.style.margin='0px 10px 10px 10px';
    table.cellPadding=table.cellSpacing=0;
    var tr=table.insertRow(0);
// tabs
    var td=tr.insertCell(0);
    table.tab_td=td; // for bgcolor
    if(param.tabtop) {
        td.vAlign='bottom';
    } else {
        td.vAlign='top';
    }
// tab holder
    var d=dom_create('div',td, param.tabtop?'margin:10px 10px 0px 10px;display:inline-block':'margin: 10px 0px 10px 10px;');
    if(param.tabholderborder) {
        d.style.border='1px solid '+colorCentral.foreground_faint_1;
        if(param.tabtop) {
            d.style.borderBottomWidth=0;
        } else {
            d.style.borderRightWidth=0;
        }
    }
    table.tab_holder=d; // for bgcolor
    var firsttab=null;
    var tabs=[];
    for(var i=0; i<param.lst.length; i++) {
        var tab=dom_create('div',d);
        tabs.push(tab);
        if(param.tabpadding) {
            tab.style.padding=param.tabpadding;
        }
        if(param.tabtop) {
            tab.style.display='inline-block';
        }
        tab.className='tablisttab_off';
        if(param.tabtop) {
            tab.style.padding='5px 15px';
            tab.style.borderBottom='solid 1px '+colorCentral.background_faint_1;
        } else {
            tab.style.borderRight='solid 1px '+colorCentral.background_faint_1;
        }
        tab.innerHTML=param.lst[i];
        tab.addEventListener('click',tablisttab_click,false);
        tab.table=table;
        tab.tablist_idx=i;
        if(i==0) firsttab=tab;
    }
    table.tabs=tabs;
// list of holders
    if(param.tabtop) {
        tr=table.insertRow(1);
        td=tr.insertCell(0);
        td.style.borderTop='solid 1px '+colorCentral.magenta7;
    } else {
        td=tr.insertCell(1);
        td.vAlign='top';
        td.style.borderLeft='solid 1px '+colorCentral.magenta7;
    }
    table.page_td=td; // for bgcolor
    td.style.padding=10;
    td.style.whiteSpace='nowrap';
    var holders=[];
    for(var i=0; i<param.lst.length; i++) {
        holders.push(dom_create(param.usediv?'div':'table',td));
    }
    simulateEvent(firsttab,'click');
    table.holders=holders;
    return table;
}
