import React from "react"
import Dot from "./Dot"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    const dotElements = []
    for(let i = 0; i < props.value; i++) {
        const nthDot = i === 0 ? "first" 
        : i === 1 ? "second"
        : i === 2 ? "third"
        : i === 3 ? "fourth"
        : i === 4 ? "fifth" : "sixth"
        dotElements.push(<Dot class={nthDot} />)
    }

    const numberClass = props.value === 6 ? "six" 
                        : props.value === 5 ? "five"
                        : props.value === 4 ? "four"
                        : props.value === 3 ? "three"
                        : props.value === 2 ? "two" : "one"

    return (
        <div 
            className={`die-face ${numberClass}`}
            style={styles}
            onClick={props.holdDice}
        >
            {dotElements}
        </div>
    )
}