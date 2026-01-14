import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaUserCircle } from 'react-icons/fa';
import elyonLogo from '@/assets/elyon_logo.png';
import { useAuth } from '@/context/AuthContext';
import { IoExitOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const { user, logoutUser } = useAuth();

    if (!user) return 'No user';

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logoutUser();
    };

    return (
        <nav className="bg-primary px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center ml-4 cursor-pointer">
                <img src={elyonLogo} alt="Elyon Logo" className="h-12" />
                <p className="ml-4 text-lg text-white font-semibold">ELYON YIREH</p>
            </Link>

            <div className="relative" ref={dropdownRef}><button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center bg-primary-200 backdrop-blur-md hover:cursor-pointer rounded-full pl-3 pr-4 py-2 text-white transition-all duration-300 ease-out"
            >
                <FaChevronDown className={`transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : 'mr-2 md:mr-0'}`} />

                <div className={`
                    flex flex-col text-left 
                    transition-all duration-500 ease-out
                    overflow-hidden
                    ${isDropdownOpen
                        ? 'max-w-40 opacity-100 ml-2 mr-2'
                        : 'max-w-0 opacity-0 md:max-w-40 md:opacity-100 md:ml-2 md:mr-2'
                    }
                `}>
                    <p className="font-semibold leading-none whitespace-nowrap text-ellipsis overflow-hidden">
                        {user.primer_nombre} {user.primer_apellido}
                    </p>
                    <p className="text-sm text-blue-100 whitespace-nowrap text-ellipsis overflow-hidden">
                        {user.role?.charAt(0).toUpperCase()}{user.role?.slice(1)}
                    </p>
                </div>

                <FaUserCircle size={32} />
            </button>

                    <div className={`
                        absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md 
                        rounded-md shadow-xl py-1 z-10 border border-gray-200
                        transition-all duration-500 ease-out
                        transform origin-top-right
                        ${isDropdownOpen
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 duration-400 -translate-y-4 pointer-events-none'
                            }
                        `}>
                        {/* <button
                            onClick={handlePasswordChange}
                            className="flex w-full items-center px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-transparent hover:text-blue-600 transition-all duration-250 ease-out border-l-2 border-transparent hover:border-blue-400"
                        >
                            <IoKeyOutline size={18} className="mr-3 transition-all duration-300 group-hover:rotate-12" />
                            Cambiar contraseña
                        </button>
                        <div className="border-t border-gray-100 my-1"></div> */}
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-linear-to-r hover:from-red-50 hover:to-transparent hover:text-red-600 transition-all duration-250 ease-out border-l-2 border-transparent hover:border-red-400"
                        >
                            <IoExitOutline size={18} className="mr-3 transition-all duration-300 group-hover:rotate-12" />
                            Cerrar sesión
                        </button>
                    </div>
            </div>
        </nav>
    );
};

export default Navbar;