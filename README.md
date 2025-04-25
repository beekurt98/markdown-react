# Markdown Editor

A lightweight, elegant Markdown editor built with React that lets you create, edit, and preview Markdown documents in real-time.

## Features

- **Real-time Markdown Preview**: See your formatted text as you type
- **File Management**: Create, save, and delete markdown documents
- **Local Storage**: Your documents are automatically saved in your browser
- **Light/Dark Theme**: Toggle between light and dark modes for comfortable editing
- **Responsive Design**: Works on both desktop and mobile devices
- **File Organization**: Browse and manage multiple markdown documents

## Technologies Used

- React 
- Context API for state management
- Marked.js for Markdown parsing
- Local Storage API for document persistence
- Modern React patterns (hooks, context)
- CSS for styling

## Project Structure

```
markdown-editor/
├── public/
├── src/
│   ├── components/
│   │   ├── DeleteDialog.jsx      # Document deletion confirmation dialog
│   │   ├── Header.jsx            # Application header with controls
│   │   ├── LeftMenu.jsx          # Sidebar file browser
│   │   ├── UserInputArea.jsx     # Markdown text input area
│   │   └── UserOutput.jsx        # Rendered markdown preview
│   ├── App.css                   # Main application styles
│   ├── App.jsx                   # Main application with Context provider
│   ├── index.js                  # Entry point
│   └── initial-text.js          # Default welcome text
└── README.md
```

## Context API Usage

The application uses React's Context API for state management, avoiding prop drilling and keeping components clean and focused. The `MarkdownContext` provides:

- Document state (content, title, etc.)
- File management functions
- UI state (theme, visibility, etc.)
- Refs for DOM interactions

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/beekurt98/markdown-react.git
   cd markdown-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173/](http://localhost:5173/) in your browser.

## How to Use

### Creating a New Document
Click the "+ New Document" button in the sidebar to create a new markdown file.

### Editing Documents
Type your markdown in the left editor panel and see the formatted output in real-time on the right.

### Saving Documents
Click the "Save Changes" button in the header to save your current document.

### Managing Documents
- Toggle the sidebar using the hamburger menu
- Select documents from the sidebar to edit
- Rename documents by changing the title in the header
- Delete documents using the trash icon (with confirmation)

### Theme Switching
Toggle between light and dark themes using the switch at the bottom of the sidebar.

## Future Enhancements

- Export to PDF/HTML
- Custom themes