import * as conf from './conf'
import { useRef, useEffect} from 'react'
import { Zones, Herbe,Obstacles, State, step, mouseMove, onKeyBoardMove, onKeyBoardUpUp ,mouseClick, endOfGame} from './state'
import { render } from './renderer'

const MapObstacles : Array<Array<number>> = []
for (let i = 0 ; i < conf.OBSTACLES.length ; i += 60){
  MapObstacles.push(conf.OBSTACLES.slice(i,i+60))
}

const zonechargement : Array<Zones> = []
const obstaclesReel : Array<Obstacles> = []
MapObstacles.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol === 421){
    obstaclesReel.push(
      {coord : 
        { x : (j * 64) - 848, y : (i * 64) - 1866, dx : 0 , dy : 0}
      }
    )
    }
    }  
  )
})

const MapRencontres : Array<Array<number>> = []
for (let i = 0 ; i < conf.RENCONTRES.length ; i += 60){
  MapRencontres.push(conf.RENCONTRES.slice(i,i+60))
}

const rencontresReel : Array<Herbe> = []
MapRencontres.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol === 421){
    rencontresReel.push(
      {coord : 
        { x : (j * 64) - 848, y : (i * 64) - 1866, dx : 0 , dy : 0}
      }
    )
    }
  }
  )
})

const MapSable : Array<Array<number>> = []
for (let i = 0 ; i < conf.SABLESMOUVANT.length ; i += 60){
  MapSable.push(conf.SABLESMOUVANT.slice(i,i+60))
}
const sables : Array<Zones> = []
MapSable.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol != 0){
    sables.push(
      {coord : 
        { x : (j * 64) - 1416, y : (i * 64) - 2128, dx : 0 , dy : 0},
        nom : "Grotte2",
      }
      
    )
    }
  }
  )
})

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
        x : -848,
        y : -1866,
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
    sables : sables,
    battle : false,
    typeattack : "Type",
    flashcount : 0,
    zones : zonechargement,
    changemap : false,
    zoneactuel : "Debut",
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
