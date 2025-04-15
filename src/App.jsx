import { useRef, useState } from 'react'
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import './App.css'
import { markdownContent } from './initial-text';

function App() {
  const today = new Date()
  const [lightTheme, setLightTheme] = useState(true)
  const [rawInput, setRawInput] = useState(markdownContent)
  const [input, setInput] = useState("")
  const [title, setTitle] = useState("welcome.md")
  const [leftMenu, setLeftMenu] = useState(false)
  const [allFiles, setAllFiles] = useState([{ title: "welcome.md", content: "", date: `${today.getDate()} ${(today.getMonth() + 1)} ${today.getFullYear()}` }])
  const [visible, setVisible] = useState(true)

  const inputRef = useRef(null)
  const deleteDialogRef = useRef(null)

  function handleChange(e) {
    let userInput = e.target.value
    setRawInput(userInput)
    setInput(marked.parse(userInput))
  }

  window.onload = () => {
    setRawInput(rawInput)
    setInput(marked.parse(rawInput))
  }

  function handleLeftMenu() {
    setLeftMenu(!leftMenu)
  }

  function openNewDoc() {
    setTitle("untitled.md")
    setInput("")
    setRawInput("")
    const date = new Date()
    const newFile = {
      title: "untitled.md",
      content: rawInput,
      date: `${(date.getDate())} ${(date.getMonth() + 1)} ${date.getFullYear()}`
    }
    setAllFiles([...allFiles, newFile])
  }

  function handleSaveDoc() {
    const date = new Date()
    const newFile = {
      title: title,
      content: rawInput,
      date: `${(date.getDate())} ${(date.getMonth() + 1)} ${date.getFullYear()}`
    }
    setAllFiles([...allFiles, newFile])
  }

  function loadFile(index) {
    let selectedFile = allFiles[index]
    setTitle(selectedFile.title)
    setRawInput(selectedFile.content)
    setInput(selectedFile.content)
  }

  function handleTitleChange(e) {
    setTitle(e.target.value)
  }

  function handleDeleteDoc() {
    setAllFiles(allFiles.filter((file) => file.content !== rawInput && file.title !== title))
    deleteDialogRef.current.close()
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
          ? <LeftMenu themeChange={themeChange} openNewDoc={openNewDoc} allFiles={allFiles} loadFile={loadFile} />
          : ""
      }
      <div className="main-cont">
        <Header leftMenu={leftMenu} showDelModal={showDelModal} handleDeleteDoc={handleDeleteDoc} title={title} handleLeftMenu={handleLeftMenu} handleSaveDoc={handleSaveDoc} handleTitleChange={handleTitleChange} />
        <DeleteDialog deleteDialogRef={deleteDialogRef} handleDeleteDoc={handleDeleteDoc} />
        <div className="text-contents">
          {
            visible
              ? <div className="left-area">
                <div className="markdown-title gray-title">
                  <p>MARKDOWN</p>
                </div>
                <UserInputArea rawInput={rawInput} inputRef={inputRef} handleChange={handleChange} input={input} />
              </div>
              : ""
          }

          <div className="right-area">
            <div className="preview-title gray-title">
              <p>PREVIEW</p>
              <button onClick={handleVisibility} className='eye-btn'>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path id="Combined Shape" fill-rule="evenodd" clip-rule="evenodd" d="M15.8929 5.20135C15.3811 4.3137 12.5662 -0.140531 7.78409 0.00341151C3.36184 0.115367 0.802861 4.00182 0.107137 5.20135C-0.0357124 5.44877 -0.0357124 5.7536 0.107137 6.00103C0.610937 6.87268 3.30587 11.199 8.01599 11.199H8.21591C12.6382 11.087 15.2051 7.20055 15.8929 6.00103C16.0357 5.7536 16.0357 5.44877 15.8929 5.20135ZM8.17593 9.5996C4.7293 9.67957 2.48219 6.72874 1.77847 5.60119C2.57816 4.3137 4.66533 1.68274 7.86405 1.60278C11.2947 1.51481 13.5498 4.47363 14.2615 5.60119C13.4378 6.88867 11.3747 9.51963 8.17593 9.5996ZM8 2.8023C6.45422 2.8023 5.20111 4.0554 5.20111 5.60119C5.20111 7.14697 6.45422 8.40007 8 8.40007C9.54578 8.40007 10.7989 7.14697 10.7989 5.60119C10.7989 4.0554 9.54578 2.8023 8 2.8023ZM8 6.80071C7.33752 6.80071 6.80048 6.26367 6.80048 5.60119C6.80048 4.93871 7.33752 4.40166 8 4.40166C8.66248 4.40166 9.19952 4.93871 9.19952 5.60119C9.19952 6.26367 8.66248 6.80071 8 6.80071Z" fill="#7C8187" />
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

function LeftMenu({ themeChange, openNewDoc, allFiles, loadFile }) {

  return (
    <>
      <div className="left-menu-cont">
        <h2>MY DOCUMENTS</h2>
        <button className="add-new-btn" onClick={openNewDoc}>
          + New Document
        </button>
        <div className="documents-list">
          {
            allFiles.length
              ? allFiles.map((file, index) => {
                return <div onClick={() => loadFile(index)} className='file' key={index}>
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1071 3.39286C13.2738 3.55952 13.4167 3.78571 13.5357 4.07143C13.6548 4.35714 13.7143 4.61905 13.7143 4.85714V15.1429C13.7143 15.381 13.631 15.5833 13.4643 15.75C13.2976 15.9167 13.0952 16 12.8571 16H0.857143C0.619048 16 0.416667 15.9167 0.25 15.75C0.0833333 15.5833 0 15.381 0 15.1429V0.857143C0 0.619048 0.0833333 0.416667 0.25 0.25C0.416667 0.0833333 0.619048 0 0.857143 0H8.85714C9.09524 0 9.35714 0.0595238 9.64286 0.178571C9.92857 0.297619 10.1548 0.440476 10.3214 0.607143L13.1071 3.39286ZM9.14286 1.21429V4.57143H12.5C12.4405 4.39881 12.375 4.27679 12.3036 4.20536L9.50893 1.41071C9.4375 1.33929 9.31548 1.27381 9.14286 1.21429ZM12.5714 5.71429V14.8571H1.14286V1.14286H8V4.85714C8 5.09524 8.08333 5.29762 8.25 5.46429C8.41667 5.63095 8.61905 5.71429 8.85714 5.71429H12.5714Z" fill="white" />
                  </svg>
                  <div className="file-text">
                    <p>{file.date}</p>
                    <h3>{file.title}</h3>
                  </div>
                </div>
              })
              : ""
          }
        </div>
        <label className="switch theme-switch" onChange={themeChange}>
          <span className="sun"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="#ffd43b"><circle r="5" cy="12" cx="12"></circle><path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path></g></svg></span>
          <span className="moon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path></svg></span>
          <input type="checkbox" className="input" />
          <span className="slider"></span>
        </label>
      </div>
    </>
  )
}

function Header({ showDelModal, leftMenu, handleDeleteDoc, title, handleLeftMenu, handleSaveDoc, handleTitleChange }) {

  return (
    <>
      <header>
        <button className="left-menu-btn header-btn" onClick={handleLeftMenu}>

          {
            leftMenu ?
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.10049" y="0.686279" width="30" height="2" transform="rotate(45 2.10049 0.686279)" fill="white" />
                <rect x="0.686279" y="21.8994" width="30" height="2" transform="rotate(-45 0.686279 21.8994)" fill="white" />
              </svg>
              : <svg width="30" height="18" viewBox="0 0 30 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="2" fill="white" />
                <rect y="8" width="30" height="2" fill="white" />
                <rect y="16" width="30" height="2" fill="white" />
              </svg>
          }

        </button>
        <h1>MARKDOWN</h1>
        <div className="horizontal-line"></div>
        <div className="file-name-div">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="File">
              <path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M13.1071 3.39286C13.2738 3.55952 13.4167 3.78571 13.5357 4.07143C13.6548 4.35714 13.7143 4.61905 13.7143 4.85714V15.1429C13.7143 15.381 13.631 15.5833 13.4643 15.75C13.2976 15.9167 13.0952 16 12.8571 16H0.857143C0.619048 16 0.416667 15.9167 0.25 15.75C0.0833333 15.5833 0 15.381 0 15.1429V0.857143C0 0.619048 0.0833333 0.416667 0.25 0.25C0.416667 0.0833333 0.619048 0 0.857143 0H8.85714C9.09524 0 9.35714 0.0595238 9.64286 0.178571C9.92857 0.297619 10.1548 0.440476 10.3214 0.607143L13.1071 3.39286ZM9.14286 1.21429V4.57143H12.5C12.4405 4.39881 12.375 4.27679 12.3036 4.20536L9.50893 1.41071C9.4375 1.33929 9.31548 1.27381 9.14286 1.21429ZM12.5714 5.71429V14.8571H1.14286V1.14286H8V4.85714C8 5.09524 8.08333 5.29762 8.25 5.46429C8.41667 5.63095 8.61905 5.71429 8.85714 5.71429H12.5714Z" fill="white" />
            </g>
          </svg>
          <div className="file-name-input">
            <p>Document name</p>
            <input className='file-name-input' onChange={handleTitleChange} value={title} />
          </div>
        </div>
        <button onClick={showDelModal} className="delete-file-btn header-btn">
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M17 4H13V3C13 1.34315 11.6569 0 10 0H8C6.34315 0 5 1.34315 5 3V4H1C0.447715 4 0 4.44772 0 5C0 5.55228 0.447715 6 1 6H2V17C2 18.6569 3.34315 20 5 20H13C14.6569 20 16 18.6569 16 17V6H17C17.5523 6 18 5.55228 18 5C18 4.44772 17.5523 4 17 4ZM7 16C7.55228 16 8 15.5523 8 15V9C8 8.44771 7.55228 8 7 8C6.44772 8 6 8.44771 6 9V15C6 15.5523 6.44772 16 7 16ZM8 2C7.44772 2 7 2.44772 7 3V4H11V3C11 2.44772 10.5523 2 10 2H8ZM14 17C14 17.5523 13.5523 18 13 18H5C4.44772 18 4 17.5523 4 17V6H14V17ZM12 15C12 15.5523 11.5523 16 11 16C10.4477 16 10 15.5523 10 15V9C10 8.44771 10.4477 8 11 8C11.5523 8 12 8.44771 12 9V15Z" fill="#7C8187" />
          </svg>

        </button>
        <button onClick={handleSaveDoc} className="save-changes-btn header-btn">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="save">
              <path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M10.5762 0.597591L15.9095 5.93092C16.0759 6.09867 16.1687 6.32577 16.1673 6.56204V13.6731C16.1673 15.1459 14.9734 16.3398 13.5006 16.3398H2.83398C1.36122 16.3398 0.167313 15.1459 0.167313 13.6731V3.00648C0.167313 1.53372 1.36122 0.339813 2.83398 0.339813H9.94509C10.064 0.342034 10.1815 0.366139 10.2918 0.410924C10.3977 0.454252 10.4943 0.517635 10.5762 0.597591ZM9.0562 2.11759H5.50065V3.89537H9.0562V2.11759ZM10.834 14.562H5.50065V11.8954C5.50065 11.4044 5.89862 11.0065 6.38953 11.0065H9.94509C10.436 11.0065 10.834 11.4044 10.834 11.8954V14.562ZM13.5006 14.562C13.9916 14.562 14.3895 14.1641 14.3895 13.6731V6.92648L10.834 3.37092V4.78426C10.834 5.27518 10.436 5.67315 9.94509 5.67315H4.61176C4.12084 5.67315 3.72287 5.27518 3.72287 4.78426V2.11759H2.83398C2.34306 2.11759 1.94509 2.51556 1.94509 3.00648V13.6731C1.94509 14.1641 2.34306 14.562 2.83398 14.562H3.72287V11.8954C3.72287 10.4226 4.91678 9.2287 6.38953 9.2287H9.94509C11.4178 9.2287 12.6118 10.4226 12.6118 11.8954V14.562H13.5006Z" fill="white" />
            </g>
          </svg>
          <p>Save Changes</p>
        </button>
      </header>
    </>
  )
}

function DeleteDialog({ deleteDialogRef, handleDeleteDoc }) {

  return (
    <>
      <dialog className='delete-dialog' ref={deleteDialogRef}>
        <h4>Delete this document?</h4>
        <p>Are you sure you want to delete the ‘welcome.md’ document and its contents? This action cannot be reversed.</p>
        <button className="confirm-delete-btn" onClick={handleDeleteDoc}>Confirm & Delete</button>
      </dialog>
    </>
  )
}

function UserInputArea({ handleChange, input, inputRef, rawInput }) {

  return (
    <>
      <div className="user-input">
        <textarea ref={inputRef} name="" onChange={handleChange} value={rawInput}></textarea>
      </div>
    </>
  )
}

function UserOutput({ input }) {

  return (
    <>
      <div className='output-preview' dangerouslySetInnerHTML={{ __html: input }} />
    </>
  )
}

function MoonSvg() {
  return (
    <>
      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2774 8.68879C15.5637 8.55901 15.8989 8.6037 16.1411 8.80395C16.4053 9.00561 16.5221 9.34637 16.4373 9.66766C15.4983 13.4521 12.0626 16.0811 8.16423 15.9981C4.26587 15.9151 0.945195 13.1423 0.16809 9.32131C-0.609014 5.50029 1.36484 1.65074 4.92111 0.0516606C5.20021 -0.0522001 5.51366 0.00290056 5.7406 0.195721C5.96755 0.388541 6.07256 0.688966 6.01515 0.98118C5.88228 1.5196 5.81325 2.07179 5.8095 2.62635C5.8321 6.30962 8.82199 9.28482 12.5053 9.28927C13.4619 9.29168 14.4076 9.08682 15.2774 8.68879ZM2.05332 9.82159C2.98704 12.4917 5.49798 14.2871 8.32661 14.307V14.3399C10.8022 14.343 13.0759 12.975 14.2328 10.7864C13.6652 10.9088 13.086 10.9695 12.5053 10.9673C7.9006 10.9628 4.16887 7.23107 4.16433 2.62635V2.40425C1.96456 4.18258 1.1196 7.15144 2.05332 9.82159Z" fill="#5A6069" />
      </svg>
    </>
  )
}

function SunSvg() {
  return (
    <>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2.7C9.49706 2.7 9.9 2.29706 9.9 1.8V0.9C9.9 0.402944 9.49706 0 9 0C8.50294 0 8.1 0.402944 8.1 0.9V1.8C8.1 2.29706 8.50294 2.7 9 2.7ZM1.8 8.1C2.29706 8.1 2.7 8.50294 2.7 9C2.7 9.49706 2.29706 9.9 1.8 9.9H0.9C0.402944 9.9 0 9.49706 0 9C0 8.50294 0.402944 8.1 0.9 8.1H1.8ZM2.637 14.139L3.276 13.5C3.63308 13.1942 4.16537 13.2148 4.49781 13.5472C4.83024 13.8796 4.8508 14.4119 4.545 14.769L3.906 15.408C3.55497 15.757 2.98803 15.757 2.637 15.408C2.28805 15.057 2.28805 14.49 2.637 14.139ZM14.724 4.545C14.5564 4.71127 14.3301 4.80501 14.094 4.806C13.8704 4.79588 13.6587 4.70283 13.5 4.545C13.151 4.19397 13.151 3.62703 13.5 3.276L14.094 2.637C14.314 2.38016 14.6593 2.26829 14.9881 2.34737C15.3168 2.42646 15.5735 2.68315 15.6526 3.01192C15.7317 3.34069 15.6198 3.68605 15.363 3.906L14.724 4.545ZM3.294 4.545C3.46163 4.71127 3.68789 4.80501 3.924 4.806C4.16322 4.80738 4.39315 4.71347 4.563 4.545C4.91195 4.19397 4.91195 3.62703 4.563 3.276L3.924 2.637C3.69732 2.4071 3.3652 2.3156 3.05276 2.39696C2.74031 2.47833 2.49501 2.7202 2.40926 3.03146C2.3235 3.34273 2.41032 3.6761 2.637 3.906L3.294 4.545ZM16.2 8.1H17.1C17.5971 8.1 18 8.50294 18 9C18 9.49706 17.5971 9.9 17.1 9.9H16.2C15.7029 9.9 15.3 9.49706 15.3 9C15.3 8.50294 15.7029 8.1 16.2 8.1ZM14.724 13.5C14.3727 13.3046 13.9344 13.3659 13.6501 13.6501C13.3659 13.9344 13.3046 14.3727 13.5 14.724L14.139 15.363C14.49 15.712 15.057 15.712 15.408 15.363C15.757 15.012 15.757 14.445 15.408 14.094L14.724 13.5ZM4.05 9C4.05 6.26619 6.26619 4.05 9 4.05C11.7318 4.05495 13.945 6.26824 13.95 9C13.95 11.7338 11.7338 13.95 9 13.95C6.26619 13.95 4.05 11.7338 4.05 9ZM9 12.15C7.72594 12.15 6.57734 11.3825 6.08978 10.2055C5.60222 9.02838 5.87172 7.67351 6.77261 6.77261C7.67351 5.87172 9.02838 5.60222 10.2055 6.08978C11.3825 6.57734 12.15 7.72594 12.15 9C12.15 10.7397 10.7397 12.15 9 12.15ZM8.1 16.2C8.1 15.7029 8.50294 15.3 9 15.3C9.49706 15.3 9.9 15.7029 9.9 16.2V17.1C9.9 17.5971 9.49706 18 9 18C8.50294 18 8.1 17.5971 8.1 17.1V16.2Z" fill="white" />
      </svg>
    </>
  )
}


export default App
