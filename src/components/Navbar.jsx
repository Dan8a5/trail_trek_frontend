import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-neutral text-neutral-content w-full">
      <div className="navbar-start">
        <button onClick={() => navigate('/')} className="btn btn-ghost normal-case text-xl">Trail Trek</button>
      </div>
      <div className="navbar-center">
        <button onClick={() => navigate('/parks')} className="btn btn-ghost">Parks</button>
        <button onClick={() => navigate('/itineraries')} className="btn btn-ghost">Itineraries</button>
      </div>
      <div className="navbar-end">
        <button onClick={() => navigate('/login')} className="btn btn-primary">Login</button>
      </div>
    </div>
  );
};

export default Navbar;