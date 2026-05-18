import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page container page-center not-found">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
