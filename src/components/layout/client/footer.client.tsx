

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-6 flex justify-center">
                <p className="text-sm text-gray-400">
                    © {currentYear} Lotus Group. All rights reserved.
                </p>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
        </footer>
    );
};

export default Footer;
