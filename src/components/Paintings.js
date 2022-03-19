import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const backend = "http://localhost:5000";

const Paintings = () => {
    const navigate = useNavigate();
    const [paintings, setPaintings] = useState([]);
    const [newPaintings, setNewPaintings] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }
        if (localStorage.getItem("newPaintings")) {
            setNewPaintings(JSON.parse(localStorage.getItem("newPaintings")));
        }
        deletePendingPaintings();
        addPendingPaintings();
        fetchPaintings();
        // eslint-disable-next-line
    }, [])

    const addNewPaintings = async (image) => {
        let newUrl = backend + "/paintings/new";
        await fetch(newUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ "image": image })
        });
    }

    const addPendingPaintings = () => {
        if (localStorage.getItem("newPaintings")) {
            let newPaintings = JSON.parse(localStorage.getItem("newPaintings"))
            newPaintings.forEach(element => {
                addNewPaintings(element.image);
            });
        }
        setNewPaintings(null);
    }

    const deletePendingPaintings = () => {
        if (localStorage.getItem("paintingsToBeDeleted")) {
            let paintingsToBeDeleted = JSON.parse(localStorage.getItem("paintingsToBeDeleted"));
            paintingsToBeDeleted.forEach((element) => {
                deletePainting(element);
            });
        }
        localStorage.removeItem("paintingsToBeDeleted");
    }

    const fetchPaintings = async () => {
        try {

            let allUrl = backend + "/paintings/all";
            const response = await fetch(allUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
            });
            const data = await response.json();
            setPaintings(data.allPaintings);
            localStorage.setItem("allPaintings", JSON.stringify(data.allPaintings));
            localStorage.removeItem("newPaintings");
        } catch (error) {
            setPaintings(JSON.parse(localStorage.getItem("allPaintings")));
            setNewPaintings(JSON.parse(localStorage.getItem("newPaintings")));
        }
    }

    const signOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("allPaintings");
        navigate('/login');
    }

    const deletePainting = async (id) => {
        let url = backend + `/paintings/delete/${id}`;
        try {
            await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
            });
            fetchPaintings();
        } catch (error) {
            let allPaintings = JSON.parse(localStorage.getItem("allPaintings"));
            let paintingsToBeDeleted = JSON.parse(localStorage.getItem("paintingsToBeDeleted"));
            let newPaintings = JSON.parse(localStorage.getItem("newPaintings"));
            if (newPaintings) {
                newPaintings = newPaintings.filter((painting) => painting._id !== id);
                localStorage.setItem("newPaintings", JSON.stringify(newPaintings));
                setNewPaintings(newPaintings);
            }
            if (!paintingsToBeDeleted) {
                paintingsToBeDeleted = [];
            }
            if (id > 1) {
                paintingsToBeDeleted.push(id);
            }
            localStorage.setItem("paintingsToBeDeleted", JSON.stringify(paintingsToBeDeleted));
            allPaintings = allPaintings.filter((painting) => painting._id !== id);
            localStorage.setItem("allPaintings", JSON.stringify(allPaintings));
            setPaintings(JSON.parse(localStorage.getItem("allPaintings")));
        }
    }

    const download = (img) => {
        const a = document.createElement('a');
        a.href = img;
        a.download = "image.png";
        a.click();
    }

    const editPainting = (id, img) => {
        localStorage.setItem("editImg", img);
        localStorage.setItem("editId", id);
        navigate('/paint');
    }

    return (
        <PaintingsContainer>
            <PaintingsHeader>
                <button id="user-intro">Welcome Back {localStorage.getItem('name')}!</button>
                <button className="cta-btn" onClick={signOut}>Sign Out</button>
            </PaintingsHeader>
            <PaintingsGrid>
                <NewPaintingCard>
                    <Link to="/paint">
                        <i className="fa-solid fa-plus"></i>
                    </Link>
                </NewPaintingCard>
                {paintings &&
                    paintings.map((painting) => {
                        return (
                            <PaintingCard key={painting._id}>
                                <img src={painting.image} alt="" />
                                <OptionOverlay>
                                    <i className="fa-solid fa-pen-to-square" onClick={() => editPainting(painting._id, painting.image)}></i>
                                    <i className="fa-solid fa-download" onClick={() => download(painting.image)}></i>
                                    <i className="fa-solid fa-trash-can" onClick={() => deletePainting(painting._id)}></i>
                                </OptionOverlay>
                            </PaintingCard>
                        )
                    })
                }

                {newPaintings && newPaintings.map((painting) => {
                    return (
                        <PaintingCard key={painting._id}>
                            <img src={painting.image} alt="" />
                            <OptionOverlay>
                                <i className="fa-solid fa-pen-to-square" onClick={() => editPainting(painting._id, painting.image)}></i>
                                <i className="fa-solid fa-download" onClick={() => download(painting.image)}></i>
                                <i className="fa-solid fa-trash-can" onClick={() => deletePainting(painting._id)}></i>
                            </OptionOverlay>
                        </PaintingCard>
                    )
                })}
            </PaintingsGrid>
        </PaintingsContainer>
    )
}

export default Paintings;

const PaintingsContainer = styled.div`
    padding: 2.5rem;
    background: var(--bg-dark);
    min-height: 100vh;
`;

const PaintingsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items : center;
    margin-bottom: 2rem;

    >#user-intro {
        background-color: transparent;
        color: var(--text-bright);
        border: none;
        outline: none;
        font-size: 1.5rem;

        
        @media screen and (max-width : 800px){
            font-size: 1rem;
        }
    }
`;

const PaintingsGrid = styled.div`
    display: grid;
    grid-gap: 2rem;
    grid-template-columns: repeat(4, 1fr);

    @media screen and (max-width : 1400px){
        grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width : 1200px){
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width : 800px){
        grid-template-columns: repeat(1, 1fr);
    }

`;

const NewPaintingCard = styled.div`
    background-color: var(--bg-light);
    height: 30rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1rem;

    @media screen and (max-width : 800px){
        height: 20rem;
    }

    >a {
        font-size: 2rem;
        padding: 3rem 3.5rem;
        color: var(--text-bright);
        background-color: var(--primary);
        border-radius: 0.5rem;
        cursor: pointer;
    }
`

const PaintingCard = styled.div`
    height: 30rem;
    position: relative;
    display: flex;
    justify-content: center;
    border-radius: 1rem;
    background-color: #E8E8E9;

    @media screen and (max-width : 800px){
        height: 20rem;
    }
    
    >img {
        height: 100%;
        width: 100%;
        border-radius: 0.5rem;
        object-fit: contain;
    }
`;

const OptionOverlay = styled.div`
opacity: 0.9;
    position: absolute;
    bottom: 2rem;
    background-color: var(--bg-light);
    padding: 1.2rem 2rem;
    display: flex;
    justify-content: space-between;
    width: 50%;
    border-radius: 0.5rem;

    @media screen and (max-width : 800px){
        width: 70%;
    }

    >i {
        font-size: 1.5rem;
        color: var(--primary);
        cursor: pointer;
    }

    >i:hover{
        color: var(--text-bright);
    }
`

