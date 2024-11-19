import React from "react";
import Header from "../Components/Header";
import MapComponent from "../Components/MapComponent";

const Calculate = () => {
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title');

    console.log(title);
    return (
        <div>
            <Header />
            <div className="plan-list">
                <div className="plan-item">
                    <h3 className="plan-name">{title}</h3>
                </div>
                
            </div>
        </div>
    )
};

export default Calculate;
