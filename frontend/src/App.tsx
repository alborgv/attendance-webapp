import './App.css'

import { BrowserRouter } from "react-router-dom"

import AppProviders from '@context/Providers'
import AppRoutes from '@routes/AppRoutes'

function App() {

  return (
    <>
      <BrowserRouter>
        <AppProviders>
          <AppRoutes/>
        </AppProviders>
      </BrowserRouter>
    </>
  )
}

export default App
