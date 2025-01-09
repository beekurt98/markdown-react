import { useRef, useState } from 'react'
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import './App.css'

function App() {
  const [rawInput, setRawInput] = useState("")
  const [input, setInput] = useState("")
  const [title, setTitle] = useState("welcome")
  const [leftMenu, setLeftMenu] = useState(true)
  const [isEditing, setEditing] = useState(false)
  const [allFiles, setAllFiles] = useState([])
  const [file, setFile] = useState({
    title: "",
    content: "",
    date: ""
  })

  const inputRef = useRef(null)

  function handleChange(e) {
    let userInput = e.target.value
    setInput(marked.parse(userInput))
  }

  function handleLeftMenu() {
    setLeftMenu(!leftMenu)
  }

  function openNewDoc() {

  }

  function handleSaveDoc() {
    const date = new Date()
    setFile({
      title: title,
      content: input,
      date: `${date.getDate()} ${(date.getMonth() + 1)} ${date.getFullYear()}`
    })
    setAllFiles([...allFiles, file])
    localStorage.setItem("allFiles", JSON.stringify([...allFiles]))
  }

  function loadFile(index) {
    setEditing(true)
    inputRef.value = ""
    let selectedFile = allFiles[index]
    setTitle(selectedFile.title)
    setInput(selectedFile.content)
  }

  function handleTitleChange(e) {
    setTitle(e.target.value)
    console.log(title)
  }

  return (
    <>
      {
        leftMenu
          ? <LeftMenu openNewDoc={openNewDoc} allFiles={allFiles} loadFile={loadFile} />
          : ""
      }
      <div className="main-cont">
        <Header title={title} handleLeftMenu={handleLeftMenu} handleSaveDoc={handleSaveDoc} handleTitleChange={handleTitleChange} />
        <div className="text-contents">
          <div className="left-area">
            <UserInputArea inputRef={inputRef} handleChange={handleChange} input={input} isEditing={isEditing} />
          </div>
          <div className="right-area">
            <UserOutput input={input} />
          </div>
        </div>
      </div>

    </>
  )
}

function LeftMenu({ openNewDoc, allFiles, loadFile }) {

  return (
    <>
      <div className="left-menu-cont">
        <h2>My Documents</h2>
        <button className="add-new-btn" onClick={openNewDoc}>
          + New Document
        </button>
        <div className="documents-list">
          {
            allFiles.length
              ? allFiles.map((file, index) => {
                return <div onClick={() => loadFile(index)} className='file' key={index}>
                  <h3>{file.title}.md</h3>
                  <p>{file.date}</p>
                </div>
              })
              : "No files yet"
          }
        </div>
      </div>
    </>
  )
}

function Header({ title, handleLeftMenu, handleSaveDoc, handleTitleChange }) {

  return (
    <>
      <header>
        <button className="left-menu-btn header-btn" onClick={handleLeftMenu}>-</button>
        <h1>Markdown</h1>
        <div className="file-name">
          <p>Document name</p>
          <input className='file-name-input' onChange={handleTitleChange} defaultValue={`${title}.md`} />
        </div>
        <button className="delete-file-btn header-btn">Delete</button>
        <button onClick={handleSaveDoc} className="save-changes-btn header-btn">Save Changes</button>
      </header>
    </>
  )
}

function UserInputArea({ handleChange, input, inputRef, isEditing }) {

  return (
    <>
      <div className="user-input">
        <textarea ref={inputRef} name="" onChange={handleChange} defaultValue={isEditing ? input : ""}></textarea>
      </div>
    </>
  )
}

function UserOutput({ input }) {

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: input }} />
    </>
  )
}



export default App
