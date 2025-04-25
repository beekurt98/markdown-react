import { useContext } from 'react';
import { MarkdownContext } from '../App';

export default function UserOutput() {
  const { input } = useContext(MarkdownContext);
  
  return (
    <div 
      className='output-preview' 
      dangerouslySetInnerHTML={{ __html: input }} 
    />
  )
}
