import { User } from '../../context/adminContent';
import { IconArrows, IconDeleted, IconEdit } from '../../../public/icons/icons';
import moment from 'moment'
import 'moment/locale/es';
import './table.css'

moment.locale('es');

interface TableProps {
    users: User[];
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
}

export function Table({ users, handleEdit, handleDelete }: TableProps) {

    return (
        <div className="contain-table">
            <table>
                <thead>
                    <tr>
                        <th>Id
                            <IconArrows/>
                        </th>
                        <th>Photo
                        <IconArrows/>
                        </th>
                        <th>Username
                            <IconArrows />
                        </th>
                        <th>Email
                            <IconArrows />
                        </th>
                        <th>Rol
                            <IconArrows />
                        </th>
                        <th>F-Creacion
                            <IconArrows />
                        </th>
                        <th colSpan={2} className="actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                {user.photo
                                    ? <td><img src={`./img/${user.photo}`} alt="" className='userProfile' /></td>
                                    : <td><img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png" alt="" className='userProfile' /></td>
                                }
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.rol}</td>
                                <td>{moment(user.f_creation).locale('es').format('DD-MM-YYYY HH:mm:ss')}</td>
                                <td className="action-trash">
                                    <button onClick={() => handleDelete(user.id)}>
                                        <IconDeleted />
                                    </button>
                                </td>
                                <td className="action-edit">
                                    <button onClick={() => handleEdit(user.id)}>
                                        <IconEdit />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8}>No Users</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}