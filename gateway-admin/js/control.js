$(document).ready(function() {
    $("#fetch-data").on("click", function() {
        $.ajax({
            url: "172.16.0.1:8080/conf_list",
            type: "GET",
            success: function(data) {
                console.log(data);
            }
        });
    });
});
