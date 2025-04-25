import { useContext } from 'react';
import { MarkdownContext } from '../App';

export default function UserInputArea() {
  const { handleChange, inputRef, rawInput } = useContext(MarkdownContext);
  
  return (
    <div className="user-input">
      <textarea 
        ref={inputRef} 
        onChange={handleChange} 
        value={rawInput}
        placeholder="# Start typing your markdown here..."
      ></textarea>
    </div>
  )
}
