import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header.client';
import Footer from './footer.client';

const LayoutClient = () => {
    const location = useLocation();
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (rootRef.current) {
            rootRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

    return (
        <div className="layout-app" ref={rootRef}>
            <Header />
            <div >
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default LayoutClient;
