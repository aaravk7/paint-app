import React, { useEffect } from "react";
import { useCanvas } from "../context/CanvasContext";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


const Paint = () => {
    const navigate = useNavigate();

    const {
        canvasRef,
        prepareCanvas,
        startDrawing,
        finishDrawing,
        draw,
        activeColor,
        setActiveColor,
        setActiveSize,
        activeSize,
        clearCanvas,
        setActiveTool,
        contextRef
    } = useCanvas();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate('/login');
            return;
        };
        prepareCanvas();

        if (localStorage.getItem("editImg")) {
            make_base();
        }

        window.addEventListener('resize', () => {
            prepareCanvas();
            if (localStorage.getItem("editImg")) {
                make_base();
            }
        })
        // eslint-disable-next-line
    }, []);


    const colors = ["black", "red", "green", "yellow", "blue"];
    const sizes = [5, 8, 12, 16, 20];

    const download = () => {
        const a = document.createElement('a');
        a.href = canvasRef.current.toDataURL("image/png");
        a.download = "image.png";
        a.click();
    }


    function make_base() {
        let base_image = new Image();
        base_image.src = localStorage.getItem('editImg');
        base_image.onload = function () {
            contextRef.current.drawImage(base_image, 0, 0);
        }
    }

    const goBack = () => {
        localStorage.removeItem('editImg');
        localStorage.removeItem('editId');
        navigate('/');
    }

    const signOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("allPaintings");
        navigate('/login');
    }

    const toggleColorPallete = (e) => {
        let colorPallete = document.getElementById("color-pallete");
        if (colorPallete.style.display === "flex") {
            colorPallete.style.display = "none"
        } else {
            colorPallete.style.display = "flex"
        }
    }

    return (
        <PaintContainer>
            <CanvasHeader>
                <button className="cta-btn" onClick={goBack}>Go back</button>
                <button className="cta-btn" onClick={signOut}>Sign Out</button>
            </CanvasHeader>
            <CanvasContainer>
                <CanvasOptions >
                    <i class="fa-solid fa-palette" style={{ color: activeColor }} onClick={toggleColorPallete}></i>
                    <div id="color-pallete">
                        {colors.map((color) => <div key={color} onClick={() => setActiveColor(color)} style={{ backgroundColor: color, height: "1rem", width: "1rem", borderRadius: "50%", cursor: "pointer" }}></div>)}
                    </div>
                    <i class="fa-solid fa-eraser" onClick={() => setActiveColor("#E8E8E9")}></i>
                    {sizes.map((size) => <div key={size} onClick={() => setActiveSize(size)} style={{ backgroundColor: `${size === activeSize ? activeColor : "white"}`, height: `${size}px`, width: `${size}px`, borderRadius: "50%", cursor: "pointer" }}></div>)}
                    <i onClick={() => setActiveTool("pencil")} className="fa-solid fa-pencil"></i>
                    <i onClick={() => setActiveTool("line")} >/</i>
                    <i className="fa-regular fa-square-full" onClick={() => setActiveTool("rectangle")} ></i>
                    <i className="fa-regular fa-circle" onClick={() => setActiveTool("circle")} ></i>
                    <i className="fa-solid fa-trash-can" onClick={clearCanvas}></i>
                    <i className="fa-solid fa-download" onClick={download}></i>
                </CanvasOptions>
                <canvas
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    ref={canvasRef}
                />
            </CanvasContainer>
        </PaintContainer>
    );
}

export default Paint;

const PaintContainer = styled.div`
    background-color: var(--bg-dark);
    height: 100vh;
    overflow: hidden;
`;

const CanvasHeader = styled.div`
    padding: 1.5rem 2.5rem;
    display: flex;
    justify-content: space-between;
`;

const CanvasContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    >canvas {
        background-color: #E8E8E9;
        width: calc(100vw - 100px);
        height: calc(100vh - 110px);

        @media screen and (max-width: 700px) {
            width: 100vw;
            height: calc(100vh - 89px);
        }
    }
`;

const CanvasOptions = styled.div`
    display: flex;
    position: absolute;
    top: 50%;
    left: 50px;
    flex-direction: column;
    align-items: center;
    background-color: var(--text-mute);
    padding: 0.5rem;
    transform: translateY(-50%);

    >i {
        color: var(--bg-dark);
        cursor: pointer;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
    }

    >div{
        margin-bottom: 1.5rem;
    }

    >#color-pallete {
        display: none;
        position: absolute;
        left: 3rem;
        top: 0;
        background-color: var(--text-mute);
        padding: 1rem;

        >div {
            margin-right: 0.5rem;
        }
    }

    @media screen and (max-width: 700px) {
        left: 0;

        >i {
            font-size: 1rem;
        }

        >div{
            margin-bottom: 1rem;
        }
    }
`;