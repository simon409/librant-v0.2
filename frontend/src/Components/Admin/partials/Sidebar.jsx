import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import librantLogo from '../../../assets/img/logo.png';
import Transition from '../utils/Transition';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const [hovered, sethovered] = useState(false)

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        onMouseOver={() => sethovered(true)}
        onMouseLeave={() => sethovered(false)}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-100 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        } ${hovered ? 'lg:w-64' : 'lg:w-20'}`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-900 hover:text-slate-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end="true" to="/" className="flex">
            <img src={librantLogo} className="w-14" alt="" />
            <span className="text-black font-bold text-3xl my-auto pl-5">Librant</span>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-800 font-semibold pl-3">
                <span className={`hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6 ${hovered ? 'lg:hidden' : 'lg:block'}`} aria-hidden="true">
                  •••
                </span>
              <span className={`lg:sidebar-expanded:block 2xl:block ${hovered ? 'lg:block' : 'lg:hidden'}`}>Pages</span>
            </h3>
            <ul className="mt-3">
              {/* Messages */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('messages') && 'bg-slate-900'}`}>
                <NavLink
                  end="true"
                  to="/dashboard"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('messages') ? 'hover:text-slate-800' : 'hover:text-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path
                          className={`fill-current ${
                            pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-500' : 'text-slate-400'
                          }`}
                          d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                        />
                        <path
                          className={`fill-current ${
                            pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-600' : 'text-slate-600'
                          }`}
                          d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                        />
                        <path
                          className={`fill-current ${
                            pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                          d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                        />
                      </svg>
                      <span className={`text-sm text-black font-medium ml-3 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                        Dashboard
                      </span>
                    </div>
                  </div>
                </NavLink>
              </li>
              {/* Books */}
              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('ecommerce') ? 'hover:text-slate-200' : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                          <svg className=' shrink-0 h-6 w-6' viewBox="0 0 24 24">
                            <defs>
                              <clipPath id="b">
                                <rect width="24" height="24"/>
                              </clipPath>
                            </defs>
                            <g id="a" clipPath="url(#b)">
                              <rect className={`fill-current ${pathname.includes('showbooks') ? 'text-indigo-300' : 'text-slate-400'}`} width="16" height="16" rx="1" transform="translate(5 6)"/>
                              <rect className={`fill-current ${pathname.includes('showbooks') ? 'text-indigo-500' : 'text-slate-600'}`} width="16" height="16" rx="1" transform="translate(3 4)"/>
                              <path className={`fill-current ${pathname.includes('showbooks') ? 'text-indigo-600' : 'text-slate-700'}`} d="M0,0H6A0,0,0,0,1,6,0V9a1,1,0,0,1-1,1H1A1,1,0,0,1,0,9V0A0,0,0,0,1,0,0Z" transform="translate(11 4)"/>
                              <path className={`fill-current ${pathname.includes('showbooks') ? 'text-indigo-600' : 'text-slate-700'}`} d="M12.48,14s.251.124.66-.3a2.291,2.291,0,0,0,.528-1.024s.239-1.057.5-1.057.5.693.5.693a4.079,4.079,0,0,0,.462,1.222c.3.421.429.462.429.462v.924s-2.08.66-2.179.693A11.1,11.1,0,0,1,12.48,14Z"/>
                              </g>
                          </svg>
                            <span className={`text-sm text-black font-medium ml-3 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                              Books
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className={`lg:sidebar-expanded:block 2xl:block ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/showbooks"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                              }
                            >
                              <span className={`text-sm text-black font-medium lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                                Show Books
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/books/category"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                              }
                            >
                              <span className={`text-sm text-black font-medium lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                                Show Categories
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* Docs */}
              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('ecommerce') ? 'hover:text-slate-200' : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                          <svg className=' shrink-0 h-6 w-6' viewBox="0 0 24 24">
                          <path className={`fill-current ${pathname.includes('showdocs') || pathname.includes('adddocs') ? 'text-indigo-300' : 'text-slate-400'}`} id="Icon_ionic-md-document" data-name="Icon ionic-md-document" d="M15.877,3.375H8.651a1.9,1.9,0,0,0-1.9,1.9V21.248a1.9,1.9,0,0,0,1.9,1.9H20.06a1.9,1.9,0,0,0,1.9-1.9V9.459Zm-.761,6.845V4.9L20.44,10.22Z" transform="translate(-6.75 -2.375)"/>
                          <path className={`fill-current ${pathname.includes('showdocs') || pathname.includes('adddocs') ? 'text-indigo-500' : 'text-slate-600'}`} id="Icon_ionic-md-document-2" data-name="Icon ionic-md-document" d="M15.877,3.375H8.651a1.9,1.9,0,0,0-1.9,1.9V21.248a1.9,1.9,0,0,0,1.9,1.9H20.06a1.9,1.9,0,0,0,1.9-1.9V9.459Zm-.761,6.845V4.9L20.44,10.22Z" transform="translate(-5.75 -3.375)"/>
                          <path className={`fill-current ${pathname.includes('showdocs') || pathname.includes('adddocs') ? 'text-indigo-600' : 'text-slate-700'}`} id="Path_1" data-name="Path 1" d="M12.745,3.609V9.016h5.4Z" transform="translate(-3.395 -2.113)" fill="#4f46e5"/>
                          <path id="Icon_awesome-bars" data-name="Icon awesome-bars" d="M.276,5.462H7.458a.276.276,0,0,0,.276-.276V4.495a.276.276,0,0,0-.276-.276H.276A.276.276,0,0,0,0,4.495v.691A.276.276,0,0,0,.276,5.462Zm0,2.762H7.458a.276.276,0,0,0,.276-.276V7.257a.276.276,0,0,0-.276-.276H.276A.276.276,0,0,0,0,7.257v.691A.276.276,0,0,0,.276,8.224Zm0,2.762H7.458a.276.276,0,0,0,.276-.276v-.691a.276.276,0,0,0-.276-.276H.276A.276.276,0,0,0,0,10.019v.691A.276.276,0,0,0,.276,10.986Z" transform="translate(4.738 4.995)" fill="#fff"/>
                            
                          </svg>
                            <span className={`text-sm text-black font-medium ml-3 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                              Documents
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className={`lg:sidebar-expanded:block 2xl:block ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/showdocs"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                              }
                            >
                              <span className={`text-sm text-black font-medium lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                                Show Documents
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/docs/category"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                              }
                            >
                              <span className={`text-sm text-black font-medium lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                                Show Categories
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* Messages */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('messages') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/messages"
                  className={`block text-slate-900 truncate transition duration-150 ${
                    pathname.includes('campaigns') ? 'hover:text-slate-800' : 'hover:text-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path
                          className={`fill-current ${pathname.includes('messages') ? 'text-indigo-500' : 'text-slate-600'}`}
                          d="M14.5 7c4.695 0 8.5 3.184 8.5 7.111 0 1.597-.638 3.067-1.7 4.253V23l-4.108-2.148a10 10 0 01-2.692.37c-4.695 0-8.5-3.184-8.5-7.11C6 10.183 9.805 7 14.5 7z"
                        />
                        <path
                          className={`fill-current ${pathname.includes('messages') ? 'text-indigo-300' : 'text-slate-400'}`}
                          d="M11 1C5.477 1 1 4.582 1 9c0 1.797.75 3.45 2 4.785V19l4.833-2.416C8.829 16.85 9.892 17 11 17c5.523 0 10-3.582 10-8s-4.477-8-10-8z"
                        />
                      </svg>
                      <span className={`text-sm text-black font-medium ml-3 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                        Messages
                      </span>
                    </div>
                    {/* Badge */}
                    <div className="flex flex-shrink-0 ml-2">
                      <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-indigo-500 px-2 rounded">4</span>
                    </div>
                  </div>
                </NavLink>
              </li>
              
              {/* Calendar */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('calendar') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/calendar"
                  className={`block text-slate-900 truncate transition duration-150 ${
                    pathname.includes('campaigns') ? 'hover:text-slate-800' : 'hover:text-black'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                      <path className={`fill-current ${pathname.includes('calendar') ? 'text-indigo-500' : 'text-slate-600'}`} d="M1 3h22v20H1z" />
                      <path
                        className={`fill-current ${pathname.includes('calendar') ? 'text-indigo-300' : 'text-slate-400'}`}
                        d="M21 3h2v4H1V3h2V1h4v2h10V1h4v2Z"
                      />
                    </svg>
                    <span className={`text-sm text-black font-medium ml-3 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                      Calendar
                    </span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
