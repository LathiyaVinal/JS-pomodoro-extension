chrome.action.onClicked.addListener(function() {

    console.log("Button action click ");
    var w = 440;
    var h = 220;
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2); 

    chrome.windows.create({'url': 'index.html', 'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top} , function(window) {
    });
});

chrome.windows.getCurrent((tabWindow) => { 

    console.log("Button window getcurrent");

    const targetURL = 'index.html'
    chrome.windows.getAll({populate : true, windowTypes:['popup']}, (windowArray)=>{
      const queryURL = `chrome-extension://${chrome.runtime.id}/${targetURL}`
      const target = windowArray.find(item=>item.tabs[0].url === queryURL) 
      if (windowArray.length > 0 && target !== undefined) {
        chrome.windows.update(target.id, {focused: true}) 
        return
      }
  
      // Otherwise, Create
      const width = Math.round(tabWindow.width * 0.5)
      const height = Math.round(tabWindow.height * 0.75)
      const left = Math.round((tabWindow.width - width) * 0.5 + tabWindow.left)
      const top = Math.round((tabWindow.height - height) * 0.5 + tabWindow.top)
  
      chrome.windows.create(
        {
          focused: true,
          url: targetURL,
          type: 'popup',
          width, height,
          left, top
        },
        (subWindow) => {
        }
      )
    })
  })