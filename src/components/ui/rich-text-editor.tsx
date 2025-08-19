import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['blockquote', 'code-block'],
    ['clean']
  ]
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'color', 'background',
  'align', 'code-block'
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Masukkan konten...",
  className = ""
}) => {
  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          borderRadius: 'calc(var(--radius) - 2px)',
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .ql-toolbar {
            border-top: 1px solid hsl(var(--border));
            border-left: 1px solid hsl(var(--border));
            border-right: 1px solid hsl(var(--border));
            border-bottom: none;
            border-top-left-radius: calc(var(--radius) - 2px);
            border-top-right-radius: calc(var(--radius) - 2px);
            background: hsl(var(--background));
          }
          
          .ql-container {
            border-bottom: 1px solid hsl(var(--border));
            border-left: 1px solid hsl(var(--border));
            border-right: 1px solid hsl(var(--border));
            border-top: none;
            border-bottom-left-radius: calc(var(--radius) - 2px);
            border-bottom-right-radius: calc(var(--radius) - 2px);
            font-family: inherit;
            background: hsl(var(--background));
          }
          
          .ql-editor {
            color: hsl(var(--foreground));
            min-height: 150px;
          }
          
          .ql-snow .ql-tooltip {
            background: hsl(var(--popover));
            border: 1px solid hsl(var(--border));
            color: hsl(var(--popover-foreground));
          }
          
          .ql-snow .ql-tooltip input {
            background: hsl(var(--background));
            border: 1px solid hsl(var(--border));
            color: hsl(var(--foreground));
          }
          
          .ql-snow .ql-stroke {
            stroke: hsl(var(--foreground));
          }
          
          .ql-snow .ql-fill {
            fill: hsl(var(--foreground));
          }
          
          .ql-snow .ql-picker-label {
            color: hsl(var(--foreground));
          }
        `
      }} />
    </div>
  );
};

export default RichTextEditor;