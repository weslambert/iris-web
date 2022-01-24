/* remove user provided filter */
function removeFilter(clickedObject) {
    let inputObject = $(clickedObject)
                            .parents("table")
                            .find("input")[$(clickedObject).parents("th").index()] 
    inputObject.value=""; // Clear input
    $(inputObject).trigger("change"); // trigger change event
}

/* add a text input to each column of a given datatable to allow filtering */
function addFilterFields(tableId){
    $('#' + tableId + ' thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#' + tableId + ' thead');
}

/* callback function to activate filtering on a datatable */
function tableFiltering(api) {
    // For each column
    api
        .columns()
        .eq(0)
        .each(function (colIdx) {
            // Set the header cell to contain the input element
            var cell = $('.filters th').eq(
                $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<div  class="form-group has-feedback"><input type="text" class="form-control" placeholder="Filter"><i class="fas fa-times-circle form-control-feedback" onclick="removeFilter(this);"></i></div>');
            // On every keypress in this input
            $(
                'input',
                $('.filters th').eq($(api.column(colIdx).header()).index())
            )
                .off('keyup change')
                .on('keyup change', function (e) {
                    e.stopPropagation();
                    // Get the search value
                    $(this).attr('title', $(this).val());
                    var regexr = '({search})'; 
                    var cursorPosition = this.selectionStart;
                    // Search the column for that value
                    api
                        .column(colIdx)
                        .search(
                            this.value != ''
                                ? regexr.replace('{search}', '(((' + this.value + ')))')
                                : '',
                            this.value != '',
                            this.value == ''
                        )
                        .draw();
                    $(this)
                        .focus()[0]
                        .setSelectionRange(cursorPosition, cursorPosition);
                });
        });
}