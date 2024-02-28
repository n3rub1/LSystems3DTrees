//Variables for trees
let angleInDegrees;
let axiom = "F";
let lengthOfBranch = 90;
let mainBranchThicness = 10;
let brachDetermination = 0;
let sentence = axiom;

//4 different rules for different looking trees
//and to create different looking trees

let rules = [];
rules[0] = {
    a: "F",
    b: "FF+[-F++G-F]-[+F--H+F]",
    c: "FF+[+F-G-F]-[-F+H+F]",
    d: "FGH"
}

//Variables for ground

let noiseColoumn, noiseRows;
let noiseScale = 5;
let noiseWidth = 6000;
let noiseHeight = 5000;
let zoff = 0;
let inc = 0.05;
let zinc = 0.01;
let start = 0;
let minVal = -50;
let maxVal = 50;
let startInc = 0;

function setup() {
    angleMode(DEGREES);
    createCanvas(2500, 3000, WEBGL);
    background(0)
    angleInDegrees = 25;
    noiseColoumn = noiseWidth / noiseScale;
    noiseRows = noiseHeight / noiseScale;
}

function draw() {
  
    //generate the ground
    generateGround();
    
    //generate three trees
    for( let i = 0; i < 3; i++){
        treeLoop(i)
        resetTrees()
    }

    //do not loop the draw method
    noLoop();
}



function treeLoop(treeNumber){
    //get an array for the three different tree locations
    let treeLocations = treeLocation()
    push()
    switch(treeNumber){
        case 0: translate(treeLocations[0], treeLocations[1], treeLocations[2]); break;
        case 1: translate(treeLocations[3], treeLocations[4], treeLocations[5]);break;
        case 2: translate(treeLocations[6], treeLocations[7], treeLocations[8]);break;
    }
    
    for( let i = 0; i < 4; i++){
        generateTrees()
    }
    
    pop()
    
}

function generateGround(){
    
    //generate ground using noise function
    //this function was extracted and then modified to match this assignment from
    //https://editor.p5js.org/nyxtom/sketches/j6EjnPJIN
    
    push();
    translate(0, height / 2, -500);
    rotateY(25);

    let c = makeGroundColour();
            fill(c);
            noStroke();
    
    translate(-1300, -500, -1500);
    rotateX(90);
    
    let yoff = -start;
    for (let y = 0; y < noiseRows - 1; y++) {
        let xoff = 0;
        beginShape(TRIANGLE_STRIP);
        for (let x = 0; x < noiseColoumn; x++) {
            vertex(x * noiseScale, y * noiseScale, map(noise(xoff, yoff, zoff), 0, 1, minVal, maxVal));
            vertex(x * noiseScale, (y + 1) * noiseScale, map(noise(xoff, yoff, zoff), 0, 1, minVal, maxVal));
            xoff += inc;
        }
        yoff += inc;
        endShape();
    }
    zoff += zinc;
    start += startInc;
    pop();
}


function generateTrees() {
    
    //create a sentence using the rules and call the 
    //to draw in turtle graphics
    
  lengthOfBranch *= 0.92;
  let nextSentence = "";
    
  for (let i = 0; i < sentence.length; i++) {
    let current = sentence.charAt(i);
    let found = false;
      
    for (let j = 0; j < rules.length; j++) {
      if (current == rules[j].a) {
        found = true;
          
        let r = Math.floor(random(0,3));
        switch(r){
            case 0: nextSentence += rules[j].b; break;
            case 1: nextSentence += rules[j].c; break;
            case 2: nextSentence += rules[j].d; break;
        }
        break;
        }
    }
      
    if (!found) {
      nextSentence += current;
    }
  }
    
  sentence = nextSentence;
  drawInTurtleGraphics();

}

function drawInTurtleGraphics() {

    //draw the trees based on the current character of the sentence
    
  for (let i = 0; i < sentence.length; i++) {
    let currentLetter = sentence.charAt(i);

    if (currentLetter == "F") { 
        let c = color('#964B00');
        fill(c);
        translate(0, -lengthOfBranch,0);
        
        // if main branch draw a box of 20xlengthOfBranchx10,
        // else 10xlengthOfBranch+50 x 10, finally 
        // else 5xlengthOfBranch+90 x 5
        
        if(brachDetermination == 0){
            box(20,lengthOfBranch,10); 
        }else if (brachDetermination == 1){
            box(10,lengthOfBranch+30,10); 
        }
        else{
            box(5,lengthOfBranch+70,5); 
        }

    } else if (currentLetter == "+") {
        rotateX(angleInDegrees)
        makeFlowers();
        
    } else if (currentLetter == "-") {
        rotateX(-angleInDegrees)
        makeFlowers();
        
    } else if (currentLetter == "[") {
        makeLeaves();
        brachDetermination++;
        push();
        
    } else if (currentLetter == "]") {
        makeLeaves();
        brachDetermination--;
        pop();
        
    }else if(currentLetter == "G"){
        rotateZ(angleInDegrees)
        makeFlowers()  
        
    }else if(currentLetter == "H"){
        rotateZ(-angleInDegrees)
        makeFlowers()
    }
  }
}

//make leaves
function makeLeaves(){
    if(brachDetermination > 1){
        for(let i =0; i < 5; i++){
            push();
            let c = makeRandomGreenColour();
            fill(c);
            noStroke();
            rotateY(i*10);
            ellipsoid(8,27,8);
            pop();
        }
  }
}

//make flowers
function makeFlowers(){ 
    if(brachDetermination > 1){
        for(let i =0; i < 3; i++){
            push();
            let c = makeRandomFlowerColour();
            fill(c);
            rotate(i*15);
            noStroke();
            ellipsoid(5,10,5);
            pop();
        }
  }
}

function makeRandomGreenColour(){
    let r = Math.floor(random(0,4))
    switch (r){
        case 0: return '#005A04'; break;
        case 1: return '#CCFFBB'; break;
        case 2: return '#3A5F0B'; break;
        case 3: return '#005502'; break;
    }
}

function makeRandomFlowerColour(){
    let r = Math.floor(random(0,4))
    switch (r){
        case 0: return '#ffe6ff'; break;
        case 1: return '#ffb3ff'; break;
        case 2: return '#ff99ff'; break;
        case 3: return '#ff6699'; break;
    }
}

function makeGroundColour(){
    return '#462e22'
}

//reset tree settings
function resetTrees(){
    sentence = axiom;
    rules = [];
    rules[0] = {
        a: "F",
        b: "FF+[-F++G-F]-[+F--H+F]",
        c: "FF+[+F-G-F]-[-F+H+F]",
        d: "FGH"
    }
    lengthOfBranch = 90;
}

//return the three trees location in an array
function treeLocation(){
    let xTree1, yTree1, zTree1
    let xTree2, yTree2, zTree2
    let xTree3, yTree3, zTree3
    
    xTree1 = -100
    yTree1 = 1000
    zTree1 = 0
    xTree2 = 600
    yTree2 = 1000
    zTree2 = 500
    xTree3 = -800
    yTree3 = 1000
    zTree3 = -700

    return [xTree1, yTree1, zTree1, xTree2, yTree2, zTree2, xTree3, yTree3, zTree3]
}



