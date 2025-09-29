import React from 'react';
import { useParams } from 'react-router-dom';

function VideoPlayerPage() {
    const { filename } = useParams();

    return (
        <div>
            <h2>{filename}</h2>
            <video controls width="640" height="360">
                <source src={`/api/videos/stream/${filename}`} type="video/mp4" />
            </video>
        </div>
    );
}

export default VideoPlayerPage;