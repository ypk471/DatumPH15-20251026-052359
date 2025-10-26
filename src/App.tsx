import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
function App() {
  return (
    <>
      <ThemeToggle />
      <Outlet />
    </>
  );
}
export default App;