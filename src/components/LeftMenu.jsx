import { useContext } from 'react';
import { MarkdownContext } from '../App';

export default function LeftMenu() {
  const { 
    themeChange, 
    openNewDoc, 
    allFiles, 
    loadFile, 
    lightTheme 
  } = useContext(MarkdownContext);
  
  return (
    <div className="left-menu-cont">
      <h2>MY DOCUMENTS</h2>
      <button className="add-new-btn" onClick={openNewDoc}>
        + New Document
      </button>
      <div className="documents-list">
        {allFiles.map((file, index) => (
          <div onClick={() => loadFile(index)} className='file' key={file?.id}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M13.1071 3.39286C13.2738 3.55952 13.4167 3.78571 13.5357 4.07143C13.6548 4.35714 13.7143 4.61905 13.7143 4.85714V15.1429C13.7143 15.381 13.631 15.5833 13.4643 15.75C13.2976 15.9167 13.0952 16 12.8571 16H0.857143C0.619048 16 0.416667 15.9167 0.25 15.75C0.0833333 15.5833 0 15.381 0 15.1429V0.857143C0 0.619048 0.0833333 0.416667 0.25 0.25C0.416667 0.0833333 0.619048 0 0.857143 0H8.85714C9.09524 0 9.35714 0.0595238 9.64286 0.178571C9.92857 0.297619 10.1548 0.440476 10.3214 0.607143L13.1071 3.39286ZM9.14286 1.21429V4.57143H12.5C12.4405 4.39881 12.375 4.27679 12.3036 4.20536L9.50893 1.41071C9.4375 1.33929 9.31548 1.27381 9.14286 1.21429ZM12.5714 5.71429V14.8571H1.14286V1.14286H8V4.85714C8 5.09524 8.08333 5.29762 8.25 5.46429C8.41667 5.63095 8.61905 5.71429 8.85714 5.71429H12.5714Z" fill="white" />
            </svg>
            <div className="file-text">
              <p>{file.date}</p>
              <h3>{file.title}</h3>
            </div>
          </div>
        ))}
      </div>
      <label className="switch theme-switch">
        <span className="sun">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="#ffd43b">
              <circle r="5" cy="12" cx="12"></circle>
              <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>
            </g>
          </svg>
        </span>
        <span className="moon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
          </svg>
        </span>
        <input 
          type="checkbox" 
          className="input" 
          checked={!lightTheme}
          onChange={themeChange}
        />
        <span className="slider"></span>
      </label>
    </div>
  )
}
