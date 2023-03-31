import * as conf from './conf'
import { useRef, useEffect, KeyboardEvent } from 'react'
import { State, step, click, mouseMove, onKeyBoardMove, onKeyBoardUpUp , endOfGame} from './state'
import { render } from './renderer'

const randomInt = (max: number) => Math.floor(Math.random() * max)
const randomSign = () => Math.sign(Math.random() - 0.5)

const initCanvas =
  (iterate: (ctx: CanvasRenderingContext2D) => void) =>
  (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    requestAnimationFrame(() => iterate(ctx))
  }

const Canvas = ({ height, width }: { height: number; width: number }) => {
  const initialState: State = {
    pos: new Array(1).fill(1).map((_) => ({
      life: conf.BALLLIFE,
      coord: {
        x: randomInt(820) + 80,
        y: randomInt(500) + 100,
        dx: 0,
        dy: 0
      },
    })),
    pos1 : new Array(6).fill(1).map((_) => ({
      coordupleft : {x : randomInt(820) + 80,  y : randomInt(500) + 100, dx: 0 , dy: 0},
    size : {height : 40, width : 40},
    })),
    
    size: { height, width },
    endOfGame: true,
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

  const onKeyBoard = (e: KeyboardEvent) => {    
    state.current = onKeyBoardMove(state.current)(e)
  }


  const onKeyBoardUp = (e: KeyboardEvent) => {
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

    }
  }, [])
  return <canvas {...{ height, width, ref }} />
}

export default Canvas
