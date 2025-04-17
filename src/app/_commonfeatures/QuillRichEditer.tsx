"use client"
import React, { FC, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import QuillEditor from './QuillEidtor';


interface QuillRichEditorProps {
    statValue: any;
    onChange: any;
}

const QuillRichEditor: FC<QuillRichEditorProps> = ({
    statValue,
    onChange
}) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Return null when rendering on server
    }

    return (
        <div>
            <QuillEditor
                ref={editorRef}
                readOnly={false}
                defaultValue={statValue}
                onTextChange={onChange}
            />
        </div>
    );
};

export default QuillRichEditor;