
import './App.css';
import {BrowserRouter as Router, Routes,Route,} from "react-router-dom";
import Department from './Components/Department';
import Student from './Components/Student';

function App() {
  return (
    
<div className="App">
<Router>
<Routes>

        <Route  path="/" element={<Department />} />
          <Route path="/Department" element={<Department />} />
          <Route path="/Students" element={<Student />} />       
          </Routes>
</Router>
 </div>
   
  );
}

export default App;