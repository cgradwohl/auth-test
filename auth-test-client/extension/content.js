

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  switch (request.type){
      case "openModal":
        console.log('SWAG');
        fetch(chrome.extension.getURL('modal.html'))
        .then(response => response.text())
        .then(data => {
            document.body.innerHTML += data;
            // other code
            // eg update injected elements,
            // add event listeners or logic to connect to other parts of the app
            // $('#myModal').modal('show')
        }).catch(err => {
            // handle error
        });
          break;
      case "openIFrame": 
        $('#myFrame').show()
  }
});


// DIALOG MODAL
// var dialog = document.createElement("dialog")
// dialog.textContent = "This is a dialog"
// var button = document.createElement("button")
// button.textContent = "Close"
// dialog.appendChild(button)
// button.addEventListener("click", function() {
//   dialog.close();
// });
// document.body.appendChild(dialog)
// dialog.showModal()
