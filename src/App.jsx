import { useRef, useState, useEffect, createContext, useContext } from 'react'
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import './App.css'
import { markdownContent } from './initial-text';
import Header from './components/Header';
import LeftMenu from './components/LeftMenu';
import DeleteDialog from './components/DeleteDialog';
import UserInputArea from './components/UserInputArea';
import UserOutput from './components/UserOutput';

export const MarkdownContext = createContext();

export default function App() {
  const today = new Date()
  const [lightTheme, setLightTheme] = useState(false)
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
      
      const firstFile = parsedFiles[0];
      setCurrentFileId(firstFile?.id);
      setRawInput(firstFile.content);
      setInput(marked.parse(firstFile.content));
      setTitle(firstFile.title);
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

  const contextValue = {
    lightTheme,
    themeChange,
    rawInput,
    input,
    title,
    leftMenu,
    allFiles,
    visible,
    currentFileId,
    inputRef,
    deleteDialogRef,
    handleChange,
    handleLeftMenu,
    openNewDoc,
    handleSaveDoc,
    loadFile,
    handleTitleChange,
    handleDeleteDoc,
    showDelModal,
    handleVisibility
  };

  return (
    <MarkdownContext.Provider value={contextValue}>
      {leftMenu && <LeftMenu />}
      <div className="main-cont">
        <Header />
        <DeleteDialog />
        <div className="text-contents">
          {visible && (
            <div className="left-area">
              <div className="markdown-title gray-title">
                <p>MARKDOWN</p>
              </div>
              <UserInputArea />
            </div>
          )}

          <div className="right-area">
            <div className="preview-title gray-title">
              <p>PREVIEW</p>
              <button onClick={handleVisibility} className='eye-btn'>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path id="Combined Shape" fillRule="evenodd" clipRule="evenodd" d="M15.8929 5.20135C15.3811 4.3137 12.5662 -0.140531 7.78409 0.00341151C3.36184 0.115367 0.802861 4.00182 0.107137 5.20135C-0.0357124 5.44877 -0.0357124 5.7536 0.107137 6.00103C0.610937 6.87268 3.30587 11.199 8.01599 11.199H8.21591C12.6382 11.087 15.2051 7.20055 15.8929 6.00103C16.0357 5.7536 16.0357 5.44877 15.8929 5.20135ZM8.17593 9.5996C4.7293 9.67957 2.48219 6.72874 1.77847 5.60119C2.57816 4.3137 4.66533 1.68274 7.86405 1.60278C11.2947 1.51481 13.5498 4.47363 14.2615 5.60119C13.4378 6.88867 11.3747 9.51963 8.17593 9.5996ZM8 2.8023C6.45422 2.8023 5.20111 4.0554 5.20111 5.60119C5.20111 7.14697 6.45422 8.40007 8 8.40007C9.54578 8.40007 10.7989 7.14697 10.7989 5.60119C10.7989 4.0554 9.54578 2.8023 8 2.8023ZM8 6.80071C7.33752 6.80071 6.80048 6.26367 6.80048 5.60119C6.80048 4.93871 7.33752 4.40166 8 4.40166C8.66248 4.40166 9.19952 4.93871 9.19952 5.60119C9.19952 6.26367 8.66248 6.80071 8 6.80071Z" fill="#7C8187" />
                </svg>
              </button>
            </div>
            <UserOutput />
          </div>
        </div>
      </div>
    </MarkdownContext.Provider>
  )
}
