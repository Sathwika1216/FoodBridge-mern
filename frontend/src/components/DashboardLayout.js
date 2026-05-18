import { NavLink } from 'react-router-dom';

const DashboardLayout = ({ title, subtitle, links, children }) => (
  <div className="dashboard-layout">
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
        <p>{subtitle}</p>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <main className="dashboard-main">
      <div className="dashboard-header">
        <h1>{title}</h1>
      </div>
      {children}
    </main>
  </div>
);

export default DashboardLayout;
