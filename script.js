let faceapi;
let detections = [];

let video;
let canvas;
let isSmiling = false;
let isSad = false;
let isNeutral = false;

function setup() {
  canvas = createCanvas(480, 360);
  canvas.id("canvas");

  video = createCapture(video);
  video.id("video");
  video.size(width, height);

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };

  
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function faceReady() {
  faceapi.detect(gotFaces);
}


function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;
  console.log(detections);

  clear();
  drawBoxs(detections);
  drawExpressions(detections, 20, 250, 14);

  setTimeout(() => {



    if (detections.length > 0 && detections[0].expressions.happy > 0.7 && !isSmiling) {
      sendChatMessage("You Look Happy!");
      document.getElementById("robotHappy").style.display = "block";
     
      isSmiling = detections[0].expressions.happy > 0.7;
    }
    else if(isSmiling){
      isSmiling = detections[0].expressions.happy > 0.7;      
    } else {
      document.getElementById("robotHappy").style.display = "none";
    }
  
    if (detections.length > 0 && detections[0].expressions.sad > 0.7 && !isSad) {
      sendChatMessage("You Look Sad!");
      document.getElementById("robotSad").style.display = "block";
      isSad = detections[0].expressions.sad > 0.7;
  
    } 
    else if(isSad) {
      isSad = detections[0].expressions.sad > 0.7;
    } else {
      document.getElementById("robotSad").style.display = "none";
    }
    if (detections.length > 0 && detections[0].expressions.neutral > 0.2 &&!isNeutral) {
      sendChatMessage("You Look Neutral!");
      document.getElementById("robotNeutral").style.display = "block";
      isNeutral = detections[0].expressions.neutral > 0.2;
    }
    else if(isNeutral) {
      isNeutral = detections[0].expressions.neutral > 0.2;
    }
    else {
      document.getElementById("robotNeutral").style.display = "none";
    }
  }, 1000);

  faceapi.detect(gotFaces);
}

function sendChatMessage(message) {
    const chatMessages = document.getElementById("chat-messages");
    const chatMessagesElement = document.createElement("div");
    chatMessagesElement.classList.add("chat-message", "bot");
    chatMessagesElement.textContent = message;
    chatMessages.appendChild(chatMessagesElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function drawBoxs(detections){
  if (detections.length > 0) {
    for (f=0; f < detections.length; f++){
      let {_x, _y, _width, _height} = detections[f].alignedRect._box;
      stroke(44, 169, 225);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
}



function drawExpressions(detections, x, y, textYSpace){
  if(detections.length > 0){
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} = detections[0].expressions;
    textFont('Helvetica Neue');
    textSize(1);
    noStroke();
    fill(44, 169, 225);

    text("neutral:       " + nf(neutral*100, 2, 2)+"%", x, y);
    text("happiness: " + nf(happy*100, 2, 2)+"%", x, y+textYSpace);
    text("anger:        " + nf(angry*100, 2, 2)+"%", x, y+textYSpace*2);
    text("sad:            "+ nf(sad*100, 2, 2)+"%", x, y+textYSpace*3);
    text("disgusted: " + nf(disgusted*100, 2, 2)+"%", x, y+textYSpace*4);
    text("surprised:  " + nf(surprised*100, 2, 2)+"%", x, y+textYSpace*5);
    text("fear:           " + nf(fearful*100, 2, 2)+"%", x, y+textYSpace*6);
  }else{
    text("neutral: ", x, y);
    text("happiness: ", x, y + textYSpace);
    text("anger: ", x, y + textYSpace*2);
    text("sad: ", x, y + textYSpace*3);
    text("disgusted: ", x, y + textYSpace*4);
    text("surprised: ", x, y + textYSpace*5);
    text("fear: ", x, y + textYSpace*6);
  }
}
