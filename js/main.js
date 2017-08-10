

var originalImage;
var canvasFocus = false;
var inputCreated = false;
var input = document.createElement("input");
var textEditID = 1000;

var text

function dragNdrop() {
	container = document.querySelector("div");

	var canvas = document.getElementById("dropzone"),
		context = canvas.getContext("2d"),
		img = document.createElement("img"),
		// mouseDown = false,
		// brushColor = "rgb(0, 0, 0)",
		hasText = true,
		clearCanvas = function () {
			if (hasText) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				hasText = false;
			}
		};

	// Adding instruction text
	context.font="15px Arial";
	context.textAlign="center";
	context.fillText("Drop and image onto the canvas", canvas.width/2, canvas.height/2 -20);
	context.fillText("Click a spot to set as brush color", canvas.width/2, canvas.height/2 +20);

	// Image for loading
	img.addEventListener("load", function () {
		clearCanvas();
		var imgTooLarge = false;

		// if image is to big default to 500 x 500 size
		if (img.width > 500) {
			canvas.width = 500;
			imgTooLarge = true;
		} else {
			canvas.width = img.width;
		}

		if (img.height > 500) {
			canvas.height = 500;
		} else {
			canvas.height = img.height;
		}

		//context.scale(2, 2) // Doubles size of anything draw to canvas.
		imgTooLarge ? context.drawImage(img, 0, 0, 500, 500) : context.drawImage(img, 0, 0);

		// save the original image
		originalImage = canvas.toDataURL("image/png");
		//window.open(canvas.toDataURL("image/png"));
	}, false);

	// Mousedown event listener
	canvas.addEventListener("mousedown", function (evt) {
		canvasFocus	= true;
		clearCanvas();

		var xPos = evt.clientX - canvas.getBoundingClientRect().left;
		var yPos = evt.clientY - canvas.getBoundingClientRect().top;
		// mouseDown = true;
		// context.beginPath();
		drawNote(evt);
		addTextBox();
		//grayScale();
		darkenImage(-10, -10, -10);
		//invertColors();
		//brightenImage();
	}, false);

	// Enter key event listener, if canvas has focus(have not implemented yet)
	// this is where the input box would get saved and sent to the database
	window.addEventListener("keyup", function (evt) {
		if ( 13 == evt.keyCode && canvasFocus) {
			//alert("you press enter!");
			console.log("you press enter!");
		  alert(input.value());
		  //document.getElementById('input').style.display="none";
			context.drawImage(img, 0, 0, 500, 500);
			context.clearRect(0, 0, canvas.width, canvas.height);

		}
	});

	// Mpuseup event listener
	canvas.addEventListener("mouseup", function (evt) {
		// mouseDown = false;
		// var colors = context.getImageData(evt.layerX, evt.layerY, 1, 1).data;
		// brushColor = "rgb(" + colors[0] + ", " + colors[1] + ", " + colors[2] + ")";
	}, false);

	// Mousemove event listener
	canvas.addEventListener("mousemove", function (evt) {
		// if (mouseDown) {
		// 	context.strokeStyle = brushColor;
		// 	context.lineWidth = 20;
		// 	context.lineJoin = "round";
		// 	context.lineTo(evt.layerX+1, evt.layerY+1);
		// 	context.stroke();
		// }
	}, false);

	// dragover event listener
	canvas.addEventListener("dragover", function (evt) {
		evt.preventDefault();
	}, false);

	// Handle dropped image file - only Firefox and Google Chrome
	canvas.addEventListener("drop", function (evt) {
		var files = evt.dataTransfer.files;

		if (files.length > 0) {
			var file = files[0];
			if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
				var reader = new FileReader();

				reader.onload = function (evt) {
					img.src = evt.target.result;
				};
				reader.readAsDataURL(file);
			}
		}
		evt.preventDefault();
	}, false);

	// Save image button
	var saveImage = document.createElement("button");
	saveImage.innerHTML = "Save Edited Image";

	// saveImage btn event listener
	saveImage.addEventListener("click", function (evt) {
		var dt = canvas.toDataURL("image/png");
		//alert("button clicked");
		//this.href = dt;
		window.open(dt);
		//window.open(canvas.toDataURL("image/png"));
		evt.preventDefault();
	}, false);
	document.getElementById("main-content").appendChild(saveImage);

    // original image button annd event listener
	var button = document.getElementById('btn-download');
	button.addEventListener('click', function (e) {
	    //var dataURL = canvas.toDataURL('image/png');
	    window.open(originalImage);
	});
}

function addTextBox() {
	//Create an input type dynamically.
	var element = document.createElement("input");

	//Create Labels
	var label = document.createElement("Label");
	label.innerHTML = "Note #" + textEditID++ + ": ";

	//Assign different attributes to the element.
	element.setAttribute("type", "text");
	element.setAttribute("placeholder", "Enter Notes");
	element.setAttribute("name", "Notes");
	element.setAttribute("style", "width:200px");

	label.setAttribute("style", "font-weight:bold");

	// 'foobar' is the div id, where new fields are to be added
	var inputLabel = document.getElementById("notes");

	//Append the element in page (in span).
	inputLabel.appendChild(label);
	inputLabel.appendChild(element);
}

function drawNote(evt) {
	var canvas = document.getElementById("dropzone");
	var ctx = canvas.getContext("2d");
	
	var xPos = evt.clientX - canvas.getBoundingClientRect().left;
	var yPos = evt.clientY - canvas.getBoundingClientRect().top;

	ctx.beginPath();
	ctx.lineWidth="4";
	ctx.strokeStyle="green";
	ctx.rect(xPos-12.5,yPos-12.5,25,25);
	ctx.stroke();
}

function whateverYouWant(xPos, yPos, text){

}

function invertColors() {
	var canvas = document.getElementById("dropzone");
	var ctx = canvas.getContext("2d");

	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var pixels = imageData.data;
	var numPixels = imageData.width * imageData.height;

	for (var i = 0; i < numPixels; i++) {
		pixels[i*4] =     255 - pixels[i*4]; // red
		pixels[i*4 + 1] = 255 - pixels[i*4 + 2]; // green
		pixels[i*4 + 2] = 255 - pixels[i*4 + 3]; // blue;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.putImageData(imageData, 0, 0);
}

function darkenImage(r, g, b) {
	var canvas = document.getElementById("dropzone");
	var ctx = canvas.getContext("2d");

	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var pixels = imageData.data;
	var numPixels = imageData.width * imageData.height;

	for (var i = 0; i < numPixels; i++) {
		pixels[i*4]		=  pixels[i*4] + r;
		pixels[i*4 +1] =  pixels[i*4 +1] + g;
		pixels[i*4 +2] =  pixels[i*4+2] +b;
	}
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.putImageData(imageData, 0, 0);
}

function brightenImage() {
	var canvas = document.getElementById("dropzone");
	var ctx = canvas.getContext("2d");

	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var pixels = imageData.data;
	var numPixels = imageData.width * imageData.height;

	for (var i = 0; i < numPixels; i++) {
		var r = Math.floor((Math.random() * 255 )+ 1);
		//pixels[i*4]		=  pixels[i*4] + 10;
		//pixels[i*4 +1] =  pixels[i*4 +1] + 100;
		pixels[i*4 +2] =  pixels[i*4+2] + 100;
	}
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.putImageData(imageData, 0, 0);
}