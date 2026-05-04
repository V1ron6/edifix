import {Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login.jsx'
import Test from './components/custom/test.jsx'


 const  App=()=> {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  )}

export default App