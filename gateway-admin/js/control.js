const routes = ["conf_list", "settings", "sensors"];

let ws;

let serial;

let fullLog = [];
let shownLog = [];

const logLength = (typeof MAX_WS_LOG_LENGTH !== 'undefined' ? MAX_WS_LOG_LENGTH : 20000);
const restRoute = (typeof REST_ROUTE !== 'undefined' ? REST_ROUTE : "http://localhost:8080/");
const wsRoute = (typeof WS_ROUTE !== 'undefined' ? WS_ROUTE : "ws://localhost:8080/ws");

$(document).ready(function() {
   
    $('body').on('click', '.radio-group', function() {
        let name = $(this).find("input").attr("name");
        let value = $(this).find("input").val();
        console.log(JSON.stringify({"logs" : [{tag: name, level: value}]}));
        $.ajax({
            url: REST_ROUTE + "loglevel",
            type: "POST",
            data: JSON.stringify({"logs" : [{tag: name, level: value}]}),                        
        });
    });

    fetchLogLevels();

    $(".refresh").on("click", function() {
        fetch($(this).attr('id'));
    });

    $("#closeWs").on("click", function() {
        ws.close();
        console.log("Connection was closed by user...\n");
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

function fetchLogLevels() {

    const generateAlertTags = function(alertTags) {
        if (alertTags.length > 0) {
            let tags = "";
            let radioGroup = "";
            for (let i = 0; i < alertTags.length; i++) {
                tags += `<div class="padding-top-5 height-25 tag">${alertTags[i].tag}</div>`;
                let radioGroupInputs = "";
                for (let j = 0; j < 6; j++) {
                    radioGroupInputs += `<div class="radio-group"><input type="radio" name="${alertTags[i].tag}" value="${j}" ${j == alertTags[i]?.level  ? `checked="checked"` : ""}></div>`;
                }
                radioGroup += `<div class="row height-25 padding-top-5"><div class="level-label"></div>${radioGroupInputs}</div>`;
            }
            $(".tags-container").append(tags);
            $(".level-container").append(radioGroup);            
        }
    }

    // remove when API implemented
    let demo = {
        "logs": [
            {"tag":"koa_comm", "level":2},
            {"tag":"emgw_lcd", "level":2},
        ]
    }
    generateAlertTags(demo.logs);

/*     $.ajax({
        url: REST_ROUTE + "loglevel",
        type: "GET",
        success: function(data) {
            generateAlertTags(demo.logs);
        }
    }); */

}

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
    stringOutput += fullLog.join("");

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
        ws = new WebSocket(WS_ROUTE);
        
        ws.onopen = function() {
            console.log("Connection is open...");
            document.getElementById("ws-log").value = "Connection is established... \n";
            ws.send("ping");
        };

        ws.onmessage = function (evt) {
            fullLog.push(evt.data);
            shownLog.push(evt.data);
            if  (document.getElementById("ws-log").value.length > logLength) {
                shownLog.shift();
            }
            document.getElementById("ws-log").value = shownLog.join(""); 
            if ($("#wsAutoScroll").is(":checked")) {
                document.getElementById("ws-log").scrollTop = document.getElementById("ws-log").scrollHeight;
            }
        }

        ws.onerror = function (evt) {
            console.log("Error: " + evt.data);
        };

        ws.onclose = function() {
            console.log("Connection is closed...");
            document.getElementById("ws-log").value += "Connection is closed...\n";
        }
    }
}