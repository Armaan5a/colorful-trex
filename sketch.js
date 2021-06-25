  var PLAY = 1;
  var END = 0;
  var gameState = PLAY;
  var trex, trex_running, trex_collided;
  var ground, invisibleGround, groundImage;
  var cloudsGroup, cloudImage;
  var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
  var score;
  var gameOverImg,restartImg
  var jumpSound , checkPointSound, dieSound
  var highScore=0

  function preload(){
    trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided-1.png");
    groundImage = loadImage("ground2.png");
    cloudImage = loadImage("cloud-1.png");
    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");
    restartImg = loadImage("restart.png")
    gameOverImg = loadImage("gameOver.png")
    jumpSound = loadSound("jump.mp3")
    dieSound = loadSound("die.mp3")
    checkPoint = loadSound("checkPoint.mp3")
  }

  function setup() {
    createCanvas(windowWidth, windowHeight);
    trex = createSprite(50,height-40,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided" ,trex_collided);
    trex.scale = 0.1;

    ground = createSprite(width,height/1.11,40,2);
    ground.addImage("ground",groundImage);
    ground.x = ground.width /2;
    trex.setCollider("circle",0,0,40);
    trex.debug = false
    //trex.setCollider("rectangle",0,0,350,trex.height)
  
    gameOver = createSprite(width/2,height/2- 50);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.5;

    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);
    restart.scale = 0.5;

    invisibleGround = createSprite(width/2,height-10,width,125);
    invisibleGround.visible = false;

    obstaclesGroup = createGroup();
    cloudsGroup = createGroup();

    score = 0;
  }

  function draw() {
    background(135,206,235);
    depth=10000
    text("Score: "+ score, 500,50);
    depth=10000
    text("highScore: "+ highScore,400,50);  

    if(gameState === PLAY){
      gameOver.visible = false
      restart.visible = false
      ground.velocityX = -(4+score/500)
      score = score + Math.round(getFrameRate()/60);

      if (ground.x < 0){
        ground.x = ground.width/2;
      }

      if(score%100===0&&score>0){
        checkPoint.play();
      }

  if(touches.length > 0 || keyDown("space")&& trex.y >=height-100) {
          trex.velocityY = -13;
      jumpSound.play();
      touches = [];
  }

      trex.velocityY = trex.velocityY + 0.8

      spawnClouds();
      spawnObstacles();

      if(obstaclesGroup.isTouching(trex)){
        // trex.velocityY = -10;
     // jumpSound.play()

        gameState = END;
      dieSound.play();

      }
    }
     else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;

        ground.velocityX = 0;
        trex.velocityY = 0

        trex.changeAnimation("collided", trex_collided);

      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);

       obstaclesGroup.setVelocityXEach(0);
       cloudsGroup.setVelocityXEach(0);

     if(score>highScore){
       highScore=score 
     }


     }

  trex.collide(invisibleGround);

   if(mousePressedOver(restart))
    { 
      reset();
    }
  drawSprites();
  }

  function reset()
  {
    score=0
    gameState=PLAY
    obstaclesGroup.destroyEach()
    cloudsGroup.destroyEach()
    trex.changeAnimation("running",trex_running)
  }

  function spawnObstacles(){
   if (frameCount % 60 === 0){
     var obstacle = createSprite(600,height-70,20,30);
     obstacle.velocityX = -(6+score/100);
    var rand = Math.round(random(1,6));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
                break;
        case 2: obstacle.addImage(obstacle2);
                break;
        case 3: obstacle.addImage(obstacle3);
                break;
        case 4: obstacle.addImage(obstacle4);
                break;
        case 5: obstacle.addImage(obstacle5);
                break;
        case 6: obstacle.addImage(obstacle6);
                break;
        default: break;
      }         
      obstacle.scale = 0.5;
      obstacle.lifetime = 240;
      obstaclesGroup.add(obstacle);
   }
  }

  function spawnClouds() {
    if (frameCount % 60 === 0) {
       cloud = createSprite(width+20,height-300,40,10);
      cloud.y = Math.round(random(10,150));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = -3;
      cloud.lifetime = 240;
      cloud.depth = trex.depth;
      trex.depth = trex.depth + 1;
     cloudsGroup.add(cloud);
      }
  }