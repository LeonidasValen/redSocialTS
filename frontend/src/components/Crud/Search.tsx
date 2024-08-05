import { Dispatch, SetStateAction, useEffect } from "react";
import { useAdmin } from "../../context/adminContent";
import { useDebounce } from "../../hooks/useDebouce";  // Asegúrate de ajustar la ruta según tu estructura de carpetas

interface Searching{
    limit: number; 
    search: string; 
    setSearch: Dispatch<SetStateAction<string>>; 
    setPage: Dispatch<SetStateAction<number>>;
}

export function Search({limit, search, setSearch, setPage }: Searching) {

    const debouncedSearch = useDebounce(search, 600);  // Ajusta el retraso según sea necesario
    const { getAllUsers } = useAdmin();

    useEffect(() => {
        const handleSearch = async (values: string) => {
            try {
                setPage(1);//restablece la pagina uno cuando empieza a buscar
                if (values.trim() === '') {
                    // Si el valor de busqueda esta vacio traer todos los usuarios
                    await getAllUsers('', 1, limit);
                } else {
                    await getAllUsers(values, 1, limit);
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (debouncedSearch || debouncedSearch === '') {
            handleSearch(debouncedSearch);
        }
    }, [debouncedSearch, limit]);

    return (
        <header className="header-content">
            <div className="search-container">
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>
                </button>
                <input
                    type="text"
                    placeholder="Search for name or id..."
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
        </header>
    );
}
