import './App.css'
import { RouterProvider} from "react-router-dom";
import {router} from "src/router.tsx";

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
