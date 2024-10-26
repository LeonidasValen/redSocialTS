import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconComment, IconLike, IconOptions, IconReshare, IconShare, IconLiked } from '../../../../public/icons/icons'
import { usePost } from '../../../context/postContext'
import { useAuth } from '../../../context/authContext'
import moment from 'moment'
import 'moment/locale/es'
import './posts.css'

moment.locale('es');

interface Post {
    postId: number;
    userId: number;
    userPhoto: string;
    username: string;
    creationAt: string;
    desc: string;
    images: string[];
    hasLiked: boolean;
    likeCount: number;
}

interface LikeCounts {
    [key: number]: {
        hasLiked: boolean;
        likeCount: number;
    };
}

export function Posts() {

    const { posts, saveLike, removeLike, loading } = usePost()

    const { isAuthenticated, user } = useAuth()

    const navigate = useNavigate()

    const [LikeCounts, setLikeCounts] = useState<LikeCounts>({});

    useEffect(() => {
        const updatedPostStates: LikeCounts = {};
        posts.forEach(post => {
            updatedPostStates[post.postId] = {
                hasLiked: post.hasLiked,
                likeCount: post.likeCount,
            };
        });
        setLikeCounts(updatedPostStates);
    }, [posts]);

    const handleLike = async (postId: number) => {
        if (!isAuthenticated && !user) {
            navigate('/login')
            return;
        }
        try {
            await saveLike(postId)
            //cambia el estado del like
            setLikeCounts(prev => ({
                ...prev,
                [postId]: {
                    hasLiked: true,
                    likeCount: (prev[postId]?.likeCount || 0) + 1
                }
            }));
        } catch (error) {
            console.error("error al dar like al post")
        }
    }

    const handleDisLike = async (postId: number) => {
        if (!isAuthenticated && !user) {
            navigate('/login')
            return;
        }
        try {
            await removeLike(postId)
            //cambia el estado del like
            setLikeCounts(prev => ({
                ...prev,
                [postId]: {
                    hasLiked: false,
                    likeCount: Math.max((prev[postId]?.likeCount || 0) - 1, 0)
                }
            }));
        } catch (error) {
            console.error("error al sacar el like al post")
        }
    }

    if (loading) {
        return <div>...loading</div>
    }

    return (
        <section className='post'>
            {posts.length > 0
                ? (
                    posts.map((post: Post) => (
                        <div className='postConetent' key={post.postId}>
                            <div className="pProfile">
                                <Link to={`/profile/${post.userId}`}>
                                    {post?.userPhoto
                                        ? <img src={`/./img/${post.userPhoto}`} alt="" />
                                        : <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png" alt="" />
                                    }
                                </Link>
                            </div>
                            <div className='pContent'>
                                <div className="pHeader">
                                    <div className="pUser">
                                        <Link to={`/profile/${post.userId}`}><span>{post.username} </span></Link>
                                        <p>• {moment(post.creationAt).locale('es').fromNow()}</p>
                                    </div>
                                    <button className='pOptions'>
                                        <IconOptions />
                                    </button>
                                </div>
                                <p className='pDesc'>{post.desc}</p>
                                {post.images.length > 0 &&
                                    <div className={`pcImg ${post.images.length > 1 && ('colum')}`} >
                                        {post.images.map((img, index) => (
                                            <img src={`/./imgPost/${img}`} alt={`pImg ${index + 1}`} key={`pImg ${index}`} />
                                        ))}
                                    </div>
                                }
                                <div className="pButtons">
                                    <button
                                        className={`bHeart ${LikeCounts[post.postId]?.hasLiked ? 'liked' : ''}`}
                                        onClick={LikeCounts[post.postId]?.hasLiked
                                            ? () => handleDisLike(post.postId)
                                            : () => handleLike(post.postId)}
                                    >
                                        {LikeCounts[post.postId]?.hasLiked
                                            ? <IconLiked />
                                            : <IconLike />
                                        }
                                        {LikeCounts[post.postId]?.likeCount || 0}
                                    </button>

                                    <button className='bComment'>
                                        <IconComment />
                                        200
                                    </button>
                                    <button className='bReshare'>
                                        <IconReshare />
                                    </button>
                                    <button className='bShare'>
                                        <IconShare />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                    )
                )
                : (
                    <h1>ningun posts</h1>
                )
            }
        </section>
    )
}
