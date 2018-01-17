import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";


const Index = () => {
    return (
        <div className="Index">
            <h1>Website Usability Study</h1>
        </div>
    )
}

const reactEntry = document.createElement("div");
ReactDOM.render(<Index />, reactEntry);
document.body.appendChild(reactEntry)
