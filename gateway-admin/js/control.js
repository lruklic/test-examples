const routes = ["conf_list", "settings", "sensors"];

$(document).ready(function() {
    
    $(".refresh").on("click", function() {
        fetch($(this).attr('id'));

    });

    for (let i = 0; i < routes.length; i++) {
        setTimeout(function() {
            fetch(routes[i]);
        }, i*1000);
    }

    $("#open-ws").on("click", function() {
        socket();
    });
    
});

function fetch(id) {
    $.ajax({
        url: REST_ROUTE + id,
        type: "GET",
        success: function(data) {
            // check if typeof string
            if (typeof data === "string") {
                $("#fetch-" + id).html(data);
            } else {
                $("#fetch-" + id).html(JSON.stringify(data, undefined, 4));
            }
        }
    });
}

function socket() {
    if ("WebSocket" in window) {
        console.log("WebSocket is supported by your Browser!");
        
        // Let us open a web socket
        var ws = new WebSocket(WS_ROUTE);
        
        ws.onopen = function() {
            document.getElementById("ws-log").value = "Connection is established... \n";
            setInterval(function() {
                ws.send("ping");
            }, 1000);
        };

        ws.onmessage = function (evt) {
            let message = evt.timeStamp.toFixed(0) + "\t" + evt.data.replace("Luka", "Tomica") + "\n";
            document.getElementById("ws-log").value += message; 
        }

        ws.onclose = function() {
            document.getElementById("ws-log").value += "Connection is closed...\n";
        }
    }
}