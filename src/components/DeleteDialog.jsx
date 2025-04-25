import { useContext } from 'react';
import { MarkdownContext } from '../App';

export default function DeleteDialog() {
  const { deleteDialogRef, handleDeleteDoc, title } = useContext(MarkdownContext);
  
  return (
    <dialog className='delete-dialog' ref={deleteDialogRef}>
      <h4>Delete this document?</h4>
      <p>Are you sure you want to delete the '{title}' document and its contents? This action cannot be reversed.</p>
      <div className="dialog-buttons">
        <button className="cancel-delete-btn" onClick={() => deleteDialogRef.current.close()}>
          Cancel
        </button>
        <button className="confirm-delete-btn" onClick={handleDeleteDoc}>
          Confirm & Delete
        </button>
      </div>
    </dialog>
  )
}
