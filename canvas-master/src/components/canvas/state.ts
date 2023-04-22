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

export type Obstacles = {coord : Coord}

export type State = {
  map : Carte
  joueur: Joueur
  size: Size
  obstacles : Array<Obstacles>
  herbes : Array<Herbe>
  battle : boolean
  flashcount : number
  endOfGame: boolean

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
              state.battle = true 
              state.joueur.moving = false
            }
          }
    }
  })
}

export const step = (state: State) => {

  if (state.battle){
    return {
    ...state
    }
  }

  carteIterate(state)
  rencontrescombat(state)
  return {
    ...state,
    //joueur: (iterate(state.size))(state.joueur),
  }
}

export const mouseMove =
  (state: State) =>
    (event: PointerEvent): State => {
      return state
    }

export const endOfGame = (state: State): boolean => true
