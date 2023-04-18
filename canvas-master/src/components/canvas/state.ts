import { KeyboardEvent } from 'react';
import * as conf from './conf'
type Coord = { x: number; y: number; dx: number; dy: number }
/*type Ball = { coord: Coord; life: number; invincible?: number }*/

/* Joueur */
type Joueur = { coord: Coord,  moveLeft: boolean, moveUp: boolean, moveDown: boolean, moveRight: boolean, 
                frameIndexX : number,
                frameIndexY : number, 
                nbFrameLR : number,
                nbFrameUD : number,
                coeur : number }
type Slime = { coord : Coord; life : number, nbFrameLR : number, frameIndex : number}

type Size = { height: number; width: number }
type Bordure = { coordupleft: Coord; size: Size }

export type State = {
  joueur: Joueur
  slime : Slime 
  size: Size
  obstacles: Array<Bordure>
  endOfGame: boolean
}

const dist2 = (o1: Coord, o2: Coord) =>
  Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)

  const iterate = (bound: Size) => (obstacles: Array<Bordure>) => (joueur: Joueur) => {
    const coord = joueur.coord
    let collided = false; // variable indiquant si une collision a eu lieu ou non
    
    if (coord.y < conf.SIZEY) {
      return { ...joueur, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx, dy: coord.dy > 0 ? coord.dy : 0 }, moveUp: false }
    }
    if (coord.y + conf.SIZEY > bound.height) {
      return { ...joueur, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx, dy: coord.dy < 0 ? coord.dy : 0 }, moveDown: false }
    }
    if (coord.x < conf.SIZEX) {
      return { ...joueur, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx > 0 ? coord.dx : 0, dy: coord.dy }, moveLeft: false }
    }
    if (coord.x + conf.SIZEX > bound.width) {
      return { ...joueur, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx < 0 ? coord.dx : 0, dy: coord.dy < 0 ? coord.dy : 0 }, moveRight: false }
    }
  
    for(const o of obstacles){
      let dx = coord.dx;
      let dy = coord.dy;
      if (collideObstaclesRightBorder(joueur, o)) {
        joueur.moveLeft = false 
        dx = 0  
        collided = true; // une collision a eu lieu
      }
      
      if(collideObstaclesLeftBorder(joueur,o)){
        joueur.moveRight = false
        dx = 0 
        collided = true;
      }
      
      if(collideObstaclesTopBorder(joueur,o)){
        joueur.moveDown = false
        dy = 0 
        collided = true;
      }
      if(collideObstaclesBottomBorder(joueur,o)){
        joueur.moveUp= false
        dy = 0 
        collided = true;
      }
      if (collided) { 
              return { ...joueur, coord: { x: coord.x + dx, y: coord.y + dy, dx, dy }}

      }
      joueur.coord = {
        x: coord.x + dx,
        y: coord.y + dy,
        dx: dx * conf.FRICTION,
        dy: dy * conf.FRICTION
      }
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
  

const iterateslime = (bound: Size) => (obstacles: Array<Bordure>) => (slime: Slime) => {
  const coord = slime.coord 
  if (coord.y < conf.RADIUS) {
    return { ...slime, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx, dy: coord.dy > 0 ? coord.dy : 0 }, moveUp: false }
  }
  if (coord.y + conf.RADIUS > bound.height) {
    return { ...slime, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx, dy: coord.dy < 0 ? coord.dy : 0 }, moveDown: false }
  }
  if (coord.x < conf.RADIUS) {
    return { ...slime, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx > 0 ? coord.dx : 0, dy: coord.dy }, moveLeft: false }
  }
  if (coord.x + conf.RADIUS > bound.width) {
    return { ...slime, coord: { x: coord.x + coord.dx, y: coord.y + coord.dy, dx: coord.dx < 0 ? coord.dx : 0, dy: coord.dy < 0 ? coord.dy : 0 }, moveRight: false }
  }
    return {
      ...slime, 
      coord : {
        x : coord.x + coord.dx, 
        y : coord.y + coord.dy, 
        dx : coord.dx * conf.FRICTION, 
        dy : coord.dy * conf.FRICTION
      }
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
      const targetslime = state.slime 

      if (target && targetslime) {
        switch (keydown) {
          case "z":
            if (target.moveUp) {
              target.coord.dy = -conf.MAXMOVE
              target.frameIndexX =(target.frameIndexX + 1 ) % target.nbFrameLR
              target.frameIndexY = 0
            }
            break;
          case "q":
            if (target.moveLeft) {
              target.coord.dx = -conf.MAXMOVE
              target.frameIndexX =(target.frameIndexX + 1 ) % target.nbFrameLR
              target.frameIndexY = 3
            }
            break;
          case "s":
            if (target.moveDown) {
              target.coord.dy = conf.MAXMOVE
              target.frameIndexX =(target.frameIndexX + 1 ) % target.nbFrameLR
              target.frameIndexY = 2
            }
            break;
          case "d":
            if (target.moveRight) {
              target.coord.dx = conf.MAXMOVE
              target.frameIndexX =(target.frameIndexX + 1 ) % target.nbFrameLR
              target.frameIndexY = 1
            }
            break;
          case "ArrowLeft":
            targetslime.coord.dx = -conf.MAXMOVE
            targetslime.frameIndex =(targetslime.frameIndex+ 1 ) % targetslime.nbFrameLR
            console.log(targetslime.frameIndex)
            break;
          case "ArrowUp":
            targetslime.coord.dy = -conf.MAXMOVE
            targetslime.frameIndex =(targetslime.frameIndex+ 1 ) % targetslime.nbFrameLR
            break;
          case "ArrowDown":
            targetslime.coord.dy = conf.MAXMOVE
            targetslime.frameIndex =(targetslime.frameIndex + 1 ) % targetslime.nbFrameLR

            break;
          case "ArrowRight":
            targetslime.coord.dx = conf.MAXMOVE
            targetslime.frameIndex =(targetslime.frameIndex+ 1 ) % targetslime.nbFrameLR
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
      const targetslime = state.slime 
      if (target) {
        switch (keyup) {
          case "z":
            target.coord.dy = 0
            target.frameIndexX = 0 

            break;
          case "q":
            target.coord.dx = 0
            target.frameIndexX = 0 

            break;
          case "s":
            target.coord.dy = 0
            target.frameIndexX = 0 

            break;
          case "d":
            target.coord.dx = 0
            target.frameIndexX = 0 

            break;
          case "ArrowLeft":
            targetslime.coord.dx = 0
            break;
          case "ArrowUp":
            targetslime.coord.dy = 0
            break;
          case "ArrowDown":
            targetslime.coord.dy = 0
            break;
          case "ArrowRight":
            targetslime.coord.dx = 0
            break;
        }
      }
      return state
    }

/*const collide = (o1: Coord, o2: Coord) =>
  dist2(o1, o2) < Math.pow(2 * conf.RADIUS, 2)*/

  const collideObstaclesRightBorder = (joueur: Joueur, obstacle: Bordure) => {
    if (joueur.coord.x < obstacle.coordupleft.x + obstacle.size.width && joueur.coord.x + conf.SIZEX > obstacle.coordupleft.x + obstacle.size.width) {
      if (joueur.coord.y < obstacle.coordupleft.y) {
        return joueur.coord.x + conf.SIZEX > obstacle.coordupleft.x + obstacle.size.width && joueur.coord.y + conf.SIZEY > obstacle.coordupleft.y;
      }
      if (obstacle.coordupleft.y < joueur.coord.y + conf.SIZEY && joueur.coord.y < obstacle.coordupleft.y + obstacle.size.height) {
        return true;
      }
      return joueur.coord.x + conf.SIZEX > obstacle.coordupleft.x + obstacle.size.width && joueur.coord.y < obstacle.coordupleft.y + obstacle.size.height;
    }
    return false;
  }
  
  const collideObstaclesLeftBorder = (joueur: Joueur, obstacle: Bordure) => {
    if(joueur.coord.x + conf.SIZEX > obstacle.coordupleft.x && joueur.coord.x<obstacle.coordupleft.x){
        if(joueur.coord.y < obstacle.coordupleft.y){
          return joueur.coord.x < obstacle.coordupleft.x + obstacle.size.width && joueur.coord.y + conf.SIZEY > obstacle.coordupleft.y;
        }
        if(obstacle.coordupleft.y < joueur.coord.y + conf.SIZEY && joueur.coord.y < obstacle.coordupleft.y+ obstacle.size.height){
          return true
        }
        return joueur.coord.x < obstacle.coordupleft.x + obstacle.size.width && joueur.coord.y < obstacle.coordupleft.y + obstacle.size.height;
    }
    return false;
  }
  
  const collideObstaclesTopBorder = (joueur: Joueur, obstacle : Bordure) => {
    if(joueur.coord.y + conf.SIZEY > obstacle.coordupleft.y && joueur.coord.y < obstacle.coordupleft.y){
      if(joueur.coord.x < obstacle.coordupleft.x){
        return joueur.coord.x + conf.SIZEX > obstacle.coordupleft.x && joueur.coord.y < obstacle.coordupleft.y + obstacle.size.height;
      }
      if(obstacle.coordupleft.x < joueur.coord.x + conf.SIZEX && joueur.coord.x < obstacle.coordupleft.x + obstacle.size.width){
        return true
      }
      return joueur.coord.x < obstacle.coordupleft.x + obstacle.size.width && joueur.coord.y < obstacle.coordupleft.y + obstacle.size.height;
    }
    return false;
  }
  
  const collideObstaclesBottomBorder = (joueur: Joueur, obstacle : Bordure) => {
    if(joueur.coord.y < obstacle.coordupleft.y + obstacle.size.height && joueur.coord.y + conf.SIZEY > obstacle.coordupleft.y + obstacle.size.height){
      if(joueur.coord.x < obstacle.coordupleft.x){
        return joueur.coord.x + conf.SIZEX > obstacle.coordupleft.x && joueur.coord.y + conf.SIZEY > obstacle.coordupleft.y;
      }
      if(obstacle.coordupleft.x < joueur.coord.x + conf.SIZEX && joueur.coord.x < obstacle.coordupleft.x + obstacle.size.width){
        return true
      }
      return joueur.coord.x < obstacle.coordupleft.x + obstacle.size.width && joueur.coord.y + conf.SIZEY > obstacle.coordupleft.y;
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
  return {
    ...state,
    slime : (iterateslime(state.size))(state.obstacles)(state.slime), 
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
