/**
 * @param holder
 * @param num1
 * @param num2
 * @param style
 * @return table <br><br><br>
 */

function dom_bignumtable(holder,num1,num2,style)
{
    var table=dom_create('table',holder,style);
    var tr=table.insertRow(0);
    var td=tr.insertCell(0);
    table.num1=td;
    td.vAlign='top';
    td.style.fontSize='150%';
    td.style.fontWeight='bold';
    td.className='headcount';
    td.innerHTML=num1;
    td=tr.insertCell(-1);
    td.vAlign='top';
    td.style.fontSize='70%';
    td.style.opacity=.7;
    td.innerHTML='TOTAL / ';
    td=tr.insertCell(-1);
    td.vAlign='top';
    td.style.fontWeight='bold';
    td.className='headcount';
    table.num2=td;
    td.innerHTML=num2;
    td=tr.insertCell(-1);
    td.vAlign='top';
    td.style.fontSize='70%';
    td.style.opacity=.7;
    td.innerHTML='SHOWN';
    return table;
}
