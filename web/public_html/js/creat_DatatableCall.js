function create_Datatable(name) {
    return $(name).DataTable({
            "paging": true,
            "lengthChange": true,
            "searching": true,
            "ordering": true,
            "info": true,
             "scrollX":true,
             "scrollY": 390,
             scrollCollapse: true,
             "lengthMenu": [[-1,10, 25, 50 ], ["All",10, 25, 50]],
            "autoWidth": true
     })
}

function create_DatatableEmployee(name) {
    return $(name).DataTable({
            "paging": false,
            "lengthChange": true,
            "searching": false,
            "ordering": false,
            "info": false,
             "scrollX":true,
             scrollCollapse: true,
            "autoWidth": true
     }); 
}

function create_DatatableLeave(name) {
    return $(name).DataTable({
             responsive: true,
             "scrollX":true,
            "paging": true,
            "lengthChange": true,
            "searching": true,
            "ordering": true,
            "info": true,
            // "scrollX":true,
            scrollCollapse: true,
             "autoWidth": true
        });
}