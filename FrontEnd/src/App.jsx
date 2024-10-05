import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { NavBar } from "./components/NavBar"
import { Index } from './components/Index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer';

function App() {

  return (
    <>
      <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
          <Footer />
        </BrowserRouter>
    </>
  )
}

export default App
