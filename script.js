var s = function(script){
    let particles = [];
    let particleNum = 3;
    let qHold = "FALSE";
    let wHold = "FALSE";
    let eHold = "FALSE";
    let rHold = "FALSE";
    let qOut = "FALSE";
    let wOut = "FALSE";
    let eOut = "FALSE";
    let rOut = "FALSE";
    let pointGiveQ = 0;
    let pointGiveW = 0;
    let pointGiveE = 0;
    let pointGiveR = 0;
    let click = "READY";
    let currentSong = "NONE";
    let currentSongId = "0"
    let hitBoxHeight = 60;
    let ninja;
    let sauce;
    let fft;
    let points = 0;
    let keyLineQ = new Array(950);
    let keyLineW = new Array(950);
    let keyLineE = new Array(950);
    let keyLineR = new Array(950);
    let keys = [];
    let songs = 2;
    let readSpot = 1;
    let read = function(){
        for(let i = 0; i < readSpot; i++){
            // read and write note
            if(keyLineQ[readSpot] > 0){
                 keys[keys.length] = new Key(keyLineQ[readSpot],0,"q");
            }
            // read and write note
            if(keyLineW[readSpot] > 0){
                 keys[keys.length] = new Key(keyLineW[readSpot],150,"w");
            }
            // read and write note
            if(keyLineE[readSpot] > 0){
                 keys[keys.length] = new Key(keyLineE[readSpot],300,"e");
            }
            // read and write note
            if(keyLineR[readSpot] > 0){
                 keys[keys.length] = new Key(keyLineR[readSpot],450,"r");
            }
        }
        readSpot++;
    }
    let playButton;
    class Particle { 
        constructor(x,type){
            this.pos = script.createVector(x,script.height);
            this.vel = script.createVector(script.random(-2,2),script.random(-2,-10));
            this.alpha = 255;
            this.size = 30;
            this.deathRate = 10;
            this.type = type;
            if(this.type === "SPLASH"){
                this.vel.y *= 2;
                this.vel.x *= 2;
                this.deathRate = 30;
            }
        }
        show() {
            script.blendMode(script.OVERLAY);
            script.fill(script.random(100),script.random(200),script.random(255),this.alpha);
            script.ellipse(this.pos.x,this.pos.y,this.size,this.size);
            script.blendMode(script.BLEND);
        }
        update(){
            this.pos.add(this.vel); 
            this.alpha -= this.deathRate;
        }
          finished() {
            return this.alpha < 0;
          }

    }
    let particleSplash = function(){
        for(let i = 0; i < 10; i++){
            //particles[particles.length] = new Particle(script.random(0,script.width),"SPLASH");      
        }
    }
    let givePoints = function(){
        if(pointGiveQ === "TRUE"){
            points++;
            script.fill(0,255,100);
            script.rect(0 + 5 ,script.height - hitBoxHeight,140,hitBoxHeight);
        }
        if(pointGiveW === "TRUE"){
            points++;
            script.fill(0,255,100);
            script.rect(150 + 5 ,script.height - hitBoxHeight,140,hitBoxHeight);
        }
        if(pointGiveE === "TRUE"){
            points++;
            script.fill(0,255,100);
            script.rect(300 + 5 ,script.height - hitBoxHeight,140,hitBoxHeight);
        }
        if(pointGiveR === "TRUE"){
            points++;
            script.fill(0,255,100);
            script.rect(450 + 5 ,script.height - hitBoxHeight,140,hitBoxHeight);
        }
    }
    class Key{
        constructor(length,x,type){
            this.lengthBase = 25;
            this.length = length;
            this.x = x;
            this.y = 0;
            this.type = type;
            this.speed = 5;
            this.status = "ALIVE";
            this.width = 140;
            this.color = script.random(1,5);
        }
        show(){
            if(this.status === "ALIVE"){
                if(this.length > 1){
                    script.fill(255, 252, 119);    
                }
                else{
                    if(this.color > 2.5){
                        script.fill(119, 252, 255);
                    }
                    else{
                        script.fill(255,52,252);
                    }
                }
                script.noStroke();
                script.rect(this.x + 5,this.y - (this.length * this.lengthBase) ,this.width,this.length * this.lengthBase);
                script.stroke(255);
            }
        }
        update(){
            if(this.status === "ALIVE"){    
                this.y += this.speed;
                if(this.type === "q" && qHold === "TRUE" && this.y >= 340){
                    pointGiveQ = "TRUE";
                }
                 else if(this.type === "w" && wHold === "TRUE" && this.y >= 340){
                    pointGiveW = "TRUE";
                }
                 else if(this.type === "e" && eHold === "TRUE" && this.y >= 340){
                    pointGiveE = "TRUE";
                }
                 else if(this.type === "r" && rHold === "TRUE" && this.y >= 340){
                    pointGiveR = "TRUE";
                }
                else if (this.y > 350){
                    pointGiveQ = "FALSE";
                    pointGiveW = "FALSE";
                    pointGiveE = "FALSE";
                    pointGiveR = "FALSE";
                }
                if(this.y - (this.length * this.lengthBase) > script.height){
                    this.status = "DEAD";
                    pointGiveQ = "FALSE";
                    pointGiveW = "FALSE";
                    pointGiveE = "FALSE";
                    pointGiveR = "FALSE";
                }
            }

        }
        
    }
    class Rest{
         constructor(length){
            this.lengthBase = 25;
            this.length = length;
        }       
    }
    let map = function(){
         script.background(42,62,80);
         let spectrum = fft.analyze();
         for(var i = 0; i < spectrum.length; i++){
             let spacing = 50;
             script.stroke(255);
             var amp = spectrum[i];
             var y = script.map(amp,0,255,script.height,0);
             script.strokeWeight(spacing);
             script.colorMode(script.HSB);
             script.stroke((i + 6) * 12,255,200,0.5);
             script.line((i * spacing)+0.5*spacing,script.height,(i * spacing)+0.5*spacing,y);
             script.colorMode(script.RGB);
             script.strokeWeight(2);
             script.stroke(255);
         }
         script.fill(0,156,200,127.5);
         script.rect(0,script.height - hitBoxHeight,script.width,hitBoxHeight);

    }
    let play = "FALSE";
    let ninjaEncode = function(){
        // Q
            keyLineQ[14] = 5;
            keyLineQ[41] = 5;   
            keyLineQ[73] = 20;  
            keyLineQ[94] = 20;
            keyLineQ[116] = 20;
            keyLineQ[137] = 25;
        // W
            keyLineW[19] = 3;
            keyLineW[35] = 3;
            keyLineW[57] = 3;
            keyLineW[71] = 2;
            keyLineW[77] = 1;
            keyLineW[81] = 1;
            keyLineW[87] = 1;
            keyLineW[92] = 1;
            //keyLineW[94] = 1;
            keyLineW[97] = 1;
            keyLineW[100] = 1;
            keyLineW[103] = 1;
            keyLineW[107] = 1;
        // E
            keyLineE[7] = 5;
            keyLineE[25] = 5;
            keyLineE[46] = 5;
            keyLineE[62] = 3;
            keyLineE[67] = 3;
            keyLineE[73] = 1;
            keyLineE[74] = 1;
            keyLineE[76] = 1;
            keyLineE[78] = 1; 
            keyLineE[79] = 1; 
            keyLineE[83] = 1;
            keyLineE[84] = 1; 
            keyLineE[86] = 1; 
            keyLineE[88] = 1; 
            keyLineE[89] = 1; 
            keyLineE[91] = 1; 
            keyLineE[95] = 1;
            // triplets
            keyLineE[96] = 1;
            keyLineE[99] = 1;
            keyLineE[102] = 1;
            // like a bapist
            keyLineE[104] = 1
            keyLineE[106] = 1
        // R
            keyLineR[9] = 5;
            keyLineR[31] = 5;
            keyLineR[52] = 5;
            keyLineR[75] = 1;
            keyLineR[80] = 1;
            keyLineR[85] = 1;
            keyLineR[90] = 1;
            // when i tap this
            keyLineR[93] = 1;
            keyLineR[94] = 1;
            // triplets?
            keyLineR[98] = 1;
            keyLineR[101] = 1;
            // like a bapist
            keyLineR[105] = 1

    }
    let sauceEncode = function(){
        let offset = 1;
        // opening rift
        for(let i = 0; i < 4; i++){
        // Q
            if(i % 2 === 0){
                keyLineQ[4 + (i * 5)] = 2;
            }
        // W
            keyLineW[5 + (i*5)] = 2;  
        // E 
            keyLineE[6 + (i*5)] = 2;        
        // R
            keyLineR[7 + (i*5)] = 2;  
            if(i === 3){
                keyLineR[21] = 2;
                keyLineR[23] = 1;
            }
        }
       // Chorus
        for(let i = 0; i < 4; i++){
            keyLineR[25 + (i * 10)] = 1;
            keyLineE[27 + (i * 10)] = 1;
            keyLineW[29 + (i * 10)] = 1;
            keyLineQ[30 + (i * 10)] = 1;
            keyLineW[31 + (i * 10)] = 1;
            keyLineE[32 + (i * 10)] = 1;
            keyLineR[33 + (i * 10)] = 1;
        }
            // Q
                keyLineQ[68] = 2;
                keyLineQ[(71 + offset)] = 1;
                keyLineQ[79] = 1;
                keyLineQ[82] = 1;
                keyLineQ[90] = 1;
            // W
                keyLineW[64] = 1;
                keyLineW[67] = 1;
                keyLineW[(70 + offset)] = 1;
                keyLineW[86] = 2;
               // keyLineW[90] = 1;
                keyLineW[92] = 1;
                keyLineW[96] = 1;
            // E
                keyLineE[65] = 1; 
                keyLineE[66] = 1;
                keyLineE[(69 + offset)] = 1;
                keyLineE[(72 + offset)] = 1;
                keyLineE[(74 + offset)] = 1;
                keyLineE[(76 + offset)] = 1;
                keyLineE[80] = 1;
                keyLineE[83] = 1;
                keyLineE[85] = 1;
                keyLineE[87] = 1;
                keyLineE[89] = 1;
                keyLineE[94] = 1;
            // R
                keyLineR[(73 + offset)] = 1;
                keyLineR[(75 + offset)] = 1;
                keyLineR[78] = 1;
                keyLineR[81] = 1;
                keyLineR[84] = 1;
                keyLineR[88] = 1;
                keyLineR[98] = 1;
    // Verse 1 
        for(let i = 0; i < 4; i++){
        // Q
            keyLineQ[(104) + (i * 9)] = 1.5;
        // W
            keyLineW[(102) + (i * 9)] = 1.5;
            keyLineW[(108 - (offset * 2)) + (i * 9)] = 1.5;
        // E
            keyLineE[(100)] = 1.5;
            keyLineE[(107 - (offset * 2)) + (i * 9)] = 1;
            keyLineE[(109 - (offset * 2)) + (i * 9)] = 1;
            keyLineE[(111 - (offset * 2)) + (i * 9)] = 1;
        // R
            keyLineR[(106 - (offset * 2)) + (i * 9)] = 1;
            keyLineR[(110 - (offset * 2)) + (i * 9)] = 1;
        }
        for(let i=0; i < 2; i ++){
            // Q
                keyLineQ[138 + (i * 9)] = 1.5;
            // W
                keyLineW[136 + (i * 9)] = 1.5;
            // E 
                keyLineE[140 + (i * 9)] = 2;
                keyLineE[143 + (i * 9)] = 1;
                keyLineE[145 + (i * 9)] = 2;          
            // R
                keyLineR[144 + (i * 9)] = 1;
                keyLineR[146 + (i * 9)] = 2;
        }
        for(let i=0; i < 2; i ++){
            // Q
                //keyLineQ[] = 1;
            // W
                keyLineW[157 + (i * 10)] = 1;
                keyLineW[162 + (i * 10)] = 1;
            // E 
                keyLineE[156 + (i * 10)] = 1;
                keyLineE[158 + (i * 10)] = 1;
                keyLineE[160 + (i * 10)] = 1;
                keyLineE[163 + (i * 10)] = 1;
            // R
                keyLineR[159 + (i * 10)] = 1;
                keyLineR[161 + (i * 10)] = 1;
                keyLineR[164 + (i * 10)] = 1;
        }
        // WOAH!
        for(let i = 0; i < 4; i++){
            // Q
                keyLineQ[176 + (i * 7)] = 2;
                keyLineQ[178 + (i * 7)] = 1;
            // W
                keyLineW[179 + (i * 7)] = 1;
                keyLineW[183 + (i * 7)] = 1;
            // E
                keyLineE[180 + (i * 7)] = 1;
                keyLineE[182 + (i * 7)] = 1;
            // R
                keyLineR[176 + (i * 7)] = 2;
                keyLineR[181 + (i * 7)] = 1;
        }
    }
    script.preload = function(){
        ninja = script.loadSound('NINJA.mp3');
        sauce = script.loadSound("sauce.mp3");
    }
    script.mouseReleased = function(){
        click = "READY";
    }
    script.keyPressed = function(){
        if(script.keyCode === 81){    
            qHold = "TRUE";
        }
        if(script.keyCode === 87){
            wHold = "TRUE";
        }
        if(script.keyCode === 69){
            eHold = "TRUE";
        }
        if(script.keyCode === 82){
            rHold = "TRUE";
        }
        console.log(readSpot);
    }
    script.keyReleased = function(){
        if(script.keyCode === 81){
            qHold = "FALSE";
            qOut = "TRUE";
            particleNum = 6;
        }
        if(script.keyCode === 87){
            wHold = "FALSE";
            wOut = "TRUE";
            particleNum = 6;
        }
        if(script.keyCode === 69){
            eHold = "FALSE";
            eOut = "TRUE";
            particleNum = 6;
        }
        if(script.keyCode === 82){
            rHold = "FALSE";
            rOut = "TRUE";
            particleNum = 6;
        }
    }
    script.setup = function(){
        let c = script.createCanvas(600,400);
        script.background(2);
        fft = new p5.FFT(0.9,16);
        document.getElementById("load").style.display = "none"; 
        document.getElementById("play").style.display = "block"; 
        document.getElementById("song").style.display = "block"; 
        document.getElementById("points").style.display = "block"; 
        script.frameRate(30);
    }  
    script.draw = function(){
        //console.log(script.frameCount);
        document.getElementById("play").addEventListener("click", function(){
            play = "TRUE";
        });
        document.getElementById("song").addEventListener("click", function(){
            if(click === "READY"){
                currentSongId++;
                if(currentSongId === 1){
                    document.getElementById("song").innerHTML = "Josh A - NINJA"
                    currentSong = "NINJA";
                }
                else if(currentSongId === 2){
                    document.getElementById("song").innerHTML = "Josh A - SZECHUAN SAUCE"
                    currentSong = "sauce";                   
                }
                if(currentSongId > songs){
                    currentSongId = 1;
                    document.getElementById("song").innerHTML = "Josh A - NINJA"
                    currentSong = "NINJA";
                }
                console.log(currentSongId);
                console.log(currentSong);
                click = "HELD";
            }
        }); 
        document.getElementById("points").innerHTML = "Points: " + points;
        if(play === "TRUE"){
            if(currentSong === "NINJA"){
                readSpot = 0;
                ninja.play();
                ninja.setVolume(0.3);
                setInterval(read,200);
                ninjaEncode();
            }
            else if(currentSong === "sauce"){
                readSpot = 0;
                sauce.play();
                sauce.setVolume(0.3);
                setInterval(read,200); 
                sauceEncode();
            }
            play = "FALSE"
        }
        script.noStroke();
        script.strokeWeight(20);    
        map();
        selectorWidth = 140;
        //console.log(particles);
            if(qHold === "TRUE"){
                 script.fill(0,150,150,200);
                 script.rect(5,0,selectorWidth,script.height);
                 particleNum = script.round(script.random(0,1));
                    for (let i=0; i < particleNum; i++){
                        particles[particles.length] = new Particle(script.random(0,150),"NORMAL");
                    } 
             if(pointGiveQ === "FALSE"){
                 points -= 0.5;
                script.fill(255,0,100);
                script.rect(0 + 5 ,script.height - hitBoxHeight,140,hitBoxHeight);
             }
            }
            if(wHold === "TRUE"){
             particleNum = script.round(script.random(0,1));
             script.fill(0,150,150,200);
             script.rect(155,0,selectorWidth,script.height);
                for (let i=0; i < particleNum; i++){
                    particles[particles.length] = new Particle(script.random(150,300),"NORMAL");
                }  
             if(pointGiveW === "FALSE"){
                 points -= 0.5;
                script.fill(255,0,100);
                script.rect(150 + 5 ,script.height - hitBoxHeight,140,hitBoxHeight);
             }
            }
            if(eHold === "TRUE"){
             particleNum = script.round(script.random(0,1));
             script.fill(0,150,150,200);
             script.rect(305,0,selectorWidth,script.height);
                for (let i=0; i < particleNum; i++){
                    particles[particles.length] = new Particle(script.random(300,450),"NORMAL");
                }   
             if(pointGiveE === "FALSE"){
                 points -= 0.5;
                script.fill(255,0,100);
                script.rect(300 + 5 ,script.height - hitBoxHeight,140,hitBoxHeight);
             }
            //console.log(keys[1].y + " " + keys[1].type);
            }
            if(rHold === "TRUE"){
             particleNum = script.round(script.random(0,1));  
                 script.fill(0,150,150,200);
                 script.rect(455,0,selectorWidth,script.height);
                for (let i=0; i < particleNum; i++){
                    particles[particles.length] = new Particle(script.random(450,600),"NORMAL");
                } 
             if(pointGiveR === "FALSE"){
                 points -= 0.5;
                script.fill(255,0,100);
                script.rect(450 + 5 ,script.height - hitBoxHeight,140,hitBoxHeight);
             }
            } 
        // Key Handling
            for(let i=0; i < keys.length; i++){
                keys[i].show();
                keys[i].update();
            }
         for(let x = 0; x <= script.width; x+= 150){
             // drawing lines
             script.stroke(255);
             script.strokeWeight(15);
             script.fill(255);
             script.line(x,0,x,script.height); 
             script.strokeWeight(2);
        }
        givePoints();
        // Particle Handling
            for (let i=0; i < particles.length; i++){
                particles[i].show();
                particles[i].update();
                if (particles[i].finished()) {
                  // remove this particle
                  particles.splice(i, 1);
                }
            }
            if(readSpot === 187  || readSpot === 197 || readSpot === 207|| readSpot === 215| readSpot === 225 && currentSong === "sauce"){
                particleSplash();
            }
    }
}
var myp5 = new p5(s);  