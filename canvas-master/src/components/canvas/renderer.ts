/*import * as conf from './conf'*/
import {Obstacles,State } from './state'
const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
}


const playerDown = new Image();
playerDown.src = "SpritesPlayer/playerDown.png"

const playerUp = new Image();
playerUp.src = "SpritesPlayer/playerUp.png"

const playerLeft = new Image();
playerLeft.src = "SpritesPlayer/playerLeft.png"

const playerRight = new Image();
playerRight.src = "SpritesPlayer/playerRight.png"

const map_img = new Image();
map_img.src = "Maps/map1.png"

const mapforeground_img = new Image();
mapforeground_img.src = "Maps/foregroundmap1.png"

const mapbattle_img = new Image();
mapbattle_img.src = "Maps/battlemap.png"

const reptincel = new Image();
reptincel.src = "Poké/reptincel.png"

const chenipan = new Image();
chenipan.src = "Poké/chenipan.png"

const toDoubleHexa = (n: number) =>
  n < 16 ? '0' + n.toString(16) : n.toString(16)

export const rgbaTorgb = (rgb: string, alpha = 0) => {
  let r = 0
  let g = 0
  let b = 0
  if (rgb.startsWith('#')) {
    const hexR = rgb.length === 7 ? rgb.slice(1, 3) : rgb[1]
    const hexG = rgb.length === 7 ? rgb.slice(3, 5) : rgb[2]
    const hexB = rgb.length === 7 ? rgb.slice(5, 7) : rgb[3]
    r = parseInt(hexR, 16)
    g = parseInt(hexG, 16)
    b = parseInt(hexB, 16)
  }
  if (rgb.startsWith('rgb')) {
    const val = rgb.replace(/(rgb)|\(|\)| /g, '')
    const splitted = val.split(',')
    r = parseInt(splitted[0])
    g = parseInt(splitted[1])
    b = parseInt(splitted[2])
  }

  r = Math.max(Math.min(Math.floor((1 - alpha) * r + alpha * 255), 255), 0)
  g = Math.max(Math.min(Math.floor((1 - alpha) * g + alpha * 255), 255), 0)
  b = Math.max(Math.min(Math.floor((1 - alpha) * b + alpha * 255), 255), 0)
  return `#${toDoubleHexa(r)}${toDoubleHexa(g)}${toDoubleHexa(b)}`
}

const clear = (ctx: CanvasRenderingContext2D) => {
  const { height, width } = ctx.canvas
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
}

const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  state : State
) => {
  var img 
  switch (state.map.input){
    case 'z' : 
      img = playerUp
      break
    case 'q' : 
      img = playerLeft
      break
    case 'd' : 
      img = playerRight
      break
    default : 
      img = playerDown
  }
  ctx.drawImage(img,state.joueur.frame * img.width / 4,0, img.width /4 , img.height,state.joueur.coord.x, state.joueur.coord.y, img.width/4,img.height)
 
}

const drawRectangle = (
  ctx : CanvasRenderingContext2D, 
  obstacle : Obstacles,
  color : string
  )       => {
    ctx.beginPath()
    ctx.rect(obstacle.coord.x, obstacle.coord.y, 64, 64)
    ctx.stroke()
    ctx.fillStyle = color 
    
    ctx.fill()
    
  }

const drawMap = (ctx : CanvasRenderingContext2D, state : State) => {
  ctx.drawImage(map_img,state.map.coord.x,state.map.coord.y)
}


const drawForeGround = (ctx : CanvasRenderingContext2D, state : State) => {
  ctx.drawImage(mapforeground_img,state.map.coord.x,state.map.coord.y)  
}

const drawBlackScreen = (ctx : CanvasRenderingContext2D) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height)
}

const drawReptincel = (ctx : CanvasRenderingContext2D) => {
  ctx.drawImage(reptincel,300,300,300,300)
}

const drawChenipan = (ctx : CanvasRenderingContext2D) => {
  ctx.drawImage(chenipan, 780,150,300,300)
}

