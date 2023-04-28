/*import * as conf from './conf'*/
import {Sables,Obstacles,State } from './state'
const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
}

const victoirePoke = new Audio();
victoirePoke.src = "Musiques/victoirePoke.mp3"

const musiqueVille = new Audio();
musiqueVille.src = "Musiques/musiqueVille.mp3"

const rencontrePoke = new Audio();
rencontrePoke.src = "Musiques/rencontrePoke.mp3"

const playerDown = new Image();
playerDown.src = "SpritesPlayer/playerDown.png"

const playerUp = new Image();
playerUp.src = "SpritesPlayer/playerUp.png"

const playerLeft = new Image();
playerLeft.src = "SpritesPlayer/playerLeft.png"

const playerRight = new Image();
playerRight.src = "SpritesPlayer/playerRight.png"

const map_img = new Image();
map_img.src = "Maps/map.png"

const mapbattle2_img = new Image();
mapbattle2_img.src = "Maps/battlemapsea.png"

const mapforeground_img = new Image();
mapforeground_img.src = "Maps/foregroundmap.png"

const mapbattle_img = new Image();
mapbattle_img.src = "Maps/battlemap.png"

const reptincel = new Image();
reptincel.src = "Poké/reptincel.png"

const chenipan = new Image();
chenipan.src = "Poké/chenipan.png"

const elekable = new Image();
elekable.src = "Poké/elekable.png"

const dracaufeu = new Image();
dracaufeu.src = "Poké/dracaufeu.png"

const dresseur = new Image();
dresseur.src = "SpritesPlayer/Dresseur.png"

const champion = new Image();
champion.src = "SpritesPlayer/CHAMPION.png"

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

const drawDresseur = (
  ctx : CanvasRenderingContext2D,
  state : State
) => {
  ctx.drawImage(dresseur,state.dresseur.direction * dresseur.width/ 4 , 0, dresseur.width / 4, dresseur.height, state.dresseur.coord.x, state.dresseur.coord.y,dresseur.width/4 * 4, 16 * 4)
}

