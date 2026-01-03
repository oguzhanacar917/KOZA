import React, { useState, useRef } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import './GalaxyFileUploader.css';

const GalaxyFileUploader = ({ onFileSelect, accept = "image/*" }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        setFile(selectedFile);
        onFileSelect && onFileSelect(selectedFile);
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
        onFileSelect && onFileSelect(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div
            className={`galaxy-uploader ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept={accept}
            />

            {!file ? (
                <>
                    <div className="galaxy-uploader-icon">
                        <UploadCloud size={32} />
                    </div>
                    <p className="galaxy-uploader-text">Click or drop file to upload</p>
                    <p className="galaxy-uploader-subtext">Supports JPG, PNG, PDF</p>
                </>
            ) : (
                <div className="galaxy-file-preview animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                        <File size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{file.name}</p>
                        <p className="text-xs text-neutral-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                        onClick={removeFile}
                        className="p-1 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default GalaxyFileUploader;
