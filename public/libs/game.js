// Snake by Patrick OReilly and Richard Davey
// Twitter: @pato_reilly Web: http://patricko.byethost9.com
var game = new Phaser.Game(
  window.screen.availWidth * window.devicePixelRatio,
  window.screen.availHeight * window.devicePixelRatio, 
  Phaser.CANVAS, 
  '#game', 
  { preload: preload, create: create, update: update,render : render }
  );

var players = {};
var ballColors = {1 : 'blue', 2: 'green',3:'red'};

function preload() {

  game.load.image(ballColors[1],'assets/orb-blue.png');
  game.load.image(ballColors[2],'assets/orb-green.png');
  game.load.image(ballColors[3],'assets/orb-red.png');

}

function createNewPlayer(id,name,ballColorString,location)
{

  var snakeHead = generateSnakeHeadForPlayer(location,ballColorString);

  var snakeSection = new Array();
  var snakePath = new Array();
  var playerObject = createPlayerObject(name,ballColorString,snakeHead,snakeSection,snakePath);
  players[id] = playerObject;
}

function generateSnakeHeadForPlayer(location,ballColorString)
{
  var snakeHead = game.add.sprite(location.x, location.y, ballColorString);
  game.physics.enable(snakeHead, Phaser.Physics.ARCADE);
  snakeHead.body.collideWorldBounds = true;
  return snakeHead;
}

function createPlayerObject(name,ballColorString,snakeHead,snakeSection,snakePath)
{
  return({name: name, ballColor: ballColorString, snakeHead: snakeHead, snakeSection: snakeSection, snakePath: snakePath});
}

function createCollisionDetection()
{
  console.log("collision detection called");

  var playerKeyArray = Object.keys(players);
  for(x=0; x < playerKeyArray.length; x+=1)
  {
   for(y=(x+1); y < playerKeyArray.length; y+=1)
   {
     game.physics.arcade.collide(players[playerKeyArray[x]].snakeHead, players[playerKeyArray[y]].snakeHead, collisionCallback,null,this);
   }

  }

}

function create() {
  // Create new player
  createNewPlayer(1,"Kevin",ballColors[1],new Phaser.Point(100,100));
  createNewPlayer(2,"Frank",ballColors[2],new Phaser.Point(300,300));
  createNewPlayer(3,"Bob"  ,ballColors[3],new Phaser.Point(400,400));
  createNewPlayer(4,"ken"  ,ballColors[3],new Phaser.Point(500,400));

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.setBounds(0, 0, 800, 600);

  cursors = game.input.keyboard.createCursorKeys();

  //console log all of the players in the game
  Object.keys(players).forEach(key => {  
    console.log(players[key].name);
  });

}

function update() {

  var socket = io.connect();


  var player = players[1];
  var snakeSpacer = 3;

  player.snakeHead.body.angularVelocity = 0;
  player.snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.snakeHead.angle, 300));
      
  if (player.snakeSection.length > 0)
  {
    var part = player.snakePath.pop();

    part.setTo(player.snakeHead.x, player.snakeHead.y);
    player.snakePath.unshift(part);

    for (var i = 0; i <= player.snakeSection.length - 1; i++)
    {
      player.snakeSection[i].x = (player.snakePath[i * snakeSpacer]).x;
      player.snakeSection[i].y = (player.snakePath[i * snakeSpacer]).y;
    }

  }

  socket.on('left move', function () {
        player.snakeHead.body.angularVelocity = -300000;
    }); 

    socket.on('right move', function () {
        player.snakeHead.body.angularVelocity = 300000;
    });     


  if (cursors.left.isDown) {
    player.snakeHead.body.angularVelocity = -300;
  }
  else if (cursors.right.isDown) {
    player.snakeHead.body.angularVelocity = 300;
  }

  createCollisionDetection();


}
function getPlayerKeyFromSnakeHead(snakeHead)
{
  var playerKey;

  Object.keys(players).forEach(key => {
    if (players[key].snakeHead === snakeHead) {
      playerKey = key;
    }
  });

  return playerKey;
}
function appendSnakeSection(sectionKey, sectionToAppendKey)
{

  var sectionObj = players[sectionKey];
  var sectionToAppendObj = players[sectionToAppendKey];
  //duplicate sectionTobeAppended
  var newSnakeSection = game.add.sprite(sectionToAppendObj.x,sectionToAppendObj.y,sectionToAppendObj.key);
  newSnakeSection.anchor.setTo(0,0);
  //push section to player snake section
  sectionObj.snakeSection.push(newSnakeSection);
  sectionObj.snakePath.push(new Phaser.Point(sectionToAppendObj.x,sectionToAppendObj.y));
  //destroy the section to append sprite
  sectionToAppendObj.snakeHead.destroy();
  //delete players[sectionToAppendKey];
  //var sectionObj = players[sectionKey];
  //var sectionToAppendObj = players[sectionToAppendKey];
  //duplicate sectionTobeAppended
  //var newSnakeSection = game.add.sprite(sectionToAppendObj.x,sectionToAppendObj.y,sectionToAppendObj.key);
  //newSnakeSection.anchor.setTo(0.5,0.5);
  //push section to player snake section
  //sectionObj.snakeSection.push(newSnakeSection);
  //sectionObj.snakePath.push(new Phaser.Point(sectionToAppendObj.x,sectionToAppendObj.y));
  //destroy the section to append sprite
  //sectionToAppendObj.snakeHead.kill();
  //remove the player from the hash
  //console.log("players before delete: ", Object.keys(players).length);
  //delete players[sectionToAppendKey];
  //console.log("players after delete: ", Object.keys(players).length);
}
function processCallback(snakeHead1, snakeHead2) //process when two snakeHeads collide!
{
  
 
}
function collisionCallback(snakeHead1, snakeHead2) 
{

  var playerOneObjectKey = getPlayerKeyFromSnakeHead(snakeHead1);
  var playerTwoObjectKey = getPlayerKeyFromSnakeHead(snakeHead2);

  console.log('Collision!');

  if(playerOneObjectKey == 1) {
    //appendSnakeSection(playerOneObjectKey,playerTwoObjectKey);
  }else {
    //appendSnakeSection(playerTwoObjectKey,playerOneObjectKey);
  }

}
function render() {

  game.debug.body(players[1].snakeHead);
  game.debug.body(players[2].snakeHead);

}