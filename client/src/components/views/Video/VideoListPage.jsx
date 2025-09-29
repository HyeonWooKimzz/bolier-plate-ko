import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function VideoListPage() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get('/api/videos').then(res => setVideos(res.data));
    }, []);

    return (
        <div>
            <h2>영상 목록</h2>
            <ul>
                {videos.map((video, idx) => (
                    <li key={idx}>
                        <Link to={`/videos/${video}`}>{video}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VideoListPage;