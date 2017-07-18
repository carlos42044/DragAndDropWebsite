var ogImage;
function dragNdrop() {
						container = document.querySelector("div");

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

						// Adding instructions
						// why does canvas.width/3 work and not canvas.width/2?
						context.font="15px Arial";
						context.textAlign="center";
						context.fillText("Drop and image onto the canvas", canvas.width/2, canvas.height/2 -20);
						context.fillText("Click a spot to set as brush color", canvas.width/2, canvas.height/2 +20);

						// Image for loading
						img.addEventListener("load", function () {
							clearCanvas();
							canvas.width = img.width;
							canvas.height = img.height;

							//context.scale(2, 2) // Doubles size of anything draw to canvas.

							context.drawImage(img, 0,0);
							// Trying to save the original image
							ogImage = canvas.toDataURL("image/png");
							//window.open(canvas.toDataURL("image/png"));


							//var containerWidth = container.getBoundingClientRect().width;
							//alert("the width of the container is " + containerWidth);
						}, false);

						// Detect mousedown
						canvas.addEventListener("mousedown", function (evt) {
							clearCanvas();
							mouseDown = true;
							context.beginPath();
							var input = document.createElement("input");
							input.type = "text";
							//input.className = "css-class-name"; // set the CSS class
							document.getElementById("main-content").appendChild(input); //
						}, false);

						// Detect mouseup
						canvas.addEventListener("mouseup", function (evt) {
							mouseDown = false;
							var colors = context.getImageData(evt.layerX, evt.layerY, 1, 1).data;
							brushColor = "rgb(" + colors[0] + ", " + colors[1] + ", " + colors[2] + ")";
						}, false);

						// Draw, if mouse button is pressed
						canvas.addEventListener("mousemove", function (evt) {
							if (mouseDown) {
								context.strokeStyle = brushColor;
								context.lineWidth = 20;
								context.lineJoin = "round";
								context.lineTo(evt.layerX+1, evt.layerY+1);
								context.stroke();
							}
						}, false);

						// To enable drag and drop
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
									// Note: addEventListener doesn't work in Google Chrome for this event
									reader.onload = function (evt) {
										img.src = evt.target.result;
									};
									reader.readAsDataURL(file);
								}
							}
							evt.preventDefault();
						}, false);

						// Save image
						var saveImage = document.createElement("button");
						saveImage.innerHTML = "Save canvas";
						saveImage.addEventListener("click", function (evt) {
							var dt = canvas.toDataURL("image/png");
							//alert("button clicked");
							//this.href = dt;
							window.open(dt);
							//window.open(canvas.toDataURL("image/png"));
							evt.preventDefault();
						}, false);
						document.getElementById("main-content").appendChild(saveImage);

						var button = document.getElementById('btn-download');
						button.addEventListener('click', function (e) {
						    //var dataURL = canvas.toDataURL('image/png');
						    window.open(ogImage);
						});

						 // put it into the DOM
						// var imgd = context.getImageData(0, 0, canvas.width, canvas.height);
						// var pix = imgd.data;
						// // Loop over each pixel and invert the color.
						// var red = 0;
						// for (var i = 0, n = pix.length; i < n; i += 4) {
						//     pix[i  ] = 255 - pix[i  ]; // red
						//     pix[i+1] = 255 - pix[i+1]; // green
						//     pix[i+2] = 255 - pix[i+2]; // blue
						//     // i+3 is alpha (the fourth element)
						// }
						// alert("red value ")
						// context.putImageData(imgd, 0, 0);

}
