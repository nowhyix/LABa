import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'; // Импорт внешнего CSS-файла

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [showModal, setShowModal] = useState(false); // Новое состояние для модального окна
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [fullscreenImage, setFullscreenImage] = useState(null); // Состояние для полноэкранного изображения

    useEffect(() => {
        axios.get('/api/posts')
            .then(res => setPosts(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleLike = (postId) => {
        axios.post(`/api/posts/${postId}/like`)
            .then(res => {
                const updatedPosts = posts.map(post => {
                    if (post._id === postId) {
                        return { ...post, rating: res.data.rating };
                    }
                    return post;
                });
                setPosts(updatedPosts);
            })
            .catch(err => console.log(err));
    };

    const handleComment = (postId) => {
        axios.post(`/api/posts/${postId}/comments`, { text: commentText })
            .then(res => {
                const updatedPosts = posts.map(post => {
                    if (post._id === postId) {
                        return { ...post, comments: res.data.comments };
                    }
                    return post;
                });
                setPosts(updatedPosts);
                setCommentText(''); // Очищаем поле комментария после отправки
            })
            .catch(err => console.log(err));
    };

    const handleCreatePost = (e) => {
        e.preventDefault();
        const newPost = { title, description, imageUrl };

        axios.post('/api/posts', newPost)
            .then(res => {
                setPosts([...posts, res.data]);
                setShowModal(false); // Закрываем модальное окно после успешного добавления
                setTitle('');
                setDescription('');
                setImageUrl('');
            })
            .catch(err => console.log('Ошибка при добавлении записи:', err));
    };

    const openFullscreen = (image) => {
        setFullscreenImage(image);
    };

    const closeFullscreen = () => {
        setFullscreenImage(null);
    };

    return (
        <div className="centered-container">
            <h1 className="page-title">Поделись своей вышивкой!</h1>
            <button onClick={() => setShowModal(true)} className="create-post-button">Добавить новую запись</button>
            {posts.map(post => (
                <div key={post._id} className="post-container">
                    <h2>{post.title}</h2>
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="post-image"
                        onClick={() => openFullscreen(post.imageUrl)}
                    />
                    <p>{post.description}</p>
                    <p>Rating: {post.rating}</p>
                    <button onClick={() => handleLike(post._id)}>Лайк</button>
                    <h3>Comments:</h3>
                    <ul>
                        {post.comments.map((comment, index) => (
                            <li key={index}>{`${comment.user}: ${comment.text}`}</li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        placeholder="Ваш комментарий"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button onClick={() => handleComment(post._id)}>Комментировать</button>
                </div>
            ))}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Добавить новую запись</h2>
                        <form onSubmit={handleCreatePost} className="form-container">
                            <input
                                type="text"
                                placeholder="Название записи"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Описание"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="URL изображения"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                            <button type="submit">Добавить запись</button>
                        </form>
                    </div>
                </div>
            )}

            {fullscreenImage && (
                <div className="fullscreen-modal" onClick={closeFullscreen}>
                    <span className="fullscreen-close" onClick={closeFullscreen}>&times;</span>
                    <img src={fullscreenImage} alt="Fullscreen" />
                </div>
            )}
        </div>
    );
};

export default PostList;
