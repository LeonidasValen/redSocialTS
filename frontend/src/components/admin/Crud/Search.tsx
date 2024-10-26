import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useDebounce } from "../../../hooks/useDebouce";
import { useAdmin } from "../../../context/adminContent";
import { IconSearch } from "../../../../public/icons/icons";


interface Searching{
    limit: number; 
    search: string; 
    setSearch: Dispatch<SetStateAction<string>>; 
    setPage: Dispatch<SetStateAction<number>>;
}

export function Search({limit, search, setSearch, setPage }: Searching) {

    const debouncedSearch = useDebounce(search, 600);  // Ajusta el retraso según sea necesario
    const { getAllUsers } = useAdmin();

    const handleSearch = useCallback( async (values: string) => {
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
    }, []);

    useEffect(() => {
        if (debouncedSearch || debouncedSearch === '') {
            handleSearch(debouncedSearch);
        }
    }, [debouncedSearch, handleSearch, limit]);

    return (
        <header className="header-content">
            <div className="search-container">
                <button>
                    <IconSearch/>
                </button>
                <input
                    type="text"
                    placeholder="Buscar por nombre o id..."
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
        </header>
    );
}
