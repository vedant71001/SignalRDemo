"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/notificationHub").build();

connection.start();
connection.on("ServerToClient", function (msg) {
    console.log(msg);
    let li = document.createElement("li");
    li.textContent = "Server Message: " + msg;
    li.classList.add("message");
    document.getElementById("msglist").appendChild(li);
});

connection.on("ServerToClientAudio", function (msg) {
    let audio = base64ToBlob(msg);
    let li = document.createElement("li");
    li.innerHTML = `<audio src="${URL.createObjectURL(audio)}"controls>
    </audio>`;
    li.classList.add("message");
    document.getElementById("msglist").appendChild(li);
});

function SendToServer() {
    let param = {
        Message: $("#message").val()
    };
    let li = document.createElement("li");
    li.textContent = "Your Message: " + param.Message;
    li.classList.add("text-end");
    li.classList.add("message");
    document.getElementById("msglist").appendChild(li);
    $("#message").val("")

    $.ajax({
        url: "/client/Index",
        type: "POST",
        data: param,
        success: function (data) {
        },
        error: function (err) {
            console.error(err);
        }
    })
}
function base64ToBlob(str) {
    // extract content type and base64 payload from original string
    var pos = str.indexOf(';base64,');
    var type = str.substring(5, pos);
    var b64 = str.substr(pos + 8);

    // decode base64
    var content = atob(b64);

    // create an ArrayBuffer and a view (as unsigned 8-bit)
    var buffer = new ArrayBuffer(content.length);
    var view = new Uint8Array(buffer);

    // fill the view, using the decoded base64
    for (var n = 0; n < content.length; n++) {
        view[n] = content.charCodeAt(n);
    }

    // convert ArrayBuffer to Blob
    var blob = new Blob([buffer], { type: type });

    return blob;
}


let audioChunks = [];
let mediaRecorder;

function RecordAudio() {
    if (event.target.value == "Record") {
        audioChunks = [];
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
                mediaRecorder.start();
            });
        event.target.value = "Stop";
    }
    else {
        mediaRecorder.stop();
        event.target.value = "Record";
        $("#sendAudio").removeClass("d-none");
    }
}

function handleDataAvailable(event) {
    audioChunks.push(event.data);
}

function SendAudio() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const reader = new FileReader()

    reader.readAsDataURL(audioBlob);
    reader.onload = () => {
        let formData = new FormData();
        formData.append("audio", reader.result);
        let li = document.createElement("li");
        li.innerHTML = `<audio src="${URL.createObjectURL(audioBlob)}" controls>
  </audio>`;
        li.classList.add("text-end");
        li.classList.add("message");
        document.getElementById("msglist").appendChild(li);
        $.ajax({
            url: "/client/SendAudio",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
            },
            error: function (err) {
                console.error(err);
            }
        })
    }
    
    $("#sendAudio").addClass("d-none");
}