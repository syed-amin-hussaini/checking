import React, { useState } from 'react';
import pixelmatch from 'pixelmatch';
import { createCanvas, loadImage } from 'canvas';
import Dropzone from 'react-dropzone';

const ImageMatcher = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [diffImageURL, setDiffImageURL] = useState(null);

  const handleImage1Change = (acceptedFiles) => {
    setImage1(acceptedFiles[0]);
  };

  const handleImage2Change = (acceptedFiles) => {
    setImage2(acceptedFiles[0]);
  };

  const handleCompare = async () => {
    if (!image1 || !image2) {
      alert('Please select two images.');
      return;
    }

    const img1 = await loadImage(URL.createObjectURL(image1));
    const img2 = await loadImage(URL.createObjectURL(image2));

    // Ensure both images have the same dimensions
    if (img1.width !== img2.width || img1.height !== img2.height) {
      alert('Both images must have the same dimensions.');
      return;
    }

    const canvas = createCanvas(img1.width, img1.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img1, 0, 0);
    const img1Data = ctx.getImageData(0, 0, img1.width, img1.height);

    ctx.drawImage(img2, 0, 0);
    const img2Data = ctx.getImageData(0, 0, img2.width, img2.height);

    const diffCanvas = createCanvas(img1.width, img1.height);
    const diffCtx = diffCanvas.getContext('2d');

    // Compare the two images and generate a diff image
    const diffPixels = pixelmatch(
      img1Data.data,
      img2Data.data,
      diffCtx.createImageData(img1.width, img1.height).data,
      img1.width,
      img1.height,
      { threshold: 0.1 } // Adjust the threshold to control sensitivity
    );

    diffCtx.putImageData(new ImageData(diffPixels, img1.width, img1.height), 0, 0);

    // Convert the diff canvas to a data URL
    const diffDataURL = diffCanvas.toDataURL();

    // Update the state to show the diff image in the UI
    setDiffImageURL(diffDataURL);
  };

  return (
    <div>
      <Dropzone onDrop={handleImage1Change}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drop image 1 here</p>
          </div>
        )}
      </Dropzone>
      <Dropzone onDrop={handleImage2Change}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drop image 2 here</p>
          </div>
        )}
      </Dropzone>
      <button onClick={handleCompare}>Compare Images</button>
      {diffImageURL && (
        <div>
          <p>Diff Image:</p>
          <img src={diffImageURL} alt="Diff" />
        </div>
      )}
    </div>
  );
};

export default ImageMatcher;
