import React from 'react'
import { useRef } from 'react';
import JoditEditor from "jodit-react";
const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    enableDragAndDropFileToEditor: true,
    
    buttons: [
        'source',
        'bold',
        'italic',
        '|',
        'underline',
        '|',
        'font',
        'fontsize',
        '|',
        'image',
        'link',
        '|',
        'undo',
        'redo',
        '|',
        'eraser',
    ],
    uploader: { insertImageAsBase64URI: true },
    removeButtons: ['brush', 'file','grid'],
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarAdaptive: true,
    toolbarSticky: true,
     theme : 'light' ,
    style: {
        background: 'black.300',
        
    },
};

function RichEditor({setDescription}) {
   
    const editor = useRef(null);
    return (
        
            <JoditEditor ref={editor} onChange={(des) => setDescription(des)} width="100%" maxWidth={"100%"}
            config={config}
            />
        
    )
}

export default RichEditor