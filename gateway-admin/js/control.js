const routes = ["conf_list", "settings", "sensors"];

let serial;

$(document).ready(function() {
    
    $(".refresh").on("click", function() {
        fetch($(this).attr('id'));
});

    for (let i = 0; i < routes.length; i++) {
        setTimeout(function() {
            fetch(routes[i]);
        }, i*1000);
    }

    $("#download").on("click", function() {
        let fileName = "log-" + serial + "-" + new Date().toISOString(); 
        downloadObjectAsJson(fileName);
    });

    openWS();
    
});

function fetch(id) {
    $.ajax({
        url: REST_ROUTE + id,
        type: "GET",
        success: function(data) {
            if (typeof data === "string") {
                $("#fetch-" + id).html(data);
            } else {
                if (id === "settings") {
                    serial = data.serial;
                }
                $("#fetch-" + id).html(JSON.stringify(data, undefined, 4));
            }
        }
    });
}

function downloadObjectAsJson(exportName){

    let separator = "\n\n######################\n";

    let stringOutput = $("#fetch-conf_list").val();
    stringOutput += separator + "Settings \n";
    stringOutput += $("#fetch-settings").val();
    stringOutput += separator + "Sensors \n";
    stringOutput += $("#fetch-sensors").val();
    stringOutput += separator + "Websocket \n";
    stringOutput += $("#ws-log").val();

    let dataStr = "data:text/html;charset=utf-8," + encodeURIComponent(stringOutput);
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".txt");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

function openWS() {
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
            document.getElementById("ws-log").value += evt.data; 
            document.getElementById("ws-log").scrollTop = document.getElementById("ws-log").scrollHeight;
        }

        ws.onclose = function() {
            document.getElementById("ws-log").value += "Connection is closed...\n";
        }
    }
}