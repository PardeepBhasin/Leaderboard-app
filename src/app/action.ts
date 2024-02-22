'use server';

export type PlayerProps = {
    playerId: number;
    playerName: string;
    score: number;
    createdOn: string;
}

export async function addPlayerAction(playerInfo: PlayerProps) {
    const response = await fetch('http://localhost:4000/addPlayer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerInfo)
    });
    const data = await response.json();
    return data;
}

export async function processDataAction(payload: any) {
    const response = await fetch('http://localhost:4000/processData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    return data;
}