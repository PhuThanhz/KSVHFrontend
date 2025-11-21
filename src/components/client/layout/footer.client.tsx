import { useState } from "react";
import ScannerModal from "@/components/scanner/ScannerModal";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [openScanner, setOpenScanner] = useState(false);

    return (
        <>
            <footer className="bg-gray-900 text-gray-300 border-t border-gray-700">

                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between">
                    <button
                        onClick={() => setOpenScanner(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                    >
                        Quét mã thiết bị
                    </button>

                    <p className="text-sm text-gray-400">
                        © {currentYear} Lotus Group. All rights reserved.
                    </p>
                </div>

                <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
            </footer>

            <ScannerModal open={openScanner} onClose={() => setOpenScanner(false)} />
        </>
    );
};

export default Footer;
