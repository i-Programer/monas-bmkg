// resources/js/components/Sidebar.jsx
import React from 'react';
// import { Link } from 'react-router-dom';

const Sidebar = () => (
    <aside className="w-64 bg-gray-800 text-white">
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/stations">Stations</a></li>
            </ul>
        </nav>
    </aside>
);

export default Sidebar;