const drawBarInterface = (ctx : CanvasRenderingContext2D, state : State) => {
  ctx.font = "48px arial";

  ctx.fillRect(0,570,ctx.canvas.width, ctx.canvas.height - 570)
  ctx.fillStyle = "black"
  ctx.strokeRect(0,570,ctx.canvas.width, ctx.canvas.height - 570)
  ctx.strokeRect(1000,570,ctx.canvas.width - 1000, ctx.canvas.height - 570)

  ctx.fillStyle = "red"
  ctx.fillRect(0, 570, 500, ctx.canvas.height- 570)
  ctx.strokeRect(0, 570, 500, ctx.canvas.height- 570)

  ctx.fillStyle = "black"
  const attack1 = "Lance-Flammes";
  ctx.fillText(attack1,  70, 690);

  ctx.fillStyle = "black"
  ctx.fillRect(500, 570, 500, ctx.canvas.height- 570)
  ctx.strokeRect(500, 570, 500, ctx.canvas.height- 570)

  ctx.fillStyle = "white"
  const attack2 = "Morsure";
  ctx.fillText(attack2,  650, 690);

  ctx.fillStyle = "black"
  ctx.fillText(state.typeattack,  1120, 690);

}

const drawHpInterface = (ctx : CanvasRenderingContext2D, state : State) => {
  ctx.fillStyle = "white"
  ctx.fillRect(80,20, 400, 100)
  ctx.fillRect(900,450, 400, 100)

  ctx.fillStyle = "green" 
  if (state.enemy.hp.actuel > 0) {
    ctx.fillRect(100,60, (state.enemy.hp.actuel * 320) / state.enemy.hp.max, 20)
  }
  ctx.fillRect(920,490,(state.ally.hp.actuel * 320) / state.ally.hp.max,20)

  ctx.fillStyle = "black"
  ctx.strokeRect(80,20, 400, 100)
  ctx.strokeRect(900,450, 400, 100)

  ctx.font = "24px arial";
  ctx.fillText(state.enemy.nom, 100,50)

  ctx.fillText(state.ally.nom,920,480)
  ctx.fillText(state.ally.hp.actuel.toString(),1225,540)
  ctx.fillText("/" + state.ally.hp.max.toString(),1250,540)
}

const drawDialogue = (ctx : CanvasRenderingContext2D, state: State) => {
  ctx.fillRect(0,570,ctx.canvas.width, ctx.canvas.height - 570)
  ctx.fillStyle = "black"
  ctx.strokeRect(0,570,ctx.canvas.width, ctx.canvas.height - 570)
  ctx.font = "50px arial";

  switch (state.dialogue.action){
    case "Ally" : 
      ctx.fillText(state.ally.nom + " a utilise l'attaque " + state.ally.attack.nom, 20,630)
      if (state.framedialogue > 50){
        state.framedialogue = 0 
        state.dialogue.action = "EndAlly"
      }
      state.framedialogue++
      break
    case "Enemy" : 
      ctx.fillText(state.enemy.nom + " utilise l'attaque Charge", 20,630)
      if(state.framedialogue > 50){
        state.framedialogue = 0 
        state.dialogue.action = "EndEnemy"
      }
      state.framedialogue++
      break;
    case "Victoire" : 
      ctx.fillText(state.enemy.nom + " est k.o", 20,630)
      if(state.framedialogue > 50){
        state.dialogue.action = "End"
      }
      state.framedialogue++
      break
  }

}

const drawBattle = (ctx : CanvasRenderingContext2D, state : State) => {
  ctx.drawImage(mapbattle_img,0,0,ctx.canvas.width,ctx.canvas.height/*2/3*/)
  drawReptincel(ctx)
  drawChenipan(ctx)
  if (state.dialogue.actif){
    drawDialogue(ctx,state)
  }else{
    drawBarInterface(ctx,state)
  }
  drawHpInterface(ctx,state)
}

export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
  clear(ctx);

  if (state.battle) {
    state.flashcount++;
    if (state.flashcount < 30){
      if (state.flashcount % 10 < 5) {
        drawBlackScreen(ctx);
      }
      else {
        drawMap(ctx, state);
        drawPlayer(ctx, state);
        drawForeGround(ctx, state);
      }  
   }else {
    drawBattle(ctx,state)
   }
  }else {
    drawMap(ctx, state);
    drawPlayer(ctx, state);
    drawForeGround(ctx, state);
    state.obstacles.forEach((obstacle) => drawRectangle(ctx,obstacle,COLORS.BLUE))    
  }
  if (state.endOfGame) {
    const text = "END";
    ctx.font = "48px arial";
    ctx.strokeText(text, state.size.width / 2 - 200, state.size.height / 2);
  }

  
};






