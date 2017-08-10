

var originalImage;
var inputCreated = false;
var input = document.createElement("input");
var textEditID = 1000;


function dragNdrop() {
	buttons();

	var canvas = document.getElementById("dropzone"),
		context = canvas.getContext("2d"),
		img = document.createElement("img"),
		mouseDown = false,
	    brushColor = "rgb(0, 0, 0)",
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

	}, false);

	// Mousedown event listener
	canvas.addEventListener("mousedown", function (evt) {
		clearCanvas();
		mouseDown = true;
		context.beginPath();
		drawNote(evt);
	}, false);

	// this is where the input box would get saved and sent to the database
	window.addEventListener("keyup", function (evt) {
		if ( 13 == evt.keyCode && canvasFocus) {
			console.log("you press enter!");
		  //document.getElementById('input').style.display="none";
			//context.drawImage(img, 0, 0, 500, 500);
			//context.clearRect(0, 0, canvas.width, canvas.height);

		}
	});

	// Mpuseup event listener
	canvas.addEventListener("mouseup", function (evt) {
		mouseDown = false;
		var colors = context.getImageData(evt.layerX, evt.layerY, 1, 1).data;
		brushColor = "rgb(" + colors[0] + ", " + colors[1] + ", " + colors[2] + ")";
	}, false);

	// Mousemove event listener
	canvas.addEventListener("mousemove", function (evt) {

		 var xPos = evt.clientX - canvas.getBoundingClientRect().left;
		 var yPos = evt.clientY - canvas.getBoundingClientRect().top;
		if (mouseDown) {
			// works like an eyedropper tool
			//context.strokeStyle = brushColor;
			context.strokeStyle =  "#ffff00";
			context.lineWidth = 10;
			context.lineJoin = "round";
			//context.lineTo(evt.layerX+1, evt.layerY+1);
			context.lineTo(xPos, yPos);
			context.stroke();
		}
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


}

function buttons() {
	var canvas = document.getElementById("dropzone");
	var ctx  = canvas.getContext("2d");
	// Load original image
	var loadOriginal = document.createElement("button");
	loadOriginal.innerHTML = "Reset image";
	var img = new Image;

	loadOriginal.addEventListener("click", function(evt) {
		ctx.drawImage(img, 0, 0);
			img.src = originalImage;

	})
	document.getElementById("buttons").appendChild(loadOriginal);

	// ################################################################################
	// Save edited image button
	var saveImage = document.createElement("button");
	saveImage.innerHTML = "Save Edited Image";

	saveImage.addEventListener("click", function (evt) {
		var dt = document.getElementById("dropzone").toDataURL("image/png");
		window.open(dt);
		evt.preventDefault();
	}, false);
	// Add button to the page
	document.getElementById("buttons").appendChild(saveImage);

  	// ################################################################################
	// Save original image button
	var saveOriginal = document.createElement("button");
	saveOriginal.innerHTML = "Save Original Image";

	saveOriginal.addEventListener("click", function(evt) {
		window.open(originalImage);
		evt.preventDefault();
	}, false);
	// Add button to the page
	document.getElementById("buttons").appendChild(saveOriginal);

	// ###############################################################################
	// Brighten the image
	var brightenImage = document.createElement("button");
	brightenImage.innerHTML = "Brighten";

	brightenImage.addEventListener("click", function(evt) {
		pixelManipulate(10, 10, 10);
	}, false);

	document.getElementById("button-div").appendChild(brightenImage);

	// ################################################################################
	// Darken the image
	var darkenImage = document.createElement("button");
	darkenImage.innerHTML = "Darken";

	darkenImage.addEventListener("click", function(evt) {
		pixelManipulate(-10, -10, -10);
	}, false);

	document.getElementById("button-div").appendChild(darkenImage);

	// ################################################################################
	// Invert the image
	var invertImage = document.createElement("button");
	invertImage.innerHTML = ("Invert");

	invertImage.addEventListener("click", function(evt) {
		invertColors();
	}, false);

	document.getElementById("button-div").appendChild(invertImage);

	// ################################################################################
	// Increase red
	var increaseRed = document.createElement("button");
	increaseRed.innerHTML = "Red";

	increaseRed.addEventListener("click", function(evt) {
		pixelManipulate(10,0,0);
	}, false);

	document.getElementById("button-div").appendChild(increaseRed);

	// ################################################################################
 	var increaseGreen = document.createElement("button");
 	increaseGreen.innerHTML = "Green";

 	increaseGreen.addEventListener("click", function(evt){
 		pixelManipulate(0,10,0);
 	}, false);

 	document.getElementById("button-div").appendChild(increaseGreen);

 	// ################################################################################
 	var increaseBlue = document.createElement("button");
 	increaseBlue.innerHTML = "Blue";

 	increaseBlue.addEventListener("click", function(evt) {
 		pixelManipulate(0,0,10);
 	}, false);
 	increaseBlue.value = 0;

 	document.getElementById("button-div").appendChild(increaseBlue);

	// ################################################################################
	var grayScaleImage = document.createElement("button");
	grayScaleImage.innerHTML = "Gray Scale";

	grayScaleImage.addEventListener("click", function(evt) {
		grayScale();
	}, false);

	document.getElementById("button-div").appendChild(grayScaleImage);

}


function addTextBox(id) {
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

	addTextBox();
}

// Note object to save the notes
function Note(xPos, yPos, text){
	this.id = textEditID++;
	this.xPos = xPos;
	this.yPos = yPos;
	this.text = text;
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

function grayScale() {
	var canvas = document.getElementById("dropzone");
	var ctx = canvas.getContext("2d");

	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var pixels = imageData.data;
	var numPixels = imageData.width * imageData.height;

	for (var i = 0; i < numPixels; i++) {
		var average = (pixels[i*4] + pixels[i*4 + 1] + pixels[i*4 + 2] ) /3;
		pixels[i*4]		=  average;
		pixels[i*4 +1] =  average;
		pixels[i*4 +2] =  average;
	}
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.putImageData(imageData, 0, 0);
}

function pixelManipulate(r, g, b) {
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
