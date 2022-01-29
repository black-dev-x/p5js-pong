const sounds = {}

const game = {
  width: 1200,
  height: 800,
  speed: 5,
  scoreHorizontalPadding: 100,
  scoreVerticalPadding: 60
}

const ball = {
  x: game.width / 2,
  y: game.height / 2,
  speedX: -game.speed,
  speedY: game.speed,
  radius: 25,
}

const bar = {
  distanceFromScreen: 15,
  width: 15,
  height: 150,
  speed: game.speed
}
const player = {
  x: bar.distanceFromScreen,
  y: game.height / 2,
  score: 0
}

const adversary = {
  x: game.width - bar.distanceFromScreen - bar.width,
  y: game.height / 2,
  mistake: 0,
  mistakeStep: 0,
  score: 0,
}

const checkVerticalBorderCollision = () => {
  const topCollision = ball.y + ball.radius >= game.height
  const bottomCollision = ball.y - ball.radius <= 0
  if(topCollision || bottomCollision){
    ball.speedY*=-1
  }
}

const checkHorizontalBorderCollision = () => {
  const rightCollision = ball.x + ball.radius >= game.width
  const leftCollision = ball.x - ball.radius <= 0
  if(leftCollision || rightCollision){
    ball.speedX *= -1
    sounds.point.play()
  }
  if(leftCollision) adversary.score++
  if(rightCollision) player.score++
}
const changeGameDifficulty = () => {
  adversary.mistake = 120*Math.random()
}

const checkCollisionWithPlayers = () => {
  const playerCollision =  collideRectCircle(player.x, player.y - bar.height/2, bar.width, bar.height, ball.x, ball.y, ball.radius*2)
  const adversaryCollision =  collideRectCircle(adversary.x, adversary.y - bar.height/2, bar.width, bar.height, ball.x, ball.y, ball.radius*2)
  if(playerCollision){
    ball.speedX = Math.abs(ball.speedX)
    changeGameDifficulty()
    sounds.strike.play()
  }
  if(adversaryCollision){
    ball.speedX = -Math.abs(ball.speedX)
    changeGameDifficulty()
    sounds.strike.play()
  }
}

const checkCollision = () => {
  checkVerticalBorderCollision()
  checkHorizontalBorderCollision()
  checkCollisionWithPlayers()
}

const movePlayer = () => {
  if(keyIsDown(UP_ARROW)){
    player.y -= bar.speed
  }
  if(keyIsDown(DOWN_ARROW)){
    player.y += bar.speed
  }
}

const moveBall = () => {
  checkCollision()
  ball.x += ball.speedX
  ball.y += ball.speedY
}

const drawScoreboard = () => {
  fill(255)
  textSize(30)
  textAlign(CENTER)
  text(adversary.score, game.width - game.scoreHorizontalPadding, game.scoreVerticalPadding)
  text(player.score, game.scoreHorizontalPadding, game.scoreVerticalPadding)
}
const drawElements = () => {
  background(0);
  circle(ball.x, ball.y, ball.radius*2)
  rect(player.x, player.y -bar.height/2, bar.width, bar.height)
  rect(adversary.x, adversary.y - bar.height/2, bar.width ,bar.height)
  drawScoreboard()
  
}
function preload() {
  sounds.background = loadSound('background.mp3')
  sounds.point = loadSound('point.mp3')
  sounds.strike = loadSound('strike.mp3')
}

function setup() {
  createCanvas(game.width, game.height);
  sounds.background.loop()
}

const moveAdversary = () => {
  adversary.y = ball.y - adversary.mistakeStep
  adversary.mistake > adversary.mistakeStep ? adversary.mistakeStep++ : adversary.mistakeStep--
}

function draw() {
  drawElements()
  moveBall()
  movePlayer()
  moveAdversary()
}