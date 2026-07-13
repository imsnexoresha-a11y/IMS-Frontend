import { useState, useRef, useCallback } from 'react';
import { Upload, X, File } from 'lucide-react';
import styles from './FileUpload.module.css';

export default function FileUpload({
  label,
  accept = '*',
  onFileSelect,
  maxSizeMB = 10,
  className = '',
  multiple = false,
}) {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (selectedFiles) => {
      if (!selectedFiles || selectedFiles.length === 0) return;
      
      const validFiles = [];
      for (const file of selectedFiles) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File "${file.name}" size must be under ${maxSizeMB}MB`);
        } else {
          validFiles.push(file);
        }
      }

      if (validFiles.length === 0) return;

      if (multiple) {
        const updated = [...files, ...validFiles];
        setFiles(updated);
        onFileSelect?.(updated);
      } else {
        const singleFile = validFiles[0];
        setFiles([singleFile]);
        onFileSelect?.(singleFile);
      }
    },
    [maxSizeMB, onFileSelect, multiple, files],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragActive(false);
      const droppedFiles = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
      handleFiles(droppedFiles);
    },
    [handleFiles],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleChange = (e) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(selectedFiles);
  };

  const removeFile = (indexToRemove) => {
    const updated = files.filter((_, idx) => idx !== indexToRemove);
    setFiles(updated);
    if (multiple) {
      onFileSelect?.(updated);
    } else {
      onFileSelect?.(null);
    }
    if (updated.length === 0 && inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={className}>
      {label && <div className={styles.label}>{label}</div>}
      <div
        className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <Upload size={24} className={styles.dropzoneIcon} />
        <span className={styles.dropzoneText}>
          {isDragActive ? 'Drop files here' : 'Click or drag files to upload'}
        </span>
        <span className={styles.dropzoneAccept}>
          Max {maxSizeMB}MB
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className={styles.hiddenInput}
        />
      </div>
      {files.map((file, index) => (
        <div key={index} className={styles.filePreview} style={{ marginTop: 'var(--space-xs)' }}>
          <File size={16} />
          <span className={styles.fileName}>{file.name}</span>
          <span className={styles.fileSize}>{formatSize(file.size)}</span>
          <button className={styles.removeFile} onClick={() => removeFile(index)} type="button">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
