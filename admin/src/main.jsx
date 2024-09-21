import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import { url } from "./assets/assets.js"
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App  url={url}/>
  </BrowserRouter>

)
