//var addLinkContextItem = {
//    "id" : "Add_Link",
//    "title" : "Add Selected Link",
//    "contexts" : ["selection", "link"]
//};
//
//var addPageContextItem = {
//    "id" : "Add_Page",
//    "title" : "Add Page",
//    "contexts" : ["page"]
//}
//
//chrome.contextMenus.create(addLinkContextItem);
//
//chrome.contextMenus.create(addPageContextItem);
//
//chrome.contextMenus.onClicked.addListener(function(clickData){
//    
//    if(clickData.menuItemId == "Add_Link" && clickData.selectionText){
//        Console.log(clickData.selectionText);
//    }else if(clickData.menuItemId == "Add_Page"){
//        
//        
//        
//        chrome.storage.sync.set({
//                    "prids": productIDList.toString()
//                }, function () {
//                    // Notify that we saved.
//                    console.log('Settings saved');
//                });
//    }
//    
//})