var productIDList = [];
var baseUrl = "https://www.midtowncomics.com/search?prids=";
var instructions = $("#instructions");
window.onload = function () {
    chrome.storage.sync.get("prids", function (obj) {
        console.log('Value currently is ' + obj["prids"]);
        var res = obj["prids"];
        if (res != null) {
            productIDList = res.split(",");
            if (productIDList.length > 0) {
                $("#link").val(baseUrl + productIDList);
            }
            populateList();
        }
    });
    chrome.storage.sync.get("InstructionsDismissed", function (obj) {
        var res = obj["InstructionsDismissed"];
        if (res == true) {
            $("#instructions").remove();
        }
    });
}
$(function () {
    $("#addProductId").click(function () {
        {
            console.log("add product link pressed");
            chrome.tabs.query({
                currentWindow: true
                , active: true
            }, function (tabs) {
                addPridID(tabs[0].url);
                chrome.storage.sync.set({
                    "prids": productIDList.toString()
                }, function () {
                    // Notify that we saved.
                    console.log('Settings saved');
                });
                if (productIDList.length > 0) {
                    $("#link").val(baseUrl + productIDList);
                }
                populateList();
            });
        }
    })
    $("#copy").click(function () {
        $("#link").select();
        document.execCommand("copy");
    })
    $("#clear").click(function () {
        $("#link").val("");
        chrome.storage.sync.remove("prids");
        $("#list").empty();
        productIDList = [];
    })
    $("#close").click(function () {
        $("#instructions").remove();
        chrome.storage.sync.set({
            "InstructionsDismissed": true
        });
    })
    $("#help").click(function () {
        chrome.storage.sync.set({
            "InstructionsDismissed": false
        });
        location.reload();
    })
})

function addPridID(url) {
    var prid = url;
    prid = prid.split("/");
    prid = prid[prid.length - 1];
    if (prid == "") {
        return;
    }
    for (var i = 0; i < productIDList.length; i++) {
        if (productIDList[i] == prid) {
            return;
        }
    }
    productIDList.push(prid);
}

function populateList() {
    $("#list").empty();
    var startTag = "<li id=\""
    var startTag2 = " \"><div><button class=\"deleteButton\">X</button><p>"
    var endTag = "</p></div></li>"
    for (var i = 0; i < productIDList.length; i++) {
        var htmlInject = startTag + productIDList[i] + startTag2 + productIDList[i] + endTag;
        $("#list").append(htmlInject);
    }
    if (productIDList.length < 0) {
        $("#link").val("");
    }
    else {
        $("#link").val(baseUrl + productIDList);
    }
    $(".deleteButton").click(function () {
        var pTag = $(this).siblings();
        var prid = pTag.html();
        console.log("PRESSED : " + prid);
        var index = productIDList.indexOf(prid);
        if (index > -1) {
            productIDList.splice(index, 1);
        }
        chrome.storage.sync.clear();
        chrome.storage.sync.set({
            "prids": productIDList.toString()
        });
        populateList();
    })
}