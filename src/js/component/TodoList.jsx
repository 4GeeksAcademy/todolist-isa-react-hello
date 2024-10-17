import React, { useEffect, useState } from "react";

const List = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        console.log("Cargando componente...");
        initializeList();
    }, []);

    async function initializeList() {
        let resp = await fetch("https://playground.4geeks.com/todo/users/Sousan", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (resp.status === 404) {
            await fetch("https://playground.4geeks.com/todo/users/Sousan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }
        if (resp.status === 200) {
            let data = await resp.json();
            console.log({ data });
            setTodos(data.todos);
        }
    }

    const addArray = async (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            const newItem = { label: inputValue };

            try {
                const response = await fetch("https://playground.4geeks.com/todo/todos/Sousan", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newItem),
                });
                if (response.ok) {
                    const data = await response.json();
                    setTodos([...todos, data]);
                    setInputValue("");
                } else {
                    console.error("Error al agregar el item:", response.statusText);
                }
            } catch (error) {
                console.error("Error en la conexión:", error);
            }
        }
    };

    const deleteItem = async (id) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                setTodos(todos.filter(item => item.id !== id));
                console.log("Item eliminado:", id);
            } else {
                console.error("Error al borrar el item:", response.statusText);
            }
        } catch (error) {
            console.error("Error en la conexión:", error);
        }
    };

    return (
        
        <div className="container w-50 justify-content-center">
            <div className="title text-center" style={{ fontSize: '90px', fontFamily: 'Arial', color: 'blue', }}>Isa To-Do</div>
            <ul className="list-group border-none">
                <li className="list-group-item">
                    <input
                        type="text" 
                        value={inputValue} 
                        onKeyDown={addArray}
                        placeholder="What are you doing?..." 
                        style={{ width: '100%', }}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </li>
                {todos.map((item) => (
                    <li key={item.id} className="item list-group-item d-flex justify-content-between align-items-center">
                        {item.label}
                        <button className="btn btn-sm delete-button" onClick={() => deleteItem(item.id)}>
                            X
                        </button>
                    </li>
                ))}
                <li className="count list-group-item text-start">{todos.length} items left</li>
            </ul>
        </div>
    );
};

export default List;
