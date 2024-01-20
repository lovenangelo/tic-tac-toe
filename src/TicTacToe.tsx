import { useCallback, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import toast, { Toaster } from 'react-hot-toast';
import { Firestore, doc, onSnapshot, updateDoc } from "firebase/firestore";

type Player = 'X' | 'O';

export type BoardMarks = { index: number, mark: "" | Player, count: number }[];

const TicTacToe = ({ gameId, db, userSide }: { gameId: string | null, db: Firestore, userSide: string | null }) => {
  const initMarks: BoardMarks = [
    {
      index: 1,
      mark: "",
      count: 8,
    },
    {
      index: 2,
      mark: "",
      count: 3
    },
    {
      index: 3,
      mark: "",
      count: 4
    },
    {
      index: 4,
      mark: "",
      count: 1
    },
    {
      index: 5,
      mark: "",
      count: 5
    },
    {
      index: 6,
      mark: "",
      count: 9
    },
    {
      index: 7,
      mark: "",
      count: 6
    },
    {
      index: 8,
      mark: "",
      count: 7
    },
    {
      index: 9,
      mark: "",
      count: 2
    },
  ];

  const [boardMarks, setBoardMarks] = useState<BoardMarks>(initMarks);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [xMarks, setXMarks] = useState<number[]>([]);
  const [yMarks, setYMarks] = useState<number[]>([]);

  const notify = useCallback(
    (winner: string) => toast(`${winner} won!`)
    , []);

  useEffect(() => {
    if (gameId) {
      onSnapshot(doc(db, "games", gameId), (doc) => {
        const data = doc.data();
        console.log(data);
        setBoardMarks(data!.gameBoard);
        setCurrentPlayer(data!.currentTurn);
      });
    }

  }, [db, gameId])

  useEffect(() => {
    const updateWinner = async (winner: string) => {
      if (gameId !== null) {
        const gameRef = doc(db, "games", gameId);
        await updateDoc(gameRef, {
          winner
        })
      }
    }
    const xMarksReversed = xMarks.reverse();
    if (xMarksReversed.length >= 3) {
      const equals15 = xMarksReversed[0] + xMarksReversed[1] + xMarksReversed[2] == 15;
      if (equals15) {
        confetti();
        notify('X');
        updateWinner('X');
      }
    }
    const yMarksReversed = yMarks.reverse();
    if (yMarksReversed.length >= 3) {
      const equals15 = yMarksReversed[0] + yMarksReversed[1] + yMarksReversed[2] == 15;
      if (equals15) {
        confetti()
        notify('O');
        updateWinner('O');
      }
    }
  }, [db, gameId, notify, xMarks, yMarks])

  const handleMark = async (index: number, mark: string, count: number) => {
    if (mark !== '' && userSide === currentPlayer) {
      return;
    }

    if (currentPlayer == 'X') {
      setXMarks([...xMarks, count]);

    }

    if (currentPlayer == 'O') {
      setYMarks([...yMarks, count]);
    }

    const updatedBoardMarks = boardMarks;
    updatedBoardMarks[index] = {
      ...updatedBoardMarks[index],
      mark: currentPlayer
    }
    setBoardMarks(updatedBoardMarks);
    if (gameId !== null) {
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, {
        gameBoard: updatedBoardMarks
      })
    }
    if (gameId !== null) {
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, {
        currentTurn: currentPlayer == 'X' ? 'O' : 'X'
      })
    }
    currentPlayer == 'X' ? setCurrentPlayer('O') : setCurrentPlayer('X');
  }


  const handleNewGame = () => {
    setBoardMarks([...initMarks]);
    setCurrentPlayer('X');
  }

  return (
    <>
      <Toaster />
      <div className="mb-2">Tic Tac Toe</div>
      <div className="grid grid-rows-3 grid-cols-3">
        {
          boardMarks.map((mark, index) => {
            if (mark.index === index + 1) {
              return <div key={index} className="hover:cursor-pointer border h-24 w-24 flex justify-center items-center"
                onClick={() => handleMark(index, mark.mark, mark.count)}
              >{mark.mark}</div>
            }
          }
          )
        }
      </div>
      <div className="flex justify-center items-center space-x-4">
        <button onClick={handleNewGame} className="mt-4">
          New Game
        </button>
      </div >
    </>
  )
}

export default TicTacToe
