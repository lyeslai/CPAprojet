import * as conf from './conf'
import { useRef, useEffect} from 'react'
import { Maj,Zones, Herbe,Obstacles, State, step, mouseMove, onKeyBoardMove, onKeyBoardUpUp ,mouseClick, endOfGame} from './state'
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
        { x : (j * 64) - 1472, y : (i * 64) - 1568, dx : 0 , dy : 0}
      }
    )
    }
    if (symbol === 8){
      zonechargement.push(
        {coord : 
          {x : (j * 64) - 1472, y : (i * 64) - 1568, dx : 0 , dy : 0},
          nom : "Grotte"
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
        { x : (j * 64) - 1472, y : (i * 64) - 1568, dx : 0 , dy : 0}
      }
    )
    }
  }
  )
})

const MapObstacles2 : Array<Array<number>> = []
for (let i = 0 ; i < conf.OBSTACLES2.length ; i += 70){
  MapObstacles2.push(conf.OBSTACLES2.slice(i,i+70))
}
const obstaclesReel2 : Array<Obstacles> = []
MapObstacles2.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol === 3807){
    obstaclesReel2.push(
      {coord : 
        { x : (j * 64) - 650, y : (i * 64) - 64, dx : 0 , dy : 0}
      }
    )
    }
    }
  )
})

const MapRencontres2 : Array<Array<number>> = []
for (let i = 0 ; i < conf.RENCONTRES2.length ; i += 70){
  MapRencontres2.push(conf.RENCONTRES2.slice(i,i+70))
}

const rencontresReel2 : Array<Herbe> = []
MapRencontres2.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol === 3906){
    rencontresReel2.push(
      {coord : 
        { x : (j * 64) - 650, y : (i * 64) - 64, dx : 0 , dy : 0}
      }
    )
    }
  }
  )
})

const MapZones2 : Array<Array<number>> = []
for (let i = 0 ; i < conf.ZONES2.length ; i += 70){
  MapZones2.push(conf.ZONES2.slice(i,i+70))
}
const zonechargement2 : Array<Zones> = []
MapZones2.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol === 3872){
    zonechargement2.push(
      {coord : 
        { x : (j * 64) - 650 , y : (i * 64) - 64, dx : 0 , dy : 0},
        nom : "Grotte2",
      }
      
    )
    }
    if (symbol === 3873){
      zonechargement2.push(
        {coord : 
          { x : (j * 64) - 650, y : (i * 64) - 64, dx : 0 , dy : 0},
          nom : "Debut",
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
const sables : Array<Zones> = []
MapSable.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol === 3807){
    sables.push(
      {coord : 
        { x : (j * 64) - 650, y : (i * 64) - 64, dx : 0 , dy : 0},
        nom : "Grotte2",
      }
      
    )
    }
  }
  )
})

/* 3 eme map */ 
const MapObstacles3 : Array<Array<number>> = []
for (let i = 0 ; i < conf.OBSTACLES3.length ; i += 70){
  MapObstacles3.push(conf.OBSTACLES3.slice(i,i+70))
}
const obstaclesReel3 : Array<Obstacles> = []
MapObstacles3.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol === 4900 || symbol === 5063){
    obstaclesReel3.push(
      {coord : 
        { x : (j * 64) - 1472, y : (i * 64) - 1568, dx : 0 , dy : 0}
      }
    )
    }
    }
  )
})

const MapRencontres3 : Array<Array<number>> = []
for (let i = 0 ; i < conf.RENCONTRES3.length ; i += 70){
  MapRencontres3.push(conf.RENCONTRES3.slice(i,i+70))
}

const rencontresReel3 : Array<Herbe> = []
MapRencontres3.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol === 4963){
    rencontresReel3.push(
      {coord : 
        { x : (j * 64) - 1468, y : (i * 64) - 1568, dx : 0 , dy : 0}
      }
    )
    }
  }
  )
})

const MapZones3 : Array<Array<number>> = []
for (let i = 0 ; i < conf.ZONES3.length ; i += 70){
  MapZones3.push(conf.ZONES3.slice(i,i+70))
}
const zonechargement3 : Array<Zones> = []
MapZones3.forEach((row,i) => {
  row.forEach((symbol,j) => {
    if (symbol === 4963){
    zonechargement3.push(
      {coord : 
        { x : (j * 64) - 1468, y : (i * 64) - 1568, dx : 0 , dy : 0},
        nom : "Grotte",
      }
      
    )
    }
  }
  )
})

const maj : Array<Maj> = []
maj.push(
  {rencontres : rencontresReel, hitbox : obstaclesReel, zones : zonechargement, sables : []}
)
maj.push(
  {rencontres : rencontresReel2, hitbox : obstaclesReel2, zones : zonechargement2, sables : sables}
)
maj.push(
  {rencontres : rencontresReel3, hitbox : obstaclesReel3, zones : zonechargement3, sables : []}
)



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
        x : -1472,
        y : -1568,
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
    maj : maj,
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
