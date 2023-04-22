/*import * as conf from './conf'*/
import { Herbe,Obstacles,State } from './state'
const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
}


const playerDown = new Image();
playerDown.src = "playerDown.png"

const playerUp = new Image();
playerUp.src = "playerUp.png"

const playerLeft = new Image();
playerLeft.src = "playerLeft.png"

const playerRight = new Image();
playerRight.src = "playerRight.png"

const map_img = new Image();
map_img.src = "map1.png"

const mapforeground_img = new Image();
mapforeground_img.src = "foregroundmap1.png"

const mapbattle_img = new Image();
mapbattle_img.src = "battlemap.png"

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
const drawHerbe = (
    ctx : CanvasRenderingContext2D, 
    herbe : Herbe
    )       => {
      ctx.beginPath()
      ctx.rect(herbe.coord.x, herbe.coord.y, 64, 64)
      ctx.stroke()
      ctx.fillStyle = COLORS.GREEN
      
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

const clearScreen = (ctx : CanvasRenderingContext2D) =>  {
  ctx.clearRect(0, 0, ctx.canvas.width,ctx.canvas.height);
}

const drawBattle = (ctx : CanvasRenderingContext2D) => {
  ctx.drawImage(mapbattle_img,0,0,ctx.canvas.width,ctx.canvas.height*2/3)
  ctx.fillRect(0,ctx.canvas.height*2/3,ctx.canvas.width, ctx.canvas.height/3  )
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
    drawBattle(ctx)
   }
  }else {
    drawMap(ctx, state);
    drawPlayer(ctx, state);
    drawForeGround(ctx, state);
  }

  if (state.endOfGame) {
    const text = "END";
    ctx.font = "48px arial";
    ctx.strokeText(text, state.size.width / 2 - 200, state.size.height / 2);
  }

  
};






