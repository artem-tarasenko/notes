import { useEffect, useRef } from "react";

interface ITextareaProps {
  value: string;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea(props: ITextareaProps) {
  const { value, onBlur, onChange } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []);

  return (
    <textarea
      ref={textareaRef}
      className="note-text text-zinc-800 bg-zinc-300/40 h-full w-full p-2 rounded-md border border-zinc-900/10 resize-none focus:outline-none"
      value={value}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
}
