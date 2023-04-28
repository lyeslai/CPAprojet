import { KeyboardEvent } from 'react';
import * as conf from './conf'
export type Coord = { x: number; y: number; dx: number; dy: number }

/* Joueur */
type Joueur = { coord: Coord , frame : number , moving : boolean}
type Dresseur = { coord : Coord, direction : number, pokemon : AllyPokemon}
type Size = { height: number; width: number }
type Bordure = { coordupleft: Coord; size: Size }
type Carte = { coord : Coord, up : boolean, down : boolean, right : boolean, left : boolean, input : string, moving : boolean}
export type Herbe = { coord : Coord}
type HpBar = { max : number, actuel : number}
type EnemyPokemon = { nom : string, hp : HpBar}
type Attack = {nom : string, damage : number, type : string}
type AllyPokemon = { nom : string, hp : HpBar, attack : Attack}
export type Zones = { coord : Coord, nom : string}
type Dialogue = { action : string, actif : boolean }
export type Obstacles = {coord : Coord}
export type Sables = { coord : Coord}
export type Interaction = {coord : Coord, nom : string}


const randint = (max : number) => Math.floor(Math.random() * max)

export type State = {
  map : Carte
  zones : Array<Zones>
  obstacles : Array<Obstacles>
  interactions : Array<Interaction>
  rencontres : Array<Herbe>
  sables : Array<Sables>
  joueur: Joueur
  zoneactuel : string
  enemy : EnemyPokemon
  ally : AllyPokemon
  dresseur : Dresseur
  size: Size
  combat : boolean
  battle : boolean
  dialogue : Dialogue
  flashcount : number
  framedialogue : number
  changemap : boolean
  talking : boolean
  framechangemap : number
  vitesse : number 
  typeattack : string
  endOfGame: boolean
  musique : boolean

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
          case "e": 
            if (state.talking){
              getPokemonDresseur(state)
              state.battle = true 
              state.dialogue = { actif : true, action : "DebutDresseur"}
              state.joueur.moving = false
            }
            break
          case "b": 
            state.vitesse = conf.MAXMOVE * 2
            state.joueur.frame = (state.joueur.frame + 1) % 3

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
        case "b": 
          state.vitesse = conf.MAXMOVE
          break
        case "e": 

          break
      }
      return state
    }

const deplacementGauche = (state : State, vitesse : number) => {
  state.map.coord.x += vitesse
  state.obstacles.forEach((obstacle) => obstacle.coord.x += vitesse)
  state.rencontres.forEach((herbe) => herbe.coord.x += vitesse)
  state.zones.forEach((zone) => zone.coord.x += vitesse)
  state.sables.forEach((sable) => sable.coord.x += vitesse)
  state.interactions.forEach((interaction) => interaction.coord.x += vitesse)
  state.dresseur.coord.x += vitesse
}

const deplacementDroit = (state : State, vitesse : number) => {
  state.map.coord.x -= vitesse
  state.obstacles.forEach((obstacle) => obstacle.coord.x -= vitesse)
  state.rencontres.forEach((herbe) => herbe.coord.x -= vitesse)
  state.zones.forEach((zone) => zone.coord.x -= vitesse)
  state.sables.forEach((sable) => sable.coord.x -= vitesse)
  state.interactions.forEach((interaction) => interaction.coord.x -= vitesse)
  state.dresseur.coord.x -= vitesse
}

const deplacementHaut = (state : State, vitesse : number) => {
  state.map.coord.y += vitesse
  state.obstacles.forEach((obstacle) => obstacle.coord.y += vitesse)
  state.rencontres.forEach((herbe) => herbe.coord.y += vitesse)
  state.zones.forEach((zone) => zone.coord.y += vitesse)
  state.sables.forEach((sable) => sable.coord.y += vitesse)
  state.interactions.forEach((interaction) => interaction.coord.y += vitesse)
  state.dresseur.coord.y += vitesse
}

const deplacementBas = (state : State, vitesse : number) => {
  state.map.coord.y -= vitesse
  state.obstacles.forEach((obstacle) => obstacle.coord.y -= vitesse)
  state.rencontres.forEach((herbe) => herbe.coord.y -= vitesse)
  state.zones.forEach((zone) => zone.coord.y -= vitesse)
  state.sables.forEach((sable) => sable.coord.y -= vitesse)
  state.interactions.forEach((interaction) => interaction.coord.y -= vitesse)
  state.dresseur.coord.y -= vitesse
}

