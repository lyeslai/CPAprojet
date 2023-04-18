import * as conf from './conf'
import { useRef, useEffect} from 'react'
import { State, step, click, mouseMove, onKeyBoardMove, onKeyBoardUpUp , endOfGame} from './state'
import { render } from './renderer'

/*const randomInt = (max: number) => Math.floor(Math.random() * max)
const randomSign = () => Math.sign(Math.random() - 0.5)*/

const initCanvas =
  (iterate: (ctx: CanvasRenderingContext2D) => void) =>
  (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    requestAnimationFrame(() => iterate(ctx))
  }

const Canvas = ({ height, width }: { height: number; width: number }) => {
  const initialState: State = {
    joueur : {
      coord: {
        x: 501,
        y: 306,
        dx: 0,
        dy: 0
      },
      moveLeft : true,
      moveUp : true,
      moveDown : true, 
      moveRight : true,
      frameIndexX : 0, 
      frameIndexY : 0, 
      nbFrameLR : 12,
      nbFrameUD : 4,
      coeur : 1
    },
    slime : {
      life : 3, 
      coord : {
        x : 800,
        y : 300,
        dx : 0,
        dy : 0
      },
      frameIndex : 0, 
      nbFrameLR : 7
    },
    obstacles : conf.OBSTACLES,
    size: { width : 1008 , height : 520  },
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
  const onClick = (e: PointerEvent) => {
    state.current = click(state.current)(e)
  }

  const onMove = (e: PointerEvent) => {
    state.current = mouseMove(state.current)(e)
  }

  const onKeyBoard = (e: any) => {    
    state.current = onKeyBoardMove(state.current)(e)
  }


  const onKeyBoardUp = (e: any) => {
    state.current = onKeyBoardUpUp(state.current)(e)
  }

  useEffect(() => {
    if (ref.current) {
      initCanvas(iterate)(ref.current)
      ref.current.addEventListener('click', onClick)
      ref.current.addEventListener('mousemove', onMove)
      window.addEventListener('keydown', onKeyBoard)
      window.addEventListener('keyup', onKeyBoardUp)
    }
    return () => {
      ref.current.removeEventListener('click', onClick)
      ref.current.removeEventListener('mousemove', onMove)
      window.removeEventListener('keydown', onKeyBoard)
      window.removeEventListener('keyup', onKeyBoardUp)

    }
  }, [])
  return <canvas {...{ height, width, ref }} />
}

export default Canvas
