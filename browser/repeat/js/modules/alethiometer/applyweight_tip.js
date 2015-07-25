/**
 *
 */

function applyweight_tip()
{
    picasays.innerHTML='Apply weight to experimental assay scores of all TE subfamilies<br>'+
        'The weight is between 0 and 1, proportional to each TE subfamily total bp # in the genome<br>'+
        'Such weight can be used to decrease random fluctuation of TE subfamilies with very low amount of total bp #';
    pica_go(250,40);
}