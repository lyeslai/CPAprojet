import { KeyboardEvent } from 'react';
import * as conf from './conf'
export type Coord = { x: number; y: number; dx: number; dy: number }
/*type Ball = { coord: Coord; life: number; invincible?: number }*/

/* Joueur */
type Joueur = { coord: Coord , frame : number }
type Size = { height: number; width: number }
type Bordure = { coordupleft: Coord; size: Size }
type Carte = { coord : Coord, up : boolean, down : boolean, right : boolean, left : boolean, input : string, moving : boolean}

export type Obstacles = {coord : Coord}

export type State = {
  map : Carte
  joueur: Joueur
  size: Size
  obstacles : Array<Obstacles>
  endOfGame: boolean

}

const dist2 = (o1: Coord, o2: Coord) =>
  Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)

export const click =
  (state: State) =>
    (event: PointerEvent): State => {
      const { offsetX, offsetY } = event
      /*const target = state.pos.find(
        (p) =>
          dist2(p.coord, { x: offsetX, y: offsetY, dx: 0, dy: 0 }) <
          Math.pow(conf.RADIUS, 2) + 100
      )
      if (target) {
        target.coord.dx += Math.random() * 10
        target.coord.dy += Math.random() * 10
      }*/
      return state
    }

export const onKeyBoardMove =
  (state: State) =>
    (event: KeyboardEvent): State => {
      const keydown = event.key
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

/*const collide = (o1: Coord, o2: Coord) =>
  dist2(o1, o2) < Math.pow(2 * conf.RADIUS, 2)*/
  
const collideBoing = (p1: Coord, p2: Coord) => {
  const nx = (p2.x - p1.x) / (2 * conf.RADIUS)
  const ny = (p2.y - p1.y) / (2 * conf.RADIUS)
  const gx = -ny
  const gy = nx

  const v1g = gx * p1.dx + gy * p1.dy
  const v2n = nx * p2.dx + ny * p2.dy
  const v2g = gx * p2.dx + gy * p2.dy
  const v1n = nx * p1.dx + ny * p1.dy
  p1.dx = nx * v2n + gx * v1g
  p1.dy = ny * v2n + gy * v1g
  p2.dx = nx * v1n + gx * v2g
  p2.dy = ny * v1n + gy * v2g
  p1.x += p1.dx
  p1.y += p1.dy
  p2.x += p2.dx
  p2.y += p2.dy
}

const carteIterate = (state: State) => {

  if (state.map.down && state.map.input === 's'){
    collisionDown(state)
    if (state.map.moving){
      state.map.coord.y -= conf.MAXMOVE
      state.obstacles.forEach((obstacle) => obstacle.coord.y -= conf.MAXMOVE)
    }
    
  }
  else if (state.map.right && state.map.input === 'd'){
    collisionRight(state)
    if (state.map.moving){
      state.map.coord.x -= conf.MAXMOVE
      state.obstacles.forEach((obstacle) => obstacle.coord.x -= conf.MAXMOVE)
    }

  }
  else if (state.map.left && state.map.input === 'q'){
    collisionLeft(state)
    if (state.map.moving){
      state.map.coord.x += conf.MAXMOVE
      state.obstacles.forEach((obstacle) => obstacle.coord.x += conf.MAXMOVE)
    }

  }
  else if (state.map.up && state.map.input === 'z'){
    collisionUp(state)
    if (state.map.moving){
      state.map.coord.y += conf.MAXMOVE
      state.obstacles.forEach((obstacle) => obstacle.coord.y += conf.MAXMOVE)
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

export const step = (state: State) => {
  carteIterate(state)
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
