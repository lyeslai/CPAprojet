import { KeyboardEvent } from 'react';
import * as conf from './conf'
export type Coord = { x: number; y: number; dx: number; dy: number }
/*type Ball = { coord: Coord; life: number; invincible?: number }*/

/* Joueur */
type Joueur = { coord: Coord , frame : number , moving : boolean}
type Size = { height: number; width: number }
type Bordure = { coordupleft: Coord; size: Size }
type Carte = { coord : Coord, up : boolean, down : boolean, right : boolean, left : boolean, input : string, moving : boolean}
export type Herbe = { coord : Coord}
type HpBar = { max : number, actuel : number}
type EnemyPokemon = { nom : string, hp : HpBar}
type Attack = {nom : string, damage : number, type : string}
type AllyPokemon = { nom : string, hp : HpBar, attack : Attack}
type Dialogue = { action : string, actif : boolean }

export type Obstacles = {coord : Coord}

export type State = {
  map : Carte
  joueur: Joueur
  enemy : EnemyPokemon
  ally : AllyPokemon
  size: Size
  obstacles : Array<Obstacles>
  herbes : Array<Herbe>
  battle : boolean
  dialogue : Dialogue
  flashcount : number
  framedialogue : number
  typeattack : string
  endOfGame: boolean

}

/* A debug */ 
export const onMove = (state : State) => (event : any) : State => {
  if (state.battle && !state.dialogue.actif){
    const canvas = event.target as HTMLCanvasElement;
    const canvasRect = canvas.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    const rect1 = { x: 0, y: 570, width: 500, height: 300 }
    const rect2 = { x: 500, y: 570, width: 500, height: 300 } 

    if (x >= rect1.x && x <= rect1.x + rect1.width && y >= rect1.y && y <= rect1.y + rect1.height) {
      state.typeattack = "feu"
    } else if (x >= rect2.x && x <= rect2.x + rect2.width && y >= rect2.y && y <= rect2.y + rect2.height) {
      state.typeattack = "ténèbres"
    }
      return state
    }
  return state
}

export const mouseClick = (state : State) => (event : MouseEvent) : State => {
  if (state.battle && !state.dialogue.actif){
    const canvas = event.target as HTMLCanvasElement;
    const canvasRect = canvas.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    const rect1 = { x: 0, y: 570, width: 500, height: 300 }
    const rect2 = { x: 500, y: 570, width: 500, height: 300 } 

    if (x >= rect1.x && x <= rect1.x + rect1.width && y >= rect1.y && y <= rect1.y + rect1.height) {
      state.ally.attack = { nom : "Lance-flammes", type : "feu", damage : 5}
      state.dialogue = {actif : true , action : "Ally"}
    } else if (x >= rect2.x && x <= rect2.x + rect2.width && y >= rect2.y && y <= rect2.y + rect2.height) {
      state.ally.attack = { nom : "Morsure", type : "ténèbres", damage : 3}
      state.dialogue = {actif : true, action : "Ally"}
    }
      return state
    }

  return state;
}

export const onKeyBoardMove =
  (state: State) =>
    (event: KeyboardEvent): State => {
      const keydown = event.key
      if (state.joueur.moving){
        switch (keydown) {
          case "z":
            state.map.up = true
            state.map.input = 'z'
            state.joueur.frame = (state.joueur.frame + 1) % 4 
            break;
          case "q":
            state.map.left = true
            state.map.input = 'q'
            state.joueur.frame = (state.joueur.frame + 1) % 3 
            break;
          case "s":
            state.map.down = true
            state.map.input = 's'
            state.joueur.frame = (state.joueur.frame + 1) % 3
            break;
          case "d":
            state.map.right = true
            state.map.input = 'd'
            state.joueur.frame = (state.joueur.frame + 1) % 3
            break;
        }
      }
      return state
    }

export const onKeyBoardUpUp =
  (state: State) =>
    (event: KeyboardEvent): State => {
      const keyup = event.key
      switch (keyup) {
        case "z":
          state.map.up = false
          state.joueur.frame = 0
          break;
        case "q":
          state.map.left = false
          state.joueur.frame = 0
          break;
        case "s":
          state.map.down = false
          state.joueur.frame = 0
          break;
        case "d":
          state.map.right = false
          state.joueur.frame = 0
          break;
      }
      return state
    }

  

