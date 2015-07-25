/**
 * @param event
 */

function tablisttab_click(event)
{
// clicking on a tab (div)
    var lst=event.target.table.tabs;
    var lst2=event.target.table.page_td.childNodes;
    for(var i=0; i<lst.length; i++) {
        lst[i].className='tablisttab_off';
        lst2[i].style.display='none';
    }
    event.target.className='tablisttab_on';
    lst2[event.target.tablist_idx].style.display='block';
}