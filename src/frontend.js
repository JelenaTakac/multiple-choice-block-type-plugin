import React from "react";
import ReactDOM from "react-dom";
import "./frontend.scss";


const divsToUpdate = document.querySelectorAll(".paying-attention-update-me");

divsToUpdate.forEach(div => {
   const data = JSON.parse(document.querySelector("pre").innerHTML); 
   ReactDOM.render(<Quiz {...data} />, div);
   div.classList.remove("paying-attention-update-me");
});

function Quiz(props) {
    return (
        <div className="paying-attention-frontend">
            <p>{props.question}</p>
            <ul>
                {props.answers.map((answer) => {
                    return (
                        <li>{answer}</li>
                    )
                })}
            </ul>
        </div>

    )
}