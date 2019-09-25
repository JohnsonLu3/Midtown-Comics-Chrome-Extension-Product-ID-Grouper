var productIDList = [];
var showAddToListButton = true;
var baseUrl = "https://www.midtowncomics.com/search?rel=1&os=1&prids=";
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
    chrome.storage.sync.get("showBtn", function (obj) {
        showAddToListButton = obj["showBtn"];
        setSwitch();
    });
    addButtonToPage();
}
$(function () {
    $("#radio-one").change(function () {
        showAddToListButton = true;
        setSwitch();
    });
    $("#radio-two").change(function () {
        showAddToListButton = false;
        setSwitch();
    });
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
    $("#addPaste").click(function () {
        var paste = $("#pasteArea").val();
        paste = paste.split("\n");
        for (var i = 0; i < paste.length; i++) {
            var contained = false;
            for (var ii = 0; ii < productIDList.length; ii++) {
                if (productIDList[ii] != paste[i]) {
                    contained = true;
                }
            }
            productIDList.push(paste[i]);
        }
        chrome.storage.sync.set({
            "prids": productIDList.toString()
        })
        populateList();
    })
    $("#copy").click(function () {
        $("#link").select();
        document.execCommand("copy");
    })
    $("#clear").click(function () {
        $("#link").val("");
        $("#pasteArea").val("");
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

function setSwitch() {
    if (showAddToListButton) {
        $("#radio-one-label").html("Enabled");
        $("#radio-one").attr('checked', 'checked');
        $("#radio-two-label").html("");
        chrome.storage.sync.set({
            "showBtn": true
        })
        addButtonToPage();
    }
    else {
        $("#radio-one-label").html("");
        $("#radio-two-label").html("Disabled");
        $("#radio-two").attr('checked', 'checked');
        chrome.storage.sync.set({
            "showBtn": false
        })
        addButtonToPage();
    }
    addButtonToPage();
}

function addButtonToPage() {
    if (showAddToListButton) {
        chrome.tabs.executeScript({
            file: "add-button.js"
        }, function () {
            console.log("add-button.js injected")
        })
    }
}

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