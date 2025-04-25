import { useRef, useState, useEffect } from 'react'
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import './App.css'
import { markdownContent } from './initial-text';

function App() {
  const today = new Date()
  const [lightTheme, setLightTheme] = useState(true)
  const [rawInput, setRawInput] = useState("")
  const [input, setInput] = useState("")
  const [title, setTitle] = useState("welcome.md")
  const [leftMenu, setLeftMenu] = useState(false)
  const [allFiles, setAllFiles] = useState([])
  const [visible, setVisible] = useState(true)
  const [currentFileId, setCurrentFileId] = useState(null)

  const inputRef = useRef(null)
  const deleteDialogRef = useRef(null)

  useEffect(() => {
    const savedFiles = localStorage.getItem('markdownFiles');
    if (savedFiles && JSON.parse(savedFiles).length > 0) {
      const parsedFiles = JSON.parse(savedFiles);
      setAllFiles(parsedFiles);
    } else {
      const defaultFile = {
        id: crypto.randomUUID(),
        title: "welcome.md",
        content: markdownContent,
        date: `${today.getDate()} ${(today.getMonth() + 1)} ${today.getFullYear()}`
      };
      setAllFiles([defaultFile]);
      setCurrentFileId(defaultFile?.id);
      setRawInput(defaultFile.content);
      setInput(marked.parse(defaultFile.content));
      setTitle(defaultFile.title);
    }
  }, []);

  function handleChange(e) {
    const userInput = e.target.value;
    setRawInput(userInput);
    setInput(marked.parse(userInput));
  }

  function handleLeftMenu() {
    setLeftMenu(!leftMenu)
  }

  function openNewDoc() {
    const date = new Date();
    const newFile = {
      id: crypto.randomUUID(),
      title: "untitled.md",
      content: "",
      date: `${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`
    };
    
    const updatedFiles = [...allFiles, newFile];
    setAllFiles(updatedFiles);
    localStorage.setItem('markdownFiles', JSON.stringify(updatedFiles));
    
    setCurrentFileId(newFile?.id);
    setTitle(newFile.title);
    setRawInput(newFile.content);
    setInput("");
  }

  function handleSaveDoc() {
    const date = new Date();
    const updatedFiles = allFiles.map(file => 
      file?.id === currentFileId
        ? {
            ...file,
            title: title,
            content: rawInput,
            date: `${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`
          }
        : file
    );
    
    setAllFiles(updatedFiles);
    localStorage.setItem('markdownFiles', JSON.stringify(updatedFiles));
  }

  function loadFile(index) {
    const selectedFile = allFiles[index];
    setCurrentFileId(selectedFile?.id);
    setTitle(selectedFile.title);
    setRawInput(selectedFile.content);
    setInput(marked.parse(selectedFile.content));
  }

  function handleTitleChange(e) {
    setTitle(e.target.value)
  }

  function handleDeleteDoc() {
    const updatedFiles = allFiles.filter(file => file?.id !== currentFileId);
    setAllFiles(updatedFiles);
    localStorage.setItem('markdownFiles', JSON.stringify(updatedFiles));
    
    if (updatedFiles.length > 0) {
      loadFile(0);
    } else {
      openNewDoc();
    }
    
    deleteDialogRef.current.close();
  }

  function showDelModal() {
    deleteDialogRef.current.showModal();
  }

  function themeChange() {
    setLightTheme(!lightTheme)
    if (lightTheme) {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
    }
  }

  function handleVisibility() {
    setVisible(!visible)
  }

  return (
    <>
      {
        leftMenu
          ? <LeftMenu 
              themeChange={themeChange} 
              openNewDoc={openNewDoc} 
              allFiles={allFiles} 
              loadFile={loadFile} 
              lightTheme={lightTheme}
            />
          : ""
      }
      <div className="main-cont">
        <Header 
          leftMenu={leftMenu} 
          showDelModal={showDelModal} 
          handleDeleteDoc={handleDeleteDoc} 
          title={title} 
          handleLeftMenu={handleLeftMenu} 
          handleSaveDoc={handleSaveDoc} 
          handleTitleChange={handleTitleChange} 
        />
        <DeleteDialog 
          deleteDialogRef={deleteDialogRef} 
          handleDeleteDoc={handleDeleteDoc} 
          title={title}
        />
        <div className="text-contents">
          {
            visible
              ? <div className="left-area">
                  <div className="markdown-title gray-title">
                    <p>MARKDOWN</p>
                  </div>
                  <UserInputArea 
                    rawInput={rawInput} 
                    inputRef={inputRef} 
                    handleChange={handleChange} 
                    input={input} 
                  />
                </div>
              : ""
          }

          <div className="right-area">
            <div className="preview-title gray-title">
              <p>PREVIEW</p>
              <button onClick={handleVisibility} className='eye-btn'>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path id="Combined Shape" fillRule="evenodd" clipRule="evenodd" d="M15.8929 5.20135C15.3811 4.3137 12.5662 -0.140531 7.78409 0.00341151C3.36184 0.115367 0.802861 4.00182 0.107137 5.20135C-0.0357124 5.44877 -0.0357124 5.7536 0.107137 6.00103C0.610937 6.87268 3.30587 11.199 8.01599 11.199H8.21591C12.6382 11.087 15.2051 7.20055 15.8929 6.00103C16.0357 5.7536 16.0357 5.44877 15.8929 5.20135ZM8.17593 9.5996C4.7293 9.67957 2.48219 6.72874 1.77847 5.60119C2.57816 4.3137 4.66533 1.68274 7.86405 1.60278C11.2947 1.51481 13.5498 4.47363 14.2615 5.60119C13.4378 6.88867 11.3747 9.51963 8.17593 9.5996ZM8 2.8023C6.45422 2.8023 5.20111 4.0554 5.20111 5.60119C5.20111 7.14697 6.45422 8.40007 8 8.40007C9.54578 8.40007 10.7989 7.14697 10.7989 5.60119C10.7989 4.0554 9.54578 2.8023 8 2.8023ZM8 6.80071C7.33752 6.80071 6.80048 6.26367 6.80048 5.60119C6.80048 4.93871 7.33752 4.40166 8 4.40166C8.66248 4.40166 9.19952 4.93871 9.19952 5.60119C9.19952 6.26367 8.66248 6.80071 8 6.80071Z" fill="#7C8187" />
                </svg>
              </button>
            </div>
            <UserOutput input={input} />
          </div>
        </div>
      </div>
    </>
  )
}

function LeftMenu({ themeChange, openNewDoc, allFiles, loadFile, lightTheme }) {
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

function Header({ showDelModal, leftMenu, title, handleLeftMenu, handleSaveDoc, handleTitleChange }) {
  return (
    <header>
      <button className="left-menu-btn header-btn" onClick={handleLeftMenu}>
        {leftMenu ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.10049" y="0.686279" width="30" height="2" transform="rotate(45 2.10049 0.686279)" fill="white" />
            <rect x="0.686279" y="21.8994" width="30" height="2" transform="rotate(-45 0.686279 21.8994)" fill="white" />
          </svg>
        ) : (
          <svg width="30" height="18" viewBox="0 0 30 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="30" height="2" fill="white" />
            <rect y="8" width="30" height="2" fill="white" />
            <rect y="16" width="30" height="2" fill="white" />
          </svg>
        )}
      </button>
      <h1>MARKDOWN</h1>
      <div className="horizontal-line"></div>
      <div className="file-name-div">
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="File">
            <path id="Shape" fillRule="evenodd" clipRule="evenodd" d="M13.1071 3.39286C13.2738 3.55952 13.4167 3.78571 13.5357 4.07143C13.6548 4.35714 13.7143 4.61905 13.7143 4.85714V15.1429C13.7143 15.381 13.631 15.5833 13.4643 15.75C13.2976 15.9167 13.0952 16 12.8571 16H0.857143C0.619048 16 0.416667 15.9167 0.25 15.75C0.0833333 15.5833 0 15.381 0 15.1429V0.857143C0 0.619048 0.0833333 0.416667 0.25 0.25C0.416667 0.0833333 0.619048 0 0.857143 0H8.85714C9.09524 0 9.35714 0.0595238 9.64286 0.178571C9.92857 0.297619 10.1548 0.440476 10.3214 0.607143L13.1071 3.39286ZM9.14286 1.21429V4.57143H12.5C12.4405 4.39881 12.375 4.27679 12.3036 4.20536L9.50893 1.41071C9.4375 1.33929 9.31548 1.27381 9.14286 1.21429ZM12.5714 5.71429V14.8571H1.14286V1.14286H8V4.85714C8 5.09524 8.08333 5.29762 8.25 5.46429C8.41667 5.63095 8.61905 5.71429 8.85714 5.71429H12.5714Z" fill="white" />
          </g>
        </svg>
        <div className="file-name-input">
          <p>Document name</p>
          <input 
            className='file-name-input' 
            onChange={handleTitleChange} 
            value={title} 
          />
        </div>
      </div>
      <button onClick={showDelModal} className="delete-file-btn header-btn">
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M17 4H13V3C13 1.34315 11.6569 0 10 0H8C6.34315 0 5 1.34315 5 3V4H1C0.447715 4 0 4.44772 0 5C0 5.55228 0.447715 6 1 6H2V17C2 18.6569 3.34315 20 5 20H13C14.6569 20 16 18.6569 16 17V6H17C17.5523 6 18 5.55228 18 5C18 4.44772 17.5523 4 17 4ZM7 16C7.55228 16 8 15.5523 8 15V9C8 8.44771 7.55228 8 7 8C6.44772 8 6 8.44771 6 9V15C6 15.5523 6.44772 16 7 16ZM8 2C7.44772 2 7 2.44772 7 3V4H11V3C11 2.44772 10.5523 2 10 2H8ZM14 17C14 17.5523 13.5523 18 13 18H5C4.44772 18 4 17.5523 4 17V6H14V17ZM12 15C12 15.5523 11.5523 16 11 16C10.4477 16 10 15.5523 10 15V9C10 8.44771 10.4477 8 11 8C11.5523 8 12 8.44771 12 9V15Z" fill="#7C8187" />
        </svg>
      </button>
      <button onClick={handleSaveDoc} className="save-changes-btn header-btn">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="save">
            <path id="Shape" fillRule="evenodd" clipRule="evenodd" d="M10.5762 0.597591L15.9095 5.93092C16.0759 6.09867 16.1687 6.32577 16.1673 6.56204V13.6731C16.1673 15.1459 14.9734 16.3398 13.5006 16.3398H2.83398C1.36122 16.3398 0.167313 15.1459 0.167313 13.6731V3.00648C0.167313 1.53372 1.36122 0.339813 2.83398 0.339813H9.94509C10.064 0.342034 10.1815 0.366139 10.2918 0.410924C10.3977 0.454252 10.4943 0.517635 10.5762 0.597591ZM9.0562 2.11759H5.50065V3.89537H9.0562V2.11759ZM10.834 14.562H5.50065V11.8954C5.50065 11.4044 5.89862 11.0065 6.38953 11.0065H9.94509C10.436 11.0065 10.834 11.4044 10.834 11.8954V14.562ZM13.5006 14.562C13.9916 14.562 14.3895 14.1641 14.3895 13.6731V6.92648L10.834 3.37092V4.78426C10.834 5.27518 10.436 5.67315 9.94509 5.67315H4.61176C4.12084 5.67315 3.72287 5.27518 3.72287 4.78426V2.11759H2.83398C2.34306 2.11759 1.94509 2.51556 1.94509 3.00648V13.6731C1.94509 14.1641 2.34306 14.562 2.83398 14.562H3.72287V11.8954C3.72287 10.4226 4.91678 9.2287 6.38953 9.2287H9.94509C11.4178 9.2287 12.6118 10.4226 12.6118 11.8954V14.562H13.5006Z" fill="white" />
          </g>
        </svg>
        <p>Save Changes</p>
      </button>
    </header>
  )
}

function DeleteDialog({ deleteDialogRef, handleDeleteDoc, title }) {
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

function UserInputArea({ handleChange, inputRef, rawInput }) {
  return (
    <div className="user-input">
      <textarea 
        ref={inputRef} 
        onChange={handleChange} 
        value={rawInput}
        placeholder="Start typing your markdown here..."
      ></textarea>
    </div>
  )
}

function UserOutput({ input }) {
  return (
    <div 
      className='output-preview' 
      dangerouslySetInnerHTML={{ __html: input || "<p>Nothing to preview</p>" }} 
    />
  )
}

export default App