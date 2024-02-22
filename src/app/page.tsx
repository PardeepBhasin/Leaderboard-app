'use client';

import { useState, useEffect } from "react";
import { PlayerProps, addPlayerAction, processDataAction } from "./action";
import { io } from "socket.io-client";

const socket = io('http://localhost:5000');
export default function Home() {
  const [playerInfo, setPlayerInfo] = useState<PlayerProps[]>();
  const addPlayer = async () => {
    const number = Math.round(Math.random() * 100);
    const payload = {
      playerId: number,
      playerName: `Gamer ${number}`,
      score: 0,
      createdOn: new Date().toISOString()
    }
    await addPlayerAction(payload);
    setPlayerInfo([...playerInfo || [], payload]);
  }

  const processData = async (player: PlayerProps) => {
    const payload = {
      playerId: player.playerId,
      score: Math.round(Math.random() * 100)
    }
    const { data } = await processDataAction(payload);
    if (data) {
      setPlayerInfo([...playerInfo || [], data]);
    }
  }
  useEffect(() => {
    if (!playerInfo) {
      return;
    }
    socket.on('player-event', (player) => {
      const { playerId, score } = player;
      for (let i = 0; i < playerInfo.length; i++) {
        if (playerInfo[i].playerId === playerId) {
          playerInfo[i].score = score;
        }
      }
      const element = document.getElementById(playerId);
      if (element) {
        setPlayerInfo([...playerInfo]);
        element.classList.add('highlight');
        setTimeout(() => {
          element.classList.remove('highlight');
        }, 1000)
      }
    })

  }, [playerInfo]);

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex bg-gradient-to-t from-gray-400 to-yellow-400 p-4 font-bold text-white">
        <h1>Real Time Leaderboard</h1>
      </div>
      <div className="p-4 flex flex-col gap-5">
        <button className="bg-red-500 p-3 font-bold text-white self-start" onClick={addPlayer}>Add Player</button>
        <div className="flex flex-col w-1/4">
          <div className="flex border-solid border-b-2 font-bold justify-between p-3">
            <div>Name</div>
            <div>Roll Dice</div>
          </div>
          {
            playerInfo && playerInfo.map((player, index) => (
              <div key={index} className="flex justify-between font-bold border-solid border-b-2 p-3">
                <div className="self-center">{player.playerName}</div>
                <button className="bg-red-500 p-3 font-bold text-white" onClick={() => processData(player)}>Play</button>
              </div>
            ))
          }
        </div>
      </div>
      <div className="p-4 flex flex-col gap-5">
        <div className="flex flex-col">
          <div className="flex border-solid border-b-2 font-bold justify-between p-3">
            <div className="basis-1/4">Player ID</div>
            <div className="basis-1/4">Player Name</div>
            <div className="basis-1/4">Score</div>
            <div className="basis-1/4">CreatedOn</div>
          </div>
          {
            playerInfo && playerInfo.map((player, index) => (
              <div key={index} className="flex justify-between font-bold border-solid border-b-2">
                <div className="basis-1/4 self-center p-3">{player.playerId}</div>
                <div className="basis-1/4 self-center p-3">{player.playerName}</div>
                <div id={player.playerId.toString()} className="basis-1/4 self-center p-3">{player.score}</div>
                <div className="basis-1/4 self-center p-3">{player.createdOn}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
