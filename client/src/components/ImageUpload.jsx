import React, { useRef } from 'react';

const ImageUpload = ({ image, onImageSelect }) => {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSelect = (e) => {
    if (e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-xl w-full h-64 p-4 cursor-pointer"
      onClick={() => inputRef.current.click()}
    >
      {
        image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Selected"
            className="max-w-full max-h-full rounded-lg mb-2"
          />
        )
      }
      <input
          type="file"
          ref={inputRef}
          hidden
          accept="image/*"
          onChange={handleSelect}
        />
      <p className="text-gray-600">Click or drag & drop an image here</p>
    </div>
  );
};

export default ImageUpload;
