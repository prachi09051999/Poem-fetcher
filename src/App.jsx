import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [poems, setPoems] = useState([]);
  const [input, setInput] = useState();
  const [isOffline, setOffline] = useState(!navigator.onLine);
  const [isLoading, setLoading] = useState(false);
  const ref = useRef();
   async function fetchPoems(input){
    if(!input) return;
    setLoading(true);
     fetch(`https://poetrydb.org/lines/${input}`).then(res => {
      if(!res.ok) return;
      return res.json()
   }).then(data => {
    setPoems(data.slice(0,2))
   })
   .finally(()=>setLoading(false))
   }
  
   const inputHandler = (e) => {
    setInput(e.target.value);
    if(ref.current) return;
    ref.current = setTimeout(()=>{
      fetchPoems(e.target.value);
      ref.current = null;
    },1000);
   }

   useEffect(()=>{
    const handleOnLineState = () => setOffline(false);
    const handleOffLineState = () => setOffline(true);

    window.addEventListener('online', handleOnLineState);
    window.addEventListener('offline', handleOffLineState)

    return () => {
      window.removeEventListener('online');
      window.removeEventListener('offline');
    }

   },[])

  return (
    <>
      <h1>Poem App</h1>
      <p>Search Poems by Keywords</p>
      <input type="text" value={input} onChange={inputHandler}/>
      {isOffline && (
        <h3 style={{ color: 'orange' }}>
          ⚠️ Offline Mode — showing cached results (if available)
        </h3>
      )}      
      {isLoading ? <p>Loading...</p> : poems.map(poem => <p>{poem.lines}</p>)}
    </>
  )
}

export default App
