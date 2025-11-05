import { FaTools } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 border-t border-gray-700">

            {/* Bottom Bar */}
            <div className="border-t border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-white">
                            <FaTools className="text-blue-400 text-lg" />
                            <span className="text-sm font-semibold">Lotus Group Maintenance Tool</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
                            <p className="text-gray-400 text-center">
                                © {currentYear} Lotus Group. All rights reserved.
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                                <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                                    Privacy Policy
                                </a>
                                <span className="text-gray-700">|</span>
                                <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative gradient line */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
        </footer>
    );
};

export default Footer;