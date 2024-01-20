import { useState } from 'react';
import './App.css'
import TicTacToe from './TicTacToe'
import { addDoc, collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from './main';

function App() {
  const db = getFirestore(app);
  const [gameIsStarted, setgameIsStarted] = useState(false);
  const [gameInfo, setGameInfo] = useState<Record<string, string | null> | null>(null);
  const [invitationCode, setInvitationCode] = useState('');
  const [userType, setuserType] = useState<'guest' | 'creator'>('guest');

  const handleNewGame = async () => {
    const side = (Math.random() * 1000) % 2 == 0 ? 'X' : "O";
    try {
      const docRef = await addDoc(collection(db, "games"), {
        currentTurn: 'X',
        gameCreator: side,
        winner: null,
        gameBoard: [
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
        ]
      });
      console.log("Document written with ID: ", docRef.id);
      setGameInfo({ gameId: docRef.id, side: side });
      setuserType('creator');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  return (
    <>
      <div className='flex flex-col space-y-8'>
        {
          !gameIsStarted &&
          <>
            <button onClick={async () => {
              setgameIsStarted(true);
              await handleNewGame();
            }}>Start Game!</button>
            <p>or</p>
            <div className='flex space-x-2'>
              <input
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                className='py-2 px-4 rounded-md'
                placeholder='Enter invitation code...'
              />
              <button
                onClick={async () => {
                  if (invitationCode == '') {
                    return;
                  }

                  const docRef = doc(db, "games", invitationCode);
                  const docSnap = await getDoc(docRef);

                  if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                    const data = docSnap.data();
                    setGameInfo({ gameId: docSnap.id, side: data.side == 'X' ? 'O' : 'X', currentTurn: data.currentTurn });
                    setuserType('guest');
                    setgameIsStarted(true);
                  } else {
                    console.log("No such document!");
                  }
                }}
              >
                Enter
              </button>
            </div>
          </>
        }
        {gameIsStarted && <div>
          {
            userType == 'creator' && gameInfo &&
            <div className='flex flex-col justify-start items-start'>
              <p>Invitation code: <span className='text-yellow-200'>{gameInfo.gameId}</span></p>
              <p className='mb-8'>Side: <span className='text-yellow-200'>{gameInfo.side}</span></p>
            </div>
          }
          <TicTacToe gameId={gameInfo?.gameId ?? null} db={db} userSide={gameInfo?.side ?? null} /></div>}
      </div>
    </>
  )
}

export default App
