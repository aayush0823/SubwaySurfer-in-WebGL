var cubeRotation = 0.0;
var no_coins_l=Math.round(Math.random()*200)+100;
var no_coins_r=Math.round(Math.random()*200)+100;
var no_coins_m=Math.round(Math.random()*200)+100;
var coin=[];
var bush=[];
var trains=[];
var boots=[];
var sb=[];
var jets=[];
var walls=[];
var magnets=[];
var player_speed=0.4;
var high_jump=0;
var jet_pack=0;
var count_jump=0;
var count_jet=0;
var score=0;
var magnet_on=0;
var count_magnet=0;

var track_texture;
var door_texture;
var side_texture;
var boot_texture;
var breaker_texture;
var grass_texture;
var jet_texture;
var track_texture;
var magnet_texture;
var prevgrey = grey;
var bright_count = 0;
var bright_val = 1.0;
main();
function main() {

  
  playSound("data/sound/back.mp3", 9999, 0.2, 0);
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  trackl = new track(gl ,[ -5,0 , 0.8 , 0 ]);
  trackm = new track(gl ,[ 0,0 , 0.8 , 0 ]);
  trackr = new track(gl ,[ 5,0 , 0.8 , 0 ]);
  lwall = new swall(gl ,[ 0,0 , 0.8 , 0 ],1);
  rwall = new swall(gl ,[ 0,0 , 0.8 , 0 ],0);

  head = new cube(gl, [0.0, 0.0, -2.0],1,0);
  body = new cube(gl, [0.0, -0.8, -2.0],2,0);

  heade = new cube(gl, [0.0, 0.0, 0.0],1,1);
  bodye = new cube(gl, [0.0, -1.0, 0.0],2,1);

  track_texture = loadTexture(gl, "./data/images/track.jpg");
  train_texture = loadTexture(gl, "./data/images/train.jpeg");
  door_texture = loadTexture(gl, "./data/images/side.jpg");
  side_texture = loadTexture(gl, "./data/images/side.jpeg");
  boot_texture = loadTexture(gl, "./data/images/shoe.jpeg");
  breaker_texture = loadTexture(gl, "./data/images/speed.png");
  grass_texture = loadTexture(gl, "./data/images/grass.jpeg");
  jet_texture = loadTexture(gl, "./data/images/jetpack.jpeg");
  magnet_texture = loadTexture(gl, "./data/images/magnet.jpeg");

  var placement = 10;
  for(var i=0;i<no_coins_l;)
  {
  	var x = Math.random()*10;
  	if(Math.random()*2>1)
  	{
  		for(var j=0;j<x && i<no_coins_l;j++)
  		{
    		coin.push(new coins(gl,[-5.0,-0.5,-placement*3]));
    		placement++;
    		i++;
  		}
  		placement+=3;
  	}
  	else
  	{
  		placement+=x;
  	}
  }
  placement = 10;
  for(var i=0;i<no_coins_r;)
  {
  	var x = Math.random()*10;
  	if(Math.random()*2>1)
  	{
  		for(var j=0;j<x && i<no_coins_r;j++)
  		{
    		coin.push(new coins(gl,[5.0,-0.5,-placement*3]));
    		placement++;
    		i++;
  		}
  		placement+=3;
  	}
  	else
  	{
  		placement+=x;
  	}
  }
  placement = 10;
  for(var i=0;i<no_coins_m;)
  {
  	var x = Math.random()*10;
  	if(Math.random()*2>1)
  	{
  		for(var j=0;j<x && i<no_coins_m;j++)
  		{
    		coin.push(new coins(gl,[0,-0.5,-placement*3]));
    		placement++;
    		i++;
  		}
  		placement+=3;
  	}
  	else
  	{
  		placement+=x;
  	}
  }
  placement=10;
  for(var i=0;i<15;)
  {
  	if(Math.random()*40<1)
  	{
		bush.push(new speedbreaker(gl,[(i%3-1)*5,-1.0,-placement*3]));
		i++;
  	}
		placement++;
  }
  placement=10;
  for(var i=0;i<15;)
  {
  	if(Math.random()*48<1)
  	{
  		var x=1;
  		if(i%2==0)
  			x=-1
		trains.push(new train(gl,[x*5,0.5,-placement*3]));
		i++;
		placement+=10;
  	}
		placement++;
  }
  placement=10;
  for(var i=0;i<15;)
  {
  	if(Math.random()*42<1)
  	{
		walls.push(new wall(gl,[-(i%3-1)*5,0.5,-placement*3]));
		i++;
  	}
		placement++;
  }
  placement=10;
  for(var i=0;i<15;)
  {
  	if(Math.random()*32<1)
  	{
		sb.push(new speedbreaker(gl,[((i+1)%3-1)*5,-1.0,-placement*3]));
		i++;
  	}
		placement++;
  }
  placement=10;
  for(var i=0;i<10;)
  {
  	 if(Math.random()*70<1)
  	{
		boots.push(new boot(gl,[((i+1)%3-1)*5,0.0,-placement*3]));
		i++;
  	}
		placement++;
  }

  placement=10;
  for(var i=0;i<10;)
  {
  	 if(Math.random()*70<1)
  	{
		jets.push(new jet(gl,[((i+1)%3-1)*5,0.0,-placement*3]));
		i++;
  	}
		placement++;
  }

  placement=10;
  for(var i=0;i<10;)
  {
  	 if(Math.random()*70<1)
  	{
		magnets.push(new magnet(gl,[((i+1)%3-1)*5,0.0,-placement*3]));
		i++;
  	}
		placement++;
  }

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;


  const vsSourceTexture = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
    vec4 toGrayscale(in vec4 color) {
    float average = (color.r + color.g + color.b) / 3.0;
    return vec4(average, average, average, 1.0);
  }
  
  `;

  // Fragment shader program

  const fsSourceTexture = `
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;
  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const shaderProgramTexture = initShaderProgram(gl, vsSourceTexture, fsSourceTexture);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  const programInfoTexture = {
    program: shaderProgramTexture,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgramTexture, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgramTexture, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgramTexture, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgramTexture, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgramTexture, 'uSampler'),
    },
};
  
  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers

  var then = 0;

  // Draw the scene repeatedlyzz
  function render(now) {
  	if(prevgrey != grey)
  	{
		convertToGrey(gl,grey);
		prevgrey=grey;
  	}
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    if(head.pos[2]>500)
    	terminate();
    drawScene(gl, programInfo, programInfoTexture, deltaTime);
    tick();
    collision_detection();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// Draw the scene.
//
trackl.pos[1]=head.pos[1]-1.5;
trackr.pos[1]=head.pos[1]-1.5;
trackm.pos[1]=head.pos[1]-1.5;

function tick()
{
	if(player_speed<0.4 && dead==0)
	{
		console.log("alive");
		player_speed+=0.001;
	}
	if(magnet_on==1)
		count_magnet+=0.001;
	if(count_magnet>1)
	{
		count_magnet=0;
		magnet_on=0;
	}
	bright_count+=0.01;
	if(bright_count>1)
	{
		bright_count=0;
		brightit();
	}
	if(jet_pack==1)
		count_jet += 0.001;
	if(count_jet>1)
	{
		count_jet=0;
		jet_pack=0;
		for(var j=0;j<coin.length;j++)
    			coin[j].pos[1]=-0.5;
    	jump=-1;
    	console.log("done")
	}
	if(high_jump==1)
		count_jump += 0.001;
	if(count_jump>1)
	{
		count_jump=0;
		high_jump=0;
	}
	if(high_jump==1 && jet_pack==0)
	{
		if(head.pos[1]>6.0)
			jump=-1;
	}
	else if(head.pos[1]>3.0 && jet_pack == 0 )
		jump=-1;

	for(var i=0;i<trains.length;i++)
	{
		if((head.pos[2]-trains[i].pos[2])<8.2 && (head.pos[2]-trains[i].pos[2])>-8.2 && head.pos[0]==trains[i].pos[0])
		{
			if(head.pos[1]>=4.2 && head.pos[1]<4.7)
				head.pos[1]=4.2-0.15*(jump*(high_jump+1));
			else if(head.pos[1]<4.2)
			{
				console.log("die");
				die();
			}
		}
	}

	if(jet_pack==1)
		head.pos[1]=6.0;

	if(head.pos[1]<0.0)
	{
		head.pos[1]=0;
		jump=0;
	}
	head.pos[1] += 0.15*(jump*(high_jump+1));
    head.pos[2] -= player_speed;
    head.pos[0] = 5*track_mul;
    body.pos[2] = head.pos[2];
    body.pos[1] = head.pos[1]-0.8;
    body.pos[0] = head.pos[0];

    heade.pos[2]-=player_speed*0.95;
    heade.pos[0]=5*track_mul;
    bodye.pos[2]=heade.pos[2];
    bodye.pos[1]=heade.pos[1]-1.0;
    bodye.pos[0]=heade.pos[0];
}
function collision_detection()
{
    for(var i=0;i<coin.length;i++)
    {
    	if(magnet_on==1 && (body.pos[2] - coin[i].pos[2]) < 0.2 && (body.pos[2] - coin[i].pos[2]) > -0.2)
    	{
    		coin.splice(i,1);
    		score++;
    		document.getElementById("mark").innerHTML="Your Score:" + score;
    	}
    	else if(body.pos[0] == coin[i].pos[0] && (body.pos[2] - coin[i].pos[2]) < 0.2 && (body.pos[2] - coin[i].pos[2]) > -0.2)
    	{
    		coin.splice(i,1);
    		score++;
    		document.getElementById("mark").innerHTML="Your Score:" + score;
    	}
    }
    for(var i=0;i<sb.length;i++)
    {
    	if(body.pos[0] == sb[i].pos[0] && (body.pos[2] - sb[i].pos[2]) < 0.2 && (body.pos[2] - sb[i].pos[2]) > -0.2 && (body.pos[1] - sb[i].pos[1]) < 0.7 && (body.pos[1] - sb[i].pos[1]) > -0.7)
    	{
    		console.log("speedbreaker");
    		if(heade.pos[2] - head.pos[2] < 3.5)
    			die();
    		else
    		{
    			heade.pos[2]=head.pos[2] + 1.0;
 	   			player_speed = 0.3
 	   		}
    	}
    }
    for(var i=0;i<bush.length;i++)
    {
    	if(body.pos[0] == bush[i].pos[0] && (body.pos[2] - bush[i].pos[2]) < 0.2 && (body.pos[2] - bush[i].pos[2]) > -0.2 && (body.pos[1] - sb[i].pos[1]) < 0.5 && (body.pos[1] - sb[i].pos[1]) > -0.5)
    	{
    		console.log("bush");
    		if(heade.pos[2] - head.pos[2] < 3.5)
    			die();
    		else
    		{
    			heade.pos[2]=head.pos[2]+1.0;
	    		player_speed = 0.3
	    	}
    	}
    }
    for(var i=0;i<walls.length;i++)
    {
    	if(body.pos[0] == walls[i].pos[0] && (body.pos[2] - walls[i].pos[2]) < 0.2 && (body.pos[2] - walls[i].pos[2]) > -0.2 && head.pos[1]<4.2)
    	{
    		die();
    		console.log("die");
    	}
    }
    for(var i=0;i<boots.length;i++)
    {
    	if(body.pos[0] == boots[i].pos[0] && (body.pos[2] - boots[i].pos[2]) < 0.2 && (body.pos[2] - boots[i].pos[2]) > -0.2)
    	{
    		high_jump=1;
    		boots.splice(i,1);
    		console.log("boots on");
    	}
    }
    for(var i=0;i<magnets.length;i++)
    {
    	if(body.pos[0] == magnets[i].pos[0] && (body.pos[2] - magnets[i].pos[2]) < 0.2 && (body.pos[2] - magnets[i].pos[2]) > -0.2)
    	{
    		magnet_on=1;
    		magnets.splice(i,1);
    		console.log("magnet on");
    	}
    }
    for(var i=0;i<jets.length;i++)
    {
    	if(body.pos[0] == jets[i].pos[0] && (body.pos[2] - jets[i].pos[2]) < 0.2 && (body.pos[2] - jets[i].pos[2]) > -0.2)
    	{
    		jet_pack=1;
    		jets.splice(i,1);
    		console.log(jet_pack);
    		head.pos[1]=6;
    		for(var j=0;j<coin.length;j++)
    			coin[j].pos[1]=5.5;
    	}
    }
}

function drawScene(gl, programInfo, programInfoTexture, deltaTime) {
  gl.clearColor(150/255,1.0, 1.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [0, 2+head.pos[1], 10+head.pos[2]]);
    var cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    var up = [0, 1, 0];
    lookx=0;
    looky=head.pos[1];
    lookz=head.pos[2];
    mat4.lookAt(cameraMatrix, cameraPosition, [lookx,looky,lookz], up);

    var viewMatrix = cameraMatrix;//mat4.create();

    //mat4.invert(viewMatrix, cameraMatrix);

    var viewProjectionMatrix = mat4.create();
    

  mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
  rwall.draw(gl, viewProjectionMatrix, programInfoTexture, deltaTime,side_texture);
  lwall.draw(gl, viewProjectionMatrix, programInfoTexture, deltaTime,side_texture);
  trackr.draw(gl, viewProjectionMatrix, programInfoTexture, deltaTime, track_texture);
  trackl.draw(gl, viewProjectionMatrix, programInfoTexture, deltaTime, track_texture);
  trackm.draw(gl, viewProjectionMatrix, programInfoTexture, deltaTime, track_texture);
  body.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  head.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  bodye.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  heade.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  
  for(var i=0;i<coin.length;i++)
    coin[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<bush.length;i++)
    bush[i].draw(gl, viewProjectionMatrix, programInfoTexture, deltaTime,grass_texture);
  for(var i=0;i<trains.length;i++)
    trains[i].drawWall(gl, viewProjectionMatrix, programInfoTexture, deltaTime,train_texture);
  for(var i=0;i<walls.length;i++)
    walls[i].drawWall(gl, viewProjectionMatrix, programInfoTexture, deltaTime,door_texture);
  for(var i=0;i<sb.length;i++)
    sb[i].draw(gl, viewProjectionMatrix, programInfoTexture, deltaTime, breaker_texture);
  for(var i=0;i<boots.length;i++)
    boots[i].draw(gl, viewProjectionMatrix, programInfoTexture, deltaTime,boot_texture);
  for(var i=0;i<jets.length;i++)
    jets[i].draw(gl, viewProjectionMatrix, programInfoTexture, deltaTime,jet_texture);
  for(var i=0;i<magnets.length;i++)
    magnets[i].draw(gl, viewProjectionMatrix, programInfoTexture, deltaTime,magnet_texture);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function convertToGrey(gl,type){
	if(type==1)
	{
		track_texture = loadTexture(gl, "./data/images/track.jpg");
		side_texture = loadTexture(gl, "./data/images/grayside.png");
		boot_texture = loadTexture(gl, "./data/images/grayshoe.png");
		breaker_texture = loadTexture(gl, "./data/images/grayspeed.png");
		grass_texture = loadTexture(gl, "./data/images/graygrass.jpg");
		jet_texture = loadTexture(gl, "./data/images/grayjetpack.jpg");	
		document.getElementById("glcanvas").style.filter = "grayscale(100%)";
	}
	else
	{
		document.getElementById("glcanvas").style.filter = "grayscale(0%)";
  		track_texture = loadTexture(gl, "./data/images/track.jpg");
  		train_texture = loadTexture(gl, "./data/images/train.jpeg");
  		door_texture = loadTexture(gl, "./data/images/side.jpg");
  		side_texture = loadTexture(gl, "./data/images/side.jpeg");
  		boot_texture = loadTexture(gl, "./data/images/shoe.jpeg");
  		breaker_texture = loadTexture(gl, "./data/images/speed.png");
  		grass_texture = loadTexture(gl, "./data/images/grass.jpeg");
 		jet_texture = loadTexture(gl, "./data/images/jetpack.jpeg");
	}
}

function brightit()
{
	if(bright_val == 1.0)
	{
	 	document.getElementById("glcanvas").style.filter = "brightness(0.6)";
	 	bright_val = 0.6;
	}
	else
	{
		bright_val=1.0;
		document.getElementById("glcanvas").style.filter = "brightness(1.0)";
	}
}

function die(){
	if(dead==0)
	playSound("data/sound/crash.mp3", 0, 1, 0);
	dead=1;
    heade.pos[2]=head.pos[2]+1.0;
	player_speed = 0;
	console.log("dead");
    document.getElementById("mark").innerHTML="Game Over!! Your Final Score:" + score;
}

function terminate(){
	dead=1;
	player_speed = 0;
    document.getElementById("mark").innerHTML="Congrats!! You Won!! Your Final Score:" + score;
}