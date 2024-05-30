let faceapi;
let detections = [];

let video;
let canvas;
let isSmiling = false;
let isSad = false;
let isNeutral = false;
let isAngry = false;


let sentenceHappy = ["That's wonderful to see! Happiness is such a beautiful emotion.", "It's great to see you in such high spirits! Keep shining bright!", "Your happiness is contagious! Wishing you even more joyful moments ahead.", "Embrace the happiness within you, for it's a precious gift you deserve.", "Let your happiness radiate outwards, lighting up the world around you.", "Happiness looks fantastic on you! Keep smiling and spreading positivity.", "Cherish this moment of joy, for happiness is the key to a fulfilling life.", "Your happiness is like sunshine on a cloudy day, bringing warmth to all around.", "Keep basking in the glow of happiness, for it's where true contentment lies.", "The world is a brighter place with your happiness shining through!"];
let sentenceSad = [
            "I'm sorry to hear that you're feeling sad. Remember, it's okay not to be okay sometimes.",
  "Feeling sad is a natural part of life's ups and downs. Take your time to process your emotions.",
  "Your sadness won't last forever. Better days are ahead, even if it doesn't feel like it right now.",
  "Even in moments of sadness, remember that you're not alone. Reach out to someone you trust for support.",
  "Sadness can be a teacher, helping us appreciate the brighter moments in life even more.",
  "Allow yourself to feel your sadness fully, but also remember to be kind to yourself during this time.",
  "It's okay to cry and let your emotions out. Sometimes, that's the first step towards healing.",
  "Your sadness is valid, and so are you. Take care of yourself as you navigate through these emotions.",
  "When you're feeling sad, try to engage in activities that bring you comfort and solace.",
  "Sending you virtual hugs and warmth during this difficult time. Remember, brighter days are ahead."
];

let sentenceAngry = [
  "Maintaining a neutral expression can sometimes be a sign of inner calm and composure.",
  "Even in moments of apparent neutrality, there may be a wealth of thoughts and emotions beneath the surface.",
  "A stone face can often be a mask hiding deeper complexities and layers of experience.",
  "Embracing a neutral expression allows one to observe the world with clarity and objectivity.",
  "In a world full of noise and chaos, a stone face can be a symbol of steadfastness and stability.",
  "Behind a stone face may lie a mind that is contemplative, introspective, and deeply reflective.",
  "Sometimes, a stone face is a shield protecting the soul from the turbulence of external circumstances.",
  "While others may perceive a stone face as devoid of emotion, it can be a sanctuary for inner peace.",
  "A stone face can serve as a canvas upon which the subtle nuances of life's experiences are painted.",
  "In moments of stillness and serenity, a stone face can be a testament to the resilience of the human spirit."
];

function pauseVid() {
  video.pause();
}

function playVid() {
  video.play();
}





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

  const happyRandomIndex = Math.floor(Math.random() * sentenceHappy.length);
  const sadRandomIndex = Math.floor(Math.random() * sentenceSad.length);
  const angryRandomIndex = Math.floor(Math.random() * sentenceAngry.length);

  const happyMessage = sentenceHappy[happyRandomIndex];
  const sadMessage = sentenceSad[sadRandomIndex];
  const angryMessage = sentenceAngry[angryRandomIndex];

  detections = result;
  console.log(detections);

  clear();
  drawBoxs(detections);
  drawExpressions(detections, 20, 250, 14);
    if (detections.length > 0 && detections[0].expressions.happy > 0.7 && !isSmiling) {
      isSmiling = true;
      isSad = false;
      isNeutral = false;
      sendChatMessage(happyMessage);
      setTimeout(() => {
        
      }, 500); 
    } else if (detections.length > 0 && detections[0].expressions.sad > 0.7 && !isSad) {
      isSad = true;
      isSmiling = false;
      isNeutral = false;
      sendChatMessage(sadMessage);
      
    } else if (detections.length > 0 && detections[0].expressions.angry > 0.99 && !isNeutral) {
      isNeutral = false;
      isAngry = true;
      isSmiling = false;
      isSad = false;
      sendChatMessage(angryMessage);
      
    } else {
      isSmiling = detections[0].expressions.happy > 0.7;
      isSad = detections[0].expressions.sad > 0.7;
      isNeutral = detections[0].expressions.neutral > 0.99;
      isAngry = detections[0].expressions.angry > 0.7;
    }

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
      strokeWeight(0);
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