const drawRectangle = (
  ctx : CanvasRenderingContext2D, 
  obstacle : Sables,
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

const drawElekable = (ctx : CanvasRenderingContext2D) => {
  ctx.drawImage(elekable,780,150,300,300)
}

const drawDracaufeu = (ctx : CanvasRenderingContext2D) => {
  ctx.drawImage(dracaufeu,850,100,300,300)
}

const drawEnemy = (ctx : CanvasRenderingContext2D, state : State) => {
  switch(state.enemy.nom){
    case "Elekable" : 
      drawElekable(ctx)
      break
    case "Chenipan" : 
      drawChenipan(ctx)
      break
    case "Dracaufeu" : 
      drawDracaufeu(ctx)
      break
  }
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

  ctx.fillStyle = "black"
  ctx.strokeRect(100,60,320,20)
  ctx.strokeRect(920,490,320,20)

  ctx.fillStyle = "green" 
  if (state.enemy.hp.actuel > 0) {
    ctx.fillRect(100,60, (state.enemy.hp.actuel * 320) / state.enemy.hp.max, 20)
  }
  if(state.ally.hp.actuel > 0) {
    ctx.fillRect(920,490,(state.ally.hp.actuel * 320) / state.ally.hp.max,20)
  }

  ctx.fillStyle = "black"
  ctx.strokeRect(80,20, 400, 100)
  ctx.strokeRect(900,450, 400, 100)

  ctx.font = "24px arial";
  ctx.fillText(state.enemy.nom, 100,50)

  ctx.fillText(state.ally.nom,920,480)
  ctx.fillText(state.ally.hp.actuel.toString(),1225,540)
  ctx.fillText("/" + state.ally.hp.max.toString(),1250,540)
}


export const musiqueV = () => {
  musiqueVille.play();
}


const musiqueCombat = (state : State) => {
  switch(state.dialogue.action) {
    case "Debut" :
      musiqueVille.pause();
      rencontrePoke.play();
    break
    case "Victoire" : 
      rencontrePoke.pause();
      victoirePoke.play()
      break
    case "End" :
      victoirePoke.pause();
      musiqueVille.play()
      break
    case "EndGame" :
      victoirePoke.pause(); 
     break
  }
}

const drawDialogue = (ctx : CanvasRenderingContext2D, state: State) => {
  ctx.fillRect(0,570,ctx.canvas.width, ctx.canvas.height - 570)
  ctx.fillStyle = "black"
  ctx.strokeRect(0,570,ctx.canvas.width, ctx.canvas.height - 570)
  ctx.font = "50px arial";

  switch (state.dialogue.action){
    case "DebutDresseur":
      ctx.fillText("Binh Minh Bui Xuan vous propose un combat", 20, 630)
      if (state.framedialogue > 70){
        state.framedialogue = 0 
        state.dialogue.action = "EnvoiePoke"
      }
      state.framedialogue ++
      break
    case "EnvoiePoke": 
      ctx.fillText("Binh Minh Bui Xuan envoie son " + state.enemy.nom + " shiny ????", 20,630)
      if (state.framedialogue > 70){
        state.framedialogue = 0 
        state.dialogue.action = "FinDebut"
      }
      state.framedialogue++
      break
    case "Debut" : 
      ctx.fillText("Vous avez rencontré un " + state.enemy.nom + " sauvage.", 20,630)
      if (state.framedialogue > 70){
        state.framedialogue = 0 
        state.dialogue.action = "FinDebut"
      }
      state.framedialogue++
      break
    case "Ally" : 
      ctx.fillText(state.ally.nom + " a utilise l'attaque " + state.ally.attack.nom, 20,630)
      if (state.framedialogue > 70){
        state.framedialogue = 0 
        state.dialogue.action = "EndAlly"
      }
      state.framedialogue++
      break
    case "Enemy" : 
      ctx.fillText(state.enemy.nom + " utilise l'attaque Charge", 20,630)
      if(state.framedialogue > 70){
        state.framedialogue = 0 
        state.dialogue.action = "EndEnemy"
      }
      state.framedialogue++
      break;
    case "Victoire" : 
      ctx.fillText(state.enemy.nom + " est k.o", 20,630)
      if(state.framedialogue > 140){
        state.framedialogue = 0 
        state.dialogue.action = "End"
        }
      state.framedialogue++
      break
    case "End" : 
      state.dialogue.action = "Debut"
      break
    }

}

const drawBattle = (ctx : CanvasRenderingContext2D, state : State) => {
  switch(state.zoneactuel){
    case "Plaine" :
      ctx.drawImage(mapbattle_img,0,0,ctx.canvas.width,ctx.canvas.height/*2/3*/)
      break
    case "Plage" : 
      ctx.drawImage(mapbattle2_img,0,0,ctx.canvas.width,ctx.canvas.height/*2/3*/)
      break


  }
  drawReptincel(ctx)
  if (state.dialogue.action == "DebutDresseur"){
      ctx.drawImage(champion,850,100,300,300)
  }else{drawEnemy(ctx,state)}
  
  if (state.dialogue.actif){
    drawDialogue(ctx,state)
  }else{
    drawBarInterface(ctx,state)
  }
  drawHpInterface(ctx,state)
}

const drawAffichageMap = (ctx : CanvasRenderingContext2D, state : State) => {
  if (state.framechangemap < 90) {
    ctx.fillRect(0,0,200,50)
    ctx.fillStyle = 'black'
    ctx.strokeRect(0,0,200,50)
    ctx.font = "30px arial";

    ctx.fillText(state.zoneactuel,60,35)
    state.framechangemap++
  }else{
    state.framechangemap = 0 
    state.changemap = false
  }
  
}
 


export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
  clear(ctx);
  if (state.endOfGame){
    drawBlackScreen(ctx)
    ctx.fillStyle = "white"
    ctx.font = "80px arial" 
    ctx.fillText("Merci d'avoir joué", 400,100)
    ctx.fillText("Farouck Cherfi & Lyes Laïmouche",100,300)
  }else{
    if (state.battle) {
      state.flashcount++;
      if (state.flashcount < 30){
        if (state.flashcount % 10 < 5) {
          drawBlackScreen(ctx);
        }
        else {
          drawMap(ctx, state);
          drawPlayer(ctx, state);
          drawDresseur(ctx,state)
          drawForeGround(ctx, state);
          
        }  
    }else {
      //musiqueCombat(state)
      drawBattle(ctx,state)
    }
    }else {
      if(state.musique){
        //musiqueV();
        state.musique = false
      }
      drawMap(ctx, state);
      drawPlayer(ctx, state);
      drawDresseur(ctx,state)
      drawForeGround(ctx, state);
      if (state.changemap){
        drawAffichageMap(ctx,state)
      }
    }  
  }
  
};






