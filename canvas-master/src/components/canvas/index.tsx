import * as conf from './conf'
import { useRef, useEffect} from 'react'
import { Sables, Zones, Herbe,Obstacles, State, step, mouseMove, onKeyBoardMove, onKeyBoardUpUp ,mouseClick, endOfGame} from './state'
import { render } from './renderer'


const MapZonesSable : Array<Array<number>> = []
for (let i = 0 ; i < conf.ZONESSABLE.length ; i += 70){
  MapZonesSable.push(conf.ZONESSABLE.slice(i,i+70))
}
const MapZonesHerbe : Array<Array<number>> = []

for (let i = 0 ; i < conf.ZONEHERBE.length ; i += 70){
  MapZonesHerbe.push(conf.ZONEHERBE.slice(i,i+70))
}

const zonechargement : Array<Zones> = []
MapZonesHerbe.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol !== 0){
    zonechargement.push(
      {coord : 
        { x : (j * 64) - 1000, y : (i * 64) - 1000, dx : 0 , dy : 0},
        nom : "Plaine"
      }
      
    )
    }
    }  
  )
})

MapZonesSable.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol !== 0){
    zonechargement.push(
      {coord : 
        { x : (j * 64) - 1000, y : (i * 64) - 1000, dx : 0 , dy : 0},
        nom : "Plage"
      }
    )
    }
    }  
  )
})


const MapObstacles : Array<Array<number>> = []
for (let i = 0 ; i < conf.OBSTACLES.length ; i += 70){
  MapObstacles.push(conf.OBSTACLES.slice(i,i+70))
}

const obstaclesReel : Array<Obstacles> = []
MapObstacles.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol !== 0){
    obstaclesReel.push(
      {coord : 
        { x : (j * 64) - 1000, y : (i * 64) - 1000, dx : 0 , dy : 0}
      }
    )
    }
    }  
  )
})
const MapRencontres : Array<Array<number>> = []
for (let i = 0 ; i < conf.RENCONTRES.length ; i += 70){
  MapRencontres.push(conf.RENCONTRES.slice(i,i+70))
}
const rencontresReel : Array<Herbe> = []
MapRencontres.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol !== 0){
    rencontresReel.push(
      {coord : 
        
        { x : (j * 64) - 1000, y : (i * 64) - 1000, dx : 0 , dy : 0}
      }
    )
    }
  }
  )
})

const MapSable : Array<Array<number>> = []
for (let i = 0 ; i < conf.SABLESMOUVANT.length ; i += 70){
  MapSable.push(conf.SABLESMOUVANT.slice(i,i+70))
}

const sablesReel : Array<Sables> = []
MapSable.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol !== 0){
    sablesReel.push(
      {coord : 
        { x : (j * 64) - 1000, y : (i * 64) - 1000, dx : 0 , dy : 0},
      }
    )
    }
  }
  )
})
console.log(sablesReel)

const initCanvas =
  (iterate: (ctx: CanvasRenderingContext2D) => void) =>
  (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    requestAnimationFrame(() => iterate(ctx))
  }

const Canvas = ({ height, width }: { height: number; width: number }) => {
  const initialState: State = {
    map : {
      coord : {
        x : -1000,
        y : -1000,
        dx : 0,
        dy :0
      },
      up : false,
      down : false,
      right : false,
      left : false,
      moving : true,
      input : '',
    },
    joueur : {
      coord: {
        x: width/2 ,
        y: height/ 2,
        dx: 0,
        dy: 0
      }, 
      frame : 0 ,
      moving : true
    },
    enemy : {
      nom : "",
      hp : {
        max : 0, 
        actuel : 0
      }
    } ,
    ally : {
      hp : {
      max : 40, 
      actuel : 40
      } ,
      nom : "Reptincel",
      attack : {
        nom : "",
        type : "", 
        damage : 0,
      }
    },
    dialogue : {
      actif : false, 
      action : "",
    },
    framedialogue : 0,
    size: { width : 1024 , height : 576 },
    obstacles : obstaclesReel,
    rencontres : rencontresReel,
    sables : sablesReel,
    battle : false,
    typeattack : "",
    flashcount : 0,
    framechangemap: 0,
    zones : zonechargement,
    changemap : false,
    zoneactuel : "Plaine",
    vitesse : conf.MAXMOVE,
    endOfGame: true
  }

 
  const ref = useRef<any>()
  const state = useRef<State>(initialState)

  const iterate = (ctx: CanvasRenderingContext2D) => {
    state.current = step(state.current) 
    state.current.endOfGame = !endOfGame(state.current)
    render(ctx)(state.current)
    if (!state.current.endOfGame) requestAnimationFrame(() => iterate(ctx))
  }

  const onMove = (e: any) => {
    state.current = mouseMove(state.current)(e)
  }

  const onKeyBoard = (e: any) => {    
    state.current = onKeyBoardMove(state.current)(e)
  }

  const onKeyBoardUp = (e: any) => {
    state.current = onKeyBoardUpUp(state.current)(e)
  }

  const onMouseClick = (e: MouseEvent) => {
    state.current = mouseClick(state.current)(e)
  }

  useEffect(() => {
    if (ref.current) {
      initCanvas(iterate)(ref.current)
      ref.current.addEventListener('mousemove', onMove)
      ref.current.addEventListener('click', onMouseClick)
      window.addEventListener('keydown', onKeyBoard)
      window.addEventListener('keyup', onKeyBoardUp)
    }
    return () => {
      ref.current.removeEventListener('mousemove', onMove)
      ref.current.removeEventListener('click', onMouseClick)
      window.removeEventListener('keydown', onKeyBoard)
      window.removeEventListener('keyup', onKeyBoardUp)

    }
  }, [])
  return <canvas {...{ width , height, ref }} style={{ backgroundColor: 'black' }} />
}

export default Canvas
