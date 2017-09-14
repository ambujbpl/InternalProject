// console.log(">>>>>>>>ajaxhendler.js");
var loginObj= storagegetItem("login");
// console.log(loginObj);
function Posthandler(url, dataArray,asyncType) {
    $.support.cors = true;
    return $.ajax({
      url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dataArray),
        datatype: "json",
        async: asyncType,
        headers: {
        'X-access-Token' : loginObj.Tokan
        },
        success: function(resp) {},
        error: function(err) {}
    });
}

function Gethandler(url) {
    return $.ajax({
        url: url,
        type: 'GET',
        datatype: "json",
        async: true,
        success: function(res) {},
        error: function(err) {}
    });
}
