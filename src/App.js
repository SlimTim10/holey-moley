import {
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react'

// Generate a unique number from 2 numbers, order sensitive
const cantorPair = (a, b) => (1/2)*(a + b)*(a + b + 1) + b

const makeHole = (row, col) => ({
  id: cantorPair(row, col),
  active: false
})

const update = (idx, f, xs) => [...xs.slice(0, idx), f(xs[idx]), ...xs.slice(idx + 1)]

const activateHole = (r, c, holeRows) => {
  const f = row => update(c, (hole => ({...hole, active: true})), row)
  return update(r, f, holeRows)
}

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

const App = () => {
  const numRows = 3
  const numCols = 5
  const initialHoleRows = useMemo(() => (
    [...Array(numRows)].map((_, r) =>
      [...Array(numCols)].map((_, c) => makeHole(r, c)))
  ), [])
  
  const [holeRows, setHoleRows] = useState(initialHoleRows)
  const [score, setScore] = useState(0)

  const resetHoles = useCallback(() => {
    setHoleRows(initialHoleRows)
  }, [initialHoleRows])

  const clickHole = hole => {
    if (hole.active) {
      setScore(x => x + 1)
      resetHoles()
    }
  }

  useEffect(() => {
    setInterval(() => {
      const r = getRandomIntInclusive(0, numRows - 1)
      const c = getRandomIntInclusive(0, numCols - 1)
      resetHoles()
      setHoleRows(currentHoleRows => activateHole(r, c, currentHoleRows))
    }, 1000)
  }, [resetHoles])
  
  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-3xl">Holey Moley</h1>
      <p className="bg-green-300 rounded-full p-3 font-bold text-xl">Score: {score}</p>
      <div>
        {holeRows.map((row, idx) => <Row key={idx} holes={row} clickHole={clickHole} />)}
      </div>
    </div>
  );
}

const Row = ({holes, clickHole}) => {
  return (
    <div className="flex flex-row">
      {holes.map(hole => <Hole key={hole.id} hole={hole} clickHole={clickHole} />)}
    </div>
  )
}

const Hole = ({hole, clickHole}) => {
  const colour = hole.active ? 'bg-red-600' : 'bg-black'
  return (
    <div className={`h-16 w-16 ${colour} rounded-full m-3`} onClick={() => clickHole(hole)}></div>
  )
}

export default App
