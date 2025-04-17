"use client"
import React, { useRef, useEffect, forwardRef, useMemo } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

type QuillEditorProps = {
    readOnly?: boolean;
    defaultValue?: any;
    onTextChange?: (content: string) => void;
};

const QuillEditor = forwardRef<HTMLDivElement, QuillEditorProps>(({
    readOnly = false,
    defaultValue = '',
    onTextChange,
}, ref) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        } else {
            if (editorRef.current && !quillRef.current) {
                quillRef.current = new Quill(editorRef.current, {
                    modules: {
                        toolbar: !readOnly && [
                            [{ 'header': "1" }, { 'header': "2" }, { 'header': "3" }, 'bold', 'italic', 'underline', 'strike', { 'align': [] }, { list: 'ordered' }, { list: 'bullet' }, { 'script': 'sub' }, { 'script': 'super' }, 'blockquote', 'link', 'image'],
                        ],
                    },
                    theme: 'snow',
                    readOnly: readOnly,
                });

                quillRef.current.on('text-change', () => {
                    const editorContent = quillRef.current!.root.innerHTML;
                    onTextChange && onTextChange(editorContent);
                });

                if (defaultValue) {
                    quillRef.current.root.innerHTML = defaultValue;
                }
            }
        }

    }, [defaultValue, readOnly, onTextChange]);


    return (
        <div ref={editorRef} />
    );
});
QuillEditor.displayName = "QuillEditor";
export default QuillEditor;
