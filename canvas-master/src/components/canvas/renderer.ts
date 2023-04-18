/*import * as conf from './conf'*/
import { State } from './state'
const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
}


const link_img = new Image();
link_img.src = "link2.png"

const coeur_img = new Image();
coeur_img.src = "coeur_rempli.png"

const coeur_vide_img = new Image();
coeur_vide_img.src = "coeur_vide.png"

const map_img = new Image();
map_img.src = "map.png"

const slime_img = new Image();
slime_img.src = "characters/slime.png"

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
  { x, y }: { x: number; y: number },
  frameIndexX : number,
  frameIndexY : number,
) => {
  ctx.beginPath()
  /*ctx.fillStyle = color
  ctx.arc(x, y, conf.RADIUS, 0, 2 * Math.PI)
  ctx.fill()*/ 
  //tx.arc(x, y, conf.RADIUS*2, 0, 2 * Math.PI)
  //ctx.fill()
  ctx.drawImage(link_img,24*frameIndexX,32*frameIndexY,24,32, x,y,24,32)
 
}

/*const drawBordure = (
  ctx : CanvasRenderingContext2D, 
  upleft : {x : number, y : number}, 
  size : { width : number, height : number}
  )       => {
    ctx.beginPath()
    ctx.rect(upleft.x, upleft.y, size.width, size.height)
    ctx.stroke()
  }*/

const drawRectangle = (
  ctx : CanvasRenderingContext2D, 
  upleft : {x : number, y : number}, 
  size : { width : number, height : number},
  color : string
  )       => {
    ctx.beginPath()
    ctx.rect(upleft.x, upleft.y, size.width, size.height)
    ctx.stroke()
    ctx.fillStyle = color 
    
    ctx.fill()
    
  }

const drawHearts = (
    ctx : CanvasRenderingContext2D,
    coeur : number
) => {
  if (coeur === 3 ){
    ctx.drawImage(coeur_img, 0,0, 257,214,30,20,40,30)
    ctx.drawImage(coeur_img, 0,0, 257,214,75,20,40,30)
    ctx.drawImage(coeur_img, 0,0, 257,214,120,20,40,30)
  }
  if (coeur === 2){
    ctx.drawImage(coeur_img, 0,0, 257,214,30,20,40,30)
    ctx.drawImage(coeur_img, 0,0, 257,214,75,20,40,30)
    ctx.drawImage(coeur_vide_img, 0,0, 257,214,120,20,40,30)
  }
  if (coeur === 1) {
    ctx.drawImage(coeur_img, 0,0, 257,214,30,20,40,30)
    ctx.drawImage(coeur_vide_img, 0,0, 257,214,75,20,40,30)
    ctx.drawImage(coeur_vide_img, 0,0, 257,214,120,20,40,30)
  }
  if (coeur === 0){
    ctx.drawImage(coeur_img, 0,0, 257,214,30,20,40,30)
    ctx.drawImage(coeur_vide_img, 0,0, 257,214,75,20,40,30)
    ctx.drawImage(coeur_vide_img, 0,0, 257,214,120,20,40,30)
  }
}

const drawSlime = ( 
    ctx : CanvasRenderingContext2D, 
    coord : { x : number, y : number},
    frameIndex : number 
) => {
  ctx.drawImage(slime_img,32*frameIndex,64,32,32,coord.x,coord.y,60,60)

}


/*const computeColor = (life: number, maxLife: number, baseColor: string) =>
  rgbaTorgb(baseColor, (maxLife - life) * (1 / maxLife))
*/
export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
  
  clear(ctx)
  ctx.drawImage(map_img,0,0,1009,520,0,0,state.size.width,state.size.height)
  drawHearts(ctx,state.joueur.coeur)

  drawSlime(ctx,state.slime.coord,state.slime.frameIndex)
  drawPlayer(ctx, state.joueur.coord,state.joueur.frameIndexX,state.joueur.frameIndexY)


  /*state.obstacles.map((c) =>
    drawRectangle(ctx, c.coordupleft, c.size, COLORS.GREEN)
  )*/

  if (state.endOfGame) {
    const text = 'END'
    ctx.font = '48px arial'
    ctx.strokeText(text, state.size.width / 2 - 200, state.size.height / 2)
  }
}
