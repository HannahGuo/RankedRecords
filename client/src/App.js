import Login from "./Login"
import Dashboard from "./Dashboard"

const code =  new URLSearchParams(window.location.search).get("code")

function App() {
  // return code ? <Dashboard code={code}/> : <Login/>;
  return <>
    <Dashboard/>
  </>
}

export default App;
