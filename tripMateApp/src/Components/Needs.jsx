// 준비물 컴포넌트
import React, { useState } from "react";
import Draggable from "react-draggable";
import Button from "./Button";

const Needs = () => {
    const [isNeedsOpen, setIsNeedsOpen] = useState(false);

    // 창 열기 함수
    const handleOpenClick = () => {
        setIsNeedsOpen(true);
    };

    // 창 닫기 함수
    const handleCloseClick = () => {
        setIsNeedsOpen(false);
    };

    return (
        <Draggable>
            
        </Draggable>
    )
}