import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import { useStopwatch } from "react-timer-hook"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [best, setBest] = React.useState({leastRolls: 0, bestTime: 0})
    const {
        seconds,
        minutes,
        isRunning,
        start,
        pause,
        reset
    } = useStopwatch({ autoStart: false })
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])
    
    React.useEffect(() => {
        pause()
        // sync localStorage with state
        if(localStorage.getItem("bestGame")) {
            const currentBest = localStorage.getItem("bestGame")
            setBest(JSON.parse(currentBest))
            if(tenzies) {
                if(best.leastRolls === "N/A" && best.bestTime === "N/A") {
                    const tempBest = {leastRolls: rolls, bestTime: minutes * 60 + seconds}
                    setBest(tempBest)
                    localStorage.setItem("bestGame", JSON.stringify(tempBest))
                } else {
                    const leastRolls = rolls < best.leastRolls ? rolls : best.leastRolls
                    const bestTime = minutes * 60 + seconds < best.bestTime ? minutes * 60 + seconds : best.bestTime
                    setBest({leastRolls: leastRolls, bestTime, bestTime})
                    localStorage.setItem("bestGame", JSON.stringify({leastRolls: leastRolls, bestTime, bestTime}))
                }
            }
        } else {
            localStorage.setItem("bestGame", JSON.stringify({leastRolls: "N/A", bestTime: "N/A"}))
            setBest(JSON.parse(localStorage.getItem("bestGame")))
        }
    }, [tenzies])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            if(rolls === 0) {
                start()
            }
            setRolls(prevValue => prevValue + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            reset(0, false)
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => {
                if(!isRunning) start()
                holdDice(die.id)
            }}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div>
                <span>{minutes < 10 ? `0${minutes}` : minutes}</span>:<span>{seconds < 10 ? `0${seconds}` : seconds}</span>
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <p>Roll count: {rolls}</p>
            <p className="best">Least rolls: {best.leastRolls}</p>
            <p className="best">Best time: {best.bestTime / 60 < 10 ? `0${Math.floor(best.bestTime / 60)}` : best.bestTime / 60}:{best.bestTime % 60 < 10 ? `0${Math.floor(best.bestTime % 60)}` : best.bestTime % 60}</p>
        </main>
    )
}