import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = { title, description, imageUrl };

        axios.post('/api/posts', newPost)
            .then(res => {
                console.log('Новая запись успешно добавлена:', res.data);
                setTitle('');
                setDescription('');
                setImageUrl('');
            })
            .catch(err => console.log('Ошибка при добавлении записи:', err));
    };

    return (
        <div className="centered-container">
            <h2>Добавить новую запись</h2>
            <form onSubmit={handleSubmit}>
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
    );
};

export default CreatePost;
