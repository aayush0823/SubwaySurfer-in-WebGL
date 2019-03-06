var die = 0;
var cubeRotation = 0.0;
var no_coins_l=Math.round(Math.random()*200)+100;
var no_coins_r=Math.round(Math.random()*200)+100;
var no_coins_m=Math.round(Math.random()*200)+100;
var coinsl=[];
var coinsr=[];
var coinsm=[];
var jhadi=[];
var walls=[];
var sb=[];
var player_speed=0.4;
main();
function main() {


  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  trackl = new track(gl ,[ -5,0 , 0.8 , 0 ]);
  trackm = new track(gl ,[ 0,0 , 0.8 , 0 ]);
  trackr = new track(gl ,[ 5,0 , 0.8 , 0 ]);
  head = new cube(gl, [0.0, 0.0, -2.0],"head");
  body = new cube(gl, [0.0, -0.8, -2.0],"body");
  var placement = 0;
  for(var i=0;i<no_coins_l;)
  {
  	var x = Math.random()*10;
  	if(Math.random()*2>1)
  	{
  		for(var j=0;j<x && i<no_coins_l;j++)
  		{
    		coinsl.push(new coins(gl,[-5.0,-0.5,-placement*3]));
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
  placement = 0;
  for(var i=0;i<no_coins_r;)
  {
  	var x = Math.random()*10;
  	if(Math.random()*2>1)
  	{
  		for(var j=0;j<x && i<no_coins_r;j++)
  		{
    		coinsr.push(new coins(gl,[5.0,-0.5,-placement*3]));
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
  placement = 0;
  for(var i=0;i<no_coins_m;)
  {
  	var x = Math.random()*10;
  	if(Math.random()*2>1)
  	{
  		for(var j=0;j<x && i<no_coins_m;j++)
  		{
    		coinsm.push(new coins(gl,[0,-0.5,-placement*3]));
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
  placement=0;
  for(var i=0;i<6;)
  {
  	if(Math.random()*40<1)
  	{
		jhadi.push(new jhadiya(gl,[(i%3-1)*5,-0.5,-placement*3]));
		i++;
  	}
		placement++;
  }
  placement=0;
  for(var i=0;i<5;)
  {
  	if(Math.random()*48<1)
  	{
		walls.push(new wall(gl,[-(i%3-1)*5,-0.5,-placement*3]));
		i++;
  	}
		placement++;
  }
  placement=0;
  for(var i=0;i<8;)
  {
  	if(Math.random()*32<1)
  	{
		sb.push(new speedbreaker(gl,[((i+1)%3-1)*5,-0.5,-placement*3]));
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

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

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

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers

  var then = 0;

  // Draw the scene repeatedlyzz
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, deltaTime);
    tick();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// Draw the scene.
//
trackl.pos[1]=head.pos[1]-2.5;
trackr.pos[1]=head.pos[1]-2.5;
trackm.pos[1]=head.pos[1]-2.5;

function tick()
{
    head.pos[2]-=player_speed;
    head.pos[0]=5*track_mul;
    body.pos[2]=head.pos[2];
    body.pos[1]=head.pos[1]-0.8;
    body.pos[0]=head.pos[0];
    for(var i=0;i<coinsl.length;i++)
    {
    	if(body.pos[0] == coinsl[i].pos[0] && (body.pos[2] - coinsl[i].pos[2]) < 0.1)
    	{
    		coinsl.splice(i,1);
    	}
    }
    for(var i=0;i<coinsm.length;i++)
    {
    	if(body.pos[0] == coinsm[i].pos[0] && (body.pos[2] - coinsm[i].pos[2]) < 0.1)
    	{
    		coinsm.splice(i,1);
    	}
    }
    for(var i=0;i<coinsr.length;i++)
    {
    	if(body.pos[0] == coinsr[i].pos[0] && (body.pos[2] - coinsr[i].pos[2]) < 0.1)
    	{
    		coinsr.splice(i,1);
    	}
    }
    for(var i=0;i<sb.length;i++)
    {
    	if(body.pos[0] == sb[i].pos[0] && (body.pos[2] - sb[i].pos[2]) < 0.1 && (body.pos[2] - sb[i].pos[2]) > -0.1 && (body.pos[1] - sb[i].pos[1]) < 0.3 && (body.pos[1] - sb[i].pos[1]) > -0.3)
    	{
    		player_speed = parseFloat(player_speed/2);
    		console.log(player_speed);
    	}
    }
    for(var i=0;i<jhadi.length;i++)
    {
    	if(body.pos[0] == jhadi[i].pos[0] && modulus(body.pos[2] - jhadi[i].pos[2]) < 0.1 && modulus(body.pos[1] - sb[i].pos[1]) < 0.3)
    	{
    		player_speed = parseFloat(player_speed/2);
    	}
    }
    for(var i=0;i<walls.length;i++)
    {
    	if(body.pos[0] == walls[i].pos[0] && modulus(body.pos[2] - walls[i].pos[2]) < 0.1)
    	{
    		die =1;
    		console.log(die);
    	}
    }
}

function drawScene(gl, programInfo, deltaTime) {
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
  for(var i=0;i<coinsl.length;i++)
    coinsl[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<coinsm.length;i++)
    coinsm[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<coinsr.length;i++)
    coinsr[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<jhadi.length;i++)
    jhadi[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<walls.length;i++)
    walls[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<sb.length;i++)
    sb[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  
  trackl.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  trackm.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  trackr.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  head.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  body.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  //c1.drawCube(gl, projectionMatrix, programInfo, deltaTime);

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