const carteIterate = (state: State) => {

  if (state.map.down && state.map.input === 's'){
    collisionDown(state)
    if (state.map.moving){
      deplacementBas(state,state.vitesse)
    }
    
  }
  else if (state.map.right && state.map.input === 'd'){
    collisionRight(state)
    if (state.map.moving){
      deplacementDroit(state,state.vitesse)
    }
  }
  else if (state.map.left && state.map.input === 'q'){
    collisionLeft(state)
    if (state.map.moving){
      deplacementGauche(state,state.vitesse)
    }
  }
  else if (state.map.up && state.map.input === 'z'){
    collisionUp(state)
    if (state.map.moving){
      deplacementHaut(state,state.vitesse)
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
    state.enemy.hp.max = 12 
    state.enemy.hp.actuel = 12
    state.enemy.nom = "Elekable"
  }else{
    state.enemy.hp.max = 12 
    state.enemy.hp.actuel = 12 
    state.enemy.nom = "Chenipan"
  }
}

const getPokemonDresseur = (state : State) => {
    state.enemy.hp.max = state.dresseur.pokemon.hp.max 
    state.enemy.hp.actuel = state.dresseur.pokemon.hp.actuel
    state.enemy.nom = state.dresseur.pokemon.nom
}


const rencontrescombat = (state: State) => {
  state.map.moving = true 
  const joueur = state.joueur
  state.rencontres.forEach((herbe) => {
    if (joueur.coord.x + 48 >= herbe.coord.x && 
        joueur.coord.x <= herbe.coord.x  + 48 &&
        joueur.coord.y <= herbe.coord.y + 48 && 
        joueur.coord.y + 48 >= herbe.coord.y){
          if(state.map.right || state.map.down || state.map.left || state.map.up){
            if (Math.random() < 0.005){
              getRandomPoke(state)
              state.battle = true 
              state.dialogue = { actif : true, action : "Debut"}
              state.joueur.moving = false
            }
          }
    }
  })
}

const zonesables = (state : State) => {
  const joueur = state.joueur 
  state.sables.forEach((sable) => {
    if (joueur.coord.x + 48 >= sable.coord.x && 
      joueur.coord.x <= sable.coord.x  + 48 &&
      joueur.coord.y <= sable.coord.y + 48 && 
      joueur.coord.y + 48 >= sable.coord.y){
        deplacementBas(state,1 * 3/4)
        }
  })
}

const interaction = (state : State) => {
  const joueur = state.joueur 
  state.interactions.forEach((interaction) => {
    if (joueur.coord.x + 48 >= interaction.coord.x && 
      joueur.coord.x <= interaction.coord.x  + 48 &&
      joueur.coord.y <= interaction.coord.y + 48 && 
      joueur.coord.y + 48 >= interaction.coord.y){
          state.talking = true 
        }
  })
  
}

const zonechargements = (state: State) => {   
  const joueur = state.joueur
  state.zones.forEach((zone) => {
    if (joueur.coord.x + 48 >= zone.coord.x && 
      joueur.coord.x <= zone.coord.x  + 48 &&
      joueur.coord.y <= zone.coord.y + 48 && 
      joueur.coord.y + 48 >= zone.coord.y){
        switch(state.zoneactuel) {
          case "Plage" :
            if (zone.nom !== "Plage"){
              state.zoneactuel = "Plaine"
              state.framechangemap = 0
              state.changemap = true
            }
            break
          case "Plaine" :
            if (zone.nom !== "Plaine"){
              state.zoneactuel = "Plage"
              state.framechangemap = 0
              state.changemap = true
              

            }
            break
        }
    }
  })
}

const combatIterate = (state: State) => {
  if(state.dialogue.actif){
    if (state.dialogue.action === "End"){
      if (state.talking){
        state.endOfGame = true 
        state.flashcount = 0 
        state.talking = false
        state.battle = false
      }else{
        state.battle = false 
        state.joueur.moving = true 
        state.flashcount = 0 
        state.dialogue.actif = false 
      }
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
    if(state.dialogue.action === "FinDebut"){
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
  zonesables(state)
  zonechargements(state)
  rencontrescombat(state)
  interaction(state)
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
