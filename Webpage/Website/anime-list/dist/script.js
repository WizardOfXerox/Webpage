function myFunction() {
  // Declare variables
  var input, filter, ul, li, a, i;
  input = document.getElementById("mySearch");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myMenu");
  li = ul.getElementsByTagName("div");

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

// for duplicate pages, still on progress
// Broadcast that you're opening a page.
localStorage.openpages = Date.now();
var onLocalStorageEvent = function(e){
    if(e.key == "openpages"){
    // Listen if anybody else is opening the same page!
        localStorage.page_available = Date.now();
    }
    if(e.key == "page_available"){
        alert("You already have this page");
		window.close();
        }
    };
    window.addEventListener('storage', onLocalStorageEvent, false);

function fitText(outputSelector){
    // max font size in pixels
    const maxFontSize = 50;
    // get the DOM output element by its selector
    let outputDiv = document.getElementById(outputSelector);
    // get element's width
    let width = outputDiv.clientWidth;
    // get content's width
    let contentWidth = outputDiv.scrollWidth;
    // get fontSize
    let fontSize = parseInt(window.getComputedStyle(outputDiv, null).getPropertyValue('font-size'),10);
    // if content's width is bigger then elements width - overflow
    if (contentWidth > width){
        fontSize = Math.ceil(fontSize * width/contentWidth,10);
        fontSize =  fontSize > maxFontSize  ? fontSize = maxFontSize  : fontSize - 1;
        outputDiv.style.fontSize = fontSize+'px';   
    }else{
        // content is smaller then width... let's resize in 1 px until it fits 
        while (contentWidth === width && fontSize < maxFontSize){
            fontSize = Math.ceil(fontSize) + 1;
            fontSize = fontSize > maxFontSize  ? fontSize = maxFontSize  : fontSize;
            outputDiv.style.fontSize = fontSize+'px';   
            // update widths
            width = outputDiv.clientWidth;
            contentWidth = outputDiv.scrollWidth;
            if (contentWidth > width){
                outputDiv.style.fontSize = fontSize-1+'px'; 
            }
        }
    }
}

