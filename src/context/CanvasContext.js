import React, { useContext, useRef, useState } from "react";

const CanvasContext = React.createContext();
const backend = "http://localhost:5000";

export const CanvasProvider = ({ children }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [activeColor, setActiveColor] = useState("black");
    const [activeSize, setActiveSize] = useState(8);
    const [activeTool, setActiveTool] = useState("pencil");
    const [startDim, setStartDim] = useState({ x: "", y: "" });
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const prepareCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.width = window.innerWidth - 100;
        canvas.height = window.innerHeight - 110;

        if (window.innerWidth < 700) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 89;
        }
        context.lineCap = "round";
        contextRef.current = context;
    };

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        setStartDim({ x: offsetX, y: offsetY });
        contextRef.current.beginPath();
        if (activeTool === "pencil" || activeTool === "line") {
            contextRef.current.moveTo(offsetX, offsetY);
        }
        setIsDrawing(true);
    };

    const save = async () => {
        const image = canvasRef.current.toDataURL("image/png");
        if (!localStorage.getItem("editImg")) {
            try {
                localStorage.setItem("editImg", image);
                let url = backend + "/paintings/new";
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token')
                    },
                    body: JSON.stringify({ "image": image })
                });
                const data = await response.json();
                localStorage.setItem("editId", data._id);
            } catch (error) {
                let tempId = Math.random();
                localStorage.setItem("editImg", image);
                localStorage.setItem("editId", tempId);
                let newPaintings = JSON.parse(localStorage.getItem("newPaintings"));
                if (!newPaintings) {
                    newPaintings = [];
                }
                newPaintings.push({ "_id": tempId, "image": image });
                localStorage.setItem("newPaintings", JSON.stringify(newPaintings));
            }
        } else {
            try {
                localStorage.setItem("editImg", image);
                let url = backend + `/paintings/edit/${localStorage.getItem("editId")}`;
                await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token')
                    },
                    body: JSON.stringify({ "image": image })
                });
            } catch (error) {
                let allPaintings = JSON.parse(localStorage.getItem("allPaintings"));
                for (let i = 0; i < allPaintings.length; i++) {
                    if (allPaintings[i]._id === localStorage.getItem("editId")) {
                        allPaintings[i].image = image;
                        localStorage.setItem("allPaintings", JSON.stringify(allPaintings));
                        return;
                    }
                }
                let newPaintings = JSON.parse(localStorage.getItem("newPaintings"));
                for (let i = 0; i < newPaintings.length; i++) {
                    if (newPaintings[i]._id === localStorage.getItem("editId")) {
                        newPaintings[i].image = image;
                        localStorage.setItem("newPaintings", JSON.stringify(newPaintings));
                    }
                }

            }
        }
    }

    const finishDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        switch (activeTool) {
            case "line":
                contextRef.current.lineTo(offsetX, offsetY);
                contextRef.current.stroke();
                break;
            case "rectangle":
                contextRef.current.strokeRect(startDim.x, startDim.y, offsetX - startDim.x, offsetY - startDim.y);
                break;
            case "circle":
                contextRef.current.arc((offsetX + startDim.x) / 2, (offsetY + startDim.y) / 2, Math.abs((offsetX - startDim.x) / 2), 0, 2 * Math.PI);
                contextRef.current.stroke();
                break;
            default:
                break;
        }

        setIsDrawing(false);
        save();
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        contextRef.current.strokeStyle = activeColor;
        contextRef.current.lineWidth = activeSize;
        if (activeTool === "pencil") {
            const { offsetX, offsetY } = nativeEvent;
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d")
        context.fillStyle = "#E8E8E9"
        context.fillRect(0, 0, canvas.width, canvas.height)
        save();
    }

    return (
        <CanvasContext.Provider
            value={{
                canvasRef,
                contextRef,
                prepareCanvas,
                startDrawing,
                finishDrawing,
                clearCanvas,
                draw,
                activeColor,
                setActiveColor,
                setActiveSize,
                activeSize,
                setActiveTool,
                save
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => useContext(CanvasContext);