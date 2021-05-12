import { useState, useRef } from 'react';
import Image from 'material-ui-image';
import ImageUploadIcon from '../Icons/ImageUploadIcon';

const UploadZone = (): JSX.Element => {
    const [image, setImage] = useState('');
    const inputFile = useRef<HTMLInputElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFileUpload = async (e: any): Promise<void> => {
        const { files } = e.target;
        if (files && files.length) {
            const filename = files[0].name;

            const parts = filename.split('.');
            const fileType = parts[parts.length - 1];
            console.log('fileType', fileType); //ex: zip, rar, jpg, svg etc.

            const blob = await new Response(files[0].stream()).blob();
            const url = URL.createObjectURL(blob);
            setImage(url);
        }
    };

    const onButtonClick = (): void => {
        inputFile.current?.click();
    };

    return (
        <div>
            <input
                style={{ display: 'none' }}
                // accept=".zip,.rar"
                ref={inputFile}
                onChange={handleFileUpload}
                type="file"
            />
            <Image
                src={image || '#'}
                alt="Picture of the author"
                errorIcon={<ImageUploadIcon />}
                color="rgba(0,0,0,0)"
                aspectRatio={4 / 1}
                onClick={onButtonClick}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setImage('#');
                }}
            />
        </div>
    );
};

export default UploadZone;
