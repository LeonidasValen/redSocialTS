import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from '../../../hooks/useDebouce'
import { IconSearch } from '../../../../public/icons/icons' 
import { searchUsers } from '../../../api/user' 
import { Link } from 'react-router-dom'
import './Search.css'

export interface User {
    id: number;
    photo: string | null;
    username: string;
}

export function Search() {
    const [search, setSearch] = useState('');
    const [userResult, setUserResult] = useState<User[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    const handleSearch = useCallback(async (values: string) => {
        try {
            const res = await searchUsers(values.trim());
            setUserResult(res.data.users);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if ((debouncedSearch || debouncedSearch === '') && isFocused) {
            handleSearch(debouncedSearch);
        }
    }, [debouncedSearch, isFocused, handleSearch]);

    const handleBlur = () => {
        // Agrega un pequeño retraso antes de cambiar el estado de isFocused
        //setTimeout(() => setIsFocused(false), 200);
    };

    return (
        <div className='Hsearch'>
            <div className="HsearchContent">
                <button>
                    <IconSearch />
                </button>
                <input
                    type="text"
                    placeholder="Buscador"
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                />
            </div>
            {
                userResult && isFocused &&
                <div className="searchResult">
                    <ul className='SRContent'>
                        {userResult.length > 0
                            ? (userResult.map((user) => (
                                <li key={`userSearch${user.id}`}>
                                    <Link to={`/profile/${user.id}`} onClick={handleBlur}>
                                        {user?.photo
                                            ? <img src={`/./img/${user?.photo}`} alt="" />
                                            : <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png" alt="" />
                                        }
                                        <span>{user.username}</span>
                                    </Link>
                                </li>)
                            ))
                            : (<li>No hubo coincidencias</li>)
                        }
                    </ul>
                </div>
            }
        </div>
    );
}
