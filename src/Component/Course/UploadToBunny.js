import React, { useState } from 'react';
import axios from 'axios';

const UploadToBunny = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert('Please select a file first.');

        const accessKey = '68f52585-3890-4bda-806e3908c1e5-1216-468b';
        const storageZoneName = 'basementexcourses';
        const region = 'sg';
        const remoteFilePath = file.name;
        console.log(remoteFilePath);
        const url = `https://storage.bunnycdn.com/${storageZoneName}/newStore/${remoteFilePath}`;

        try {
            const response = await axios.put(url, file, {
                headers: {
                    AccessKey: accessKey,
                    'Content-Type': 'application/octet-stream',
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                },
            });

            console.log('Upload successful!', response);
            console.log('Upload successful!', response.status);
            alert('Upload successful!');
        } catch (error) {
            console.error('Upload failed:', error.response ? error.response.data : error.message);
            alert('Upload failed. See console for details.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div className="col-lg-6 mb-4">
                <label htmlFor="path" className="form-label">
                    Video Path
                </label>
                <input
                    type="file"
                    className="form-control"
                    name="file"
                    placeholder="Enter Video Path"
                    onChange={handleFileChange}
                    accept="video/*"
                />
            </div>

            <div className="col-lg-12 text-center">
                <button
                    type="submit"
                    onClick={handleUpload}
                    className="btn btn-for-add text-white"
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            {uploading && (
                <div style={{ marginTop: '20px' }}>
                    <progress value={progress} max="100" style={{ width: '100%' }} />
                    <p>{progress}%</p>
                </div>
            )}
        </>

    );
};

export default UploadToBunny;
