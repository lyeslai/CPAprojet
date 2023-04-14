import { KeyboardEvent } from 'react';
import * as conf from './conf'
type Coord = { x: number; y: number; dx: number; dy: number }
type Ball = { coord: Coord; life: number; invincible?: number }

/* Joueur */
type Joueur = { coord: Coord; life: number, moveLeft: boolean, moveUp: boolean, moveDown: boolean, moveRight: boolean }

type Size = { height: number; width: number }
type Bordure = { coordupleft: Coord; size: Size }

export type State = {
  joueur: Joueur
  /*pos: Array<Ball>*/
  size: Size
  obstacles: Array<Bordure>
  endOfGame: boolean
}

const dist2 = (o1: Coord, o2: Coord) =>
  Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)

const iterate = (bound: Size) => (obstacles: Array<Bordure>) => (joueur: Joueur) => {
  const coord = joueur.coord
  
  if (coord.y < conf.RADIUS) {
    return { ...joueur, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx, dy: coord.dy > 0 ? coord.dy : 0 }, moveUp: false }
  }
  if (coord.y + conf.RADIUS > bound.height) {
    return { ...joueur, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx, dy: coord.dy < 0 ? coord.dy : 0 }, moveDown: false }
  }
  if (coord.x < conf.RADIUS) {
    return { ...joueur, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx > 0 ? coord.dx : 0, dy: coord.dy }, moveLeft: false }
  }
  if (coord.x + conf.RADIUS > bound.width) {
    return { ...joueur, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx < 0 ? coord.dx : 0, dy: coord.dy < 0 ? coord.dy : 0 }, moveRight: false }
  }

  for(const o of obstacles){
    let dx = coord.dx;
    let dy = coord.dy;
    if (collideObstaclesRightBorder(joueur, o)) {
      joueur.moveLeft = false 
      dx = 0  
    }
    if(collideObstaclesLeftBorder(joueur,o)){
      joueur.moveRight = false
      dx = 0 
    }
    if(collideObstaclesTopBorder(joueur,o)){
      joueur.moveDown = false
      dy = 0 
    }
    if(collideObstaclesBottomBorder(joueur,o)){
      joueur.moveUp= false
      dy = 0 
    }
    joueur.coord = {
      x: coord.x + dx,
      y: coord.y + dy,
      dx: dx * conf.FRICTION,
      dy: dy * conf.FRICTION
    }
    break;
  }

  return {
    ...joueur,
    moveLeft: true,
    moveUp: true,
    moveDown: true,
    moveRight: true,
    coord: {
      x: coord.x + coord.dx,
      y: coord.y + coord.dy,
      dx: coord.dx * conf.FRICTION,
      dy: coord.dy * conf.FRICTION
    },
  }
}

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
      const target = state.joueur
      if (target) {
        switch (keydown) {
          case "z":
            if (target.moveUp) {
              target.coord.dy = -conf.MAXMOVE
            }
            break;
          case "q":
            if (target.moveLeft) {
              target.coord.dx = -conf.MAXMOVE
            }
            break;
          case "s":
            if (target.moveDown) {
              target.coord.dy = conf.MAXMOVE
            }
            break;
          case "d":
            if (target.moveRight) {
              target.coord.dx = conf.MAXMOVE
            }
            break;
        }
      }
      return state
    }

export const onKeyBoardUpUp =
  (state: State) =>
    (event: KeyboardEvent): State => {
      const keyup = event.key
      const target = state.joueur
      if (target) {
        switch (keyup) {
          case "z":
            target.coord.dy = 0
            break;
          case "q":
            target.coord.dx = 0
            break;
          case "s":
            target.coord.dy = 0
            break;
          case "d":
            target.coord.dx = 0
            break;
        }
      }
      return state
    }

const collide = (o1: Coord, o2: Coord) =>
  dist2(o1, o2) < Math.pow(2 * conf.RADIUS, 2)

const collideObstaclesRightBorder = (joueur: Joueur, obstacle: Bordure) => {
  if (joueur.coord.x - conf.RADIUS*2 < obstacle.coordupleft.x + obstacle.size.width && joueur.coord.x > obstacle.coordupleft.x + obstacle.size.width) {
    if (joueur.coord.y < obstacle.coordupleft.y) {
      return Math.pow(obstacle.coordupleft.x + obstacle.size.width - joueur.coord.x, 2) + Math.pow(obstacle.coordupleft.y - joueur.coord.y, 2)
        < Math.pow(conf.RADIUS*2, 2);
    }
    if (obstacle.coordupleft.y < joueur.coord.y && joueur.coord.y < obstacle.coordupleft.y + obstacle.size.height) {
      return true;
    }
    return Math.pow(obstacle.coordupleft.x + obstacle.size.width - joueur.coord.x, 2) + Math.pow(obstacle.coordupleft.y + obstacle.size.height - joueur.coord.y, 2)
      < Math.pow(conf.RADIUS*2, 2);
  }
}


const collideObstaclesLeftBorder = (joueur: Joueur, obstacle: Bordure) => {
  if(joueur.coord.x + conf.RADIUS*2 > obstacle.coordupleft.x && joueur.coord.x<obstacle.coordupleft.x){
      if(joueur.coord.y < obstacle.coordupleft.y){
        return Math.pow(obstacle.coordupleft.x - joueur.coord.x,2)+Math.pow(obstacle.coordupleft.y-joueur.coord.y,2) < Math.pow(conf.RADIUS*2,2)
      }
      if(obstacle.coordupleft.y < joueur.coord.y && joueur.coord.y < obstacle.coordupleft.y+ obstacle.size.height){
        return true
      }
      return Math.pow(obstacle.coordupleft.x-joueur.coord.x,2)+Math.pow(obstacle.coordupleft.y+obstacle.size.height-joueur.coord.y,2) < Math.pow(conf.RADIUS*2,2)
  }

  return false;
}

const collideObstaclesTopBorder = (joueur: Joueur, obstacle : Bordure) => {
  if(joueur.coord.y + conf.RADIUS*2 > obstacle.coordupleft.y && joueur.coord.y < obstacle.coordupleft.y){
    if(joueur.coord.x < obstacle.coordupleft.x){
      return Math.pow(obstacle.coordupleft.x-joueur.coord.x,2)+Math.pow(obstacle.coordupleft.y-joueur.coord.y,2) < Math.pow(conf.RADIUS*2,2)
    }
    if(obstacle.coordupleft.x < joueur.coord.x && joueur.coord.x < obstacle.coordupleft.x + obstacle.size.width){
      return true
    }
    return Math.pow(obstacle.coordupleft.x+obstacle.size.width-joueur.coord.x,2)+Math.pow(obstacle.coordupleft.y-joueur.coord.y,2) < Math.pow(conf.RADIUS*2,2)
  }

  return false;
}

const collideObstaclesBottomBorder = (joueur: Joueur, obstacle : Bordure) => {
  if(joueur.coord.y - conf.RADIUS*2 < obstacle.coordupleft.y + obstacle.size.height && joueur.coord.y > obstacle.coordupleft.y + obstacle.size.height){
    if(joueur.coord.x < obstacle.coordupleft.x){
      return Math.pow(obstacle.coordupleft.x-joueur.coord.x,2)+Math.pow(obstacle.coordupleft.y+obstacle.size.height-joueur.coord.y,2) < Math.pow(conf.RADIUS*2,2)
    }
    if(obstacle.coordupleft.x < joueur.coord.x && joueur.coord.x < obstacle.coordupleft.x + obstacle.size.width){
      return true
    }
    return Math.pow(obstacle.coordupleft.x+obstacle.size.width-joueur.coord.x,2)+Math.pow(obstacle.coordupleft.y+obstacle.size.height-joueur.coord.y,2) < Math.pow(conf.RADIUS*2,2)
  }

  return false;
}



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

export const step = (state: State) => {
  /*state.pos.map((p1, i, arr) => {
    arr.slice(i + 1).map((p2) => {
      if (collide(p1.coord, p2.coord)) {
        if (!p1.invincible) {
          p1.life--
          p1.invincible = 20
        }
        if (!p2.invincible) {
          p2.life--
          p2.invincible = 20
        }
        collideBoing(p1.coord, p2.coord)
      }
    })
  })*/
  state.obstacles.map((o) => {
    console.log(collideObstaclesRightBorder(state.joueur,o))
    if (collideObstaclesRightBorder(state.joueur, o)) {
      state.joueur.moveLeft = false 
      state.joueur.coord.dx = state.joueur.coord.dx > 0 ? state.joueur.coord.dx : 0   
    }
    if(collideObstaclesLeftBorder(state.joueur,o)){
      state.joueur.moveRight = false
      state.joueur.coord.dx = state.joueur.coord.dx < 0 ? state.joueur.coord.dx : 0 
    }
    if(collideObstaclesTopBorder(state.joueur,o)){
      state.joueur.moveDown = false
      state.joueur.coord.dy = state.joueur.coord.dy < 0 ? state.joueur.coord.dy : 0 
    }
    if(collideObstaclesBottomBorder(state.joueur,o)){
      state.joueur.moveUp= false
      state.joueur.coord.dy = state.joueur.coord.dy > 0 ? state.joueur.coord.dy : 0 
    }

  })
  return {
    ...state,
    joueur: (iterate(state.size))(state.obstacles)(state.joueur),
    /*pos: state.pos.map(iterate(state.size)).filter((p) => p.life > 0),*/
  }
}

export const mouseMove =
  (state: State) =>
    (event: PointerEvent): State => {
      return state
    }

export const endOfGame = (state: State): boolean => true