const carteIterate = (state: State) => {

  if (state.map.down && state.map.input === 's'){
    collisionDown(state)
    if (state.map.moving){
      state.map.coord.y -= conf.MAXMOVE
      state.obstacles.forEach((obstacle) => obstacle.coord.y -= conf.MAXMOVE)
      state.herbes.forEach((herbe) => herbe.coord.y -= conf.MAXMOVE)
    }
    
  }
  else if (state.map.right && state.map.input === 'd'){
    collisionRight(state)
    if (state.map.moving){
      state.map.coord.x -= conf.MAXMOVE
      state.obstacles.forEach((obstacle) => obstacle.coord.x -= conf.MAXMOVE)
      state.herbes.forEach((herbe) => herbe.coord.x -= conf.MAXMOVE)

    }

  }
  else if (state.map.left && state.map.input === 'q'){
    collisionLeft(state)
    if (state.map.moving){
      state.map.coord.x += conf.MAXMOVE
      state.obstacles.forEach((obstacle) => obstacle.coord.x += conf.MAXMOVE)
      state.herbes.forEach((herbe) => herbe.coord.x += conf.MAXMOVE)

    }

  }
  else if (state.map.up && state.map.input === 'z'){
    collisionUp(state)
    if (state.map.moving){
      state.map.coord.y += conf.MAXMOVE
      state.obstacles.forEach((obstacle) => obstacle.coord.y += conf.MAXMOVE)
      state.herbes.forEach((herbe) => herbe.coord.y += conf.MAXMOVE)

    }
  }
}

const collisionLeft = (state: State) => {
  state.map.moving = true 
  const joueur = state.joueur
  state.obstacles.forEach((obstacle) => {
    if (joueur.coord.x + 48 >= obstacle.coord.x+ conf.MAXMOVE && 
        joueur.coord.x <= obstacle.coord.x+ conf.MAXMOVE  + 48 &&
        joueur.coord.y <= obstacle.coord.y + 48 && 
        joueur.coord.y + 48 >= obstacle.coord.y){
          state.map.moving = false 
    }
  })
}
const collisionRight = (state: State) => {
  state.map.moving = true 
  const joueur = state.joueur
  state.obstacles.forEach((obstacle) => {
    if (joueur.coord.x + 48 >= obstacle.coord.x- conf.MAXMOVE && 
        joueur.coord.x <= obstacle.coord.x- conf.MAXMOVE  + 48 &&
        joueur.coord.y <= obstacle.coord.y + 48 && 
        joueur.coord.y + 48 >= obstacle.coord.y){
          state.map.moving = false 
    }
  })
}
const collisionDown = (state: State) => {
  state.map.moving = true 
  const joueur = state.joueur
  state.obstacles.forEach((obstacle) => {
    if (joueur.coord.x + 48 >= obstacle.coord.x && 
        joueur.coord.x <= obstacle.coord.x  + 48 &&
        joueur.coord.y <= obstacle.coord.y - conf.MAXMOVE + 48 && 
        joueur.coord.y + 48 >= obstacle.coord.y- conf.MAXMOVE){
          state.map.moving = false 
    }
  })
}

const collisionUp = (state: State) => {
  state.map.moving = true 
  const joueur = state.joueur
  state.obstacles.forEach((obstacle) => {
    if (joueur.coord.x + 48 >= obstacle.coord.x && 
        joueur.coord.x <= obstacle.coord.x  + 48 &&
        joueur.coord.y <= obstacle.coord.y + conf.MAXMOVE + 48 && 
        joueur.coord.y + 48 >= obstacle.coord.y+ conf.MAXMOVE){
          state.map.moving = false 
    }
  })
}

const getRandomPoke = (state : State) => {
  const r = Math.random() 
  if ( r > 0.5) {
    state.enemy.hp.max = 15 
    state.enemy.hp.actuel = 15 
    state.enemy.nom = "Chenipan XL"
  }else{
    state.enemy.hp.max = 12 
    state.enemy.hp.actuel = 12 
    state.enemy.nom = "Chenipan"
  }
}

const rencontrescombat = (state: State) => {
  state.map.moving = true 
  const joueur = state.joueur
  state.herbes.forEach((herbe) => {
    if (joueur.coord.x + 48 >= herbe.coord.x && 
        joueur.coord.x <= herbe.coord.x  + 48 &&
        joueur.coord.y <= herbe.coord.y + 48 && 
        joueur.coord.y + 48 >= herbe.coord.y){
          if(state.map.right || state.map.down || state.map.left || state.map.up){
            if (Math.random() < 0.005){
              getRandomPoke(state)
              state.battle = true 
              state.joueur.moving = false
            }
          }
    }
  })
}

const combatIterate = (state: State) => {
  if(state.dialogue.actif){
    if (state.dialogue.action === "End"){
      state.battle = false 
      state.joueur.moving = true 
      state.flashcount = 0 
      state.dialogue.actif = false 
    }
    if(state.dialogue.action === "EndAlly"){
      state.enemy.hp.actuel -= state.ally.attack.damage
      state.dialogue.action = "Enemy"
    }
    if (state.enemy.hp.actuel <= 0){
      state.dialogue.action = "Victoire"
    }
    if(state.dialogue.action === "EndEnemy"){
      state.ally.hp.actuel -= 1
      state.dialogue.actif = false 
    }
   
  }
}

export const step = (state: State) => {

  if (state.battle){
    combatIterate(state)
    return {
    ...state
    }
  }

  carteIterate(state)
  rencontrescombat(state)
  return {
    ...state,
  }
}

export const mouseMove =
  (state: State) =>
    (event: PointerEvent): State => {
      return state
    }

export const endOfGame = (state: State): boolean => true
