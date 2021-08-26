import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouComponent = () => {
    return (
        <>
            <p style={{ fontSize: '40px' }}>Llamada terminada.</p>
            <div style={{ textAlign: 'center' }}>
                <Link to="/">Conectar de nuevo</Link>
                <span>Nota: controlando evento</span>
            </div>
        </>
    );
}

export default ThankYouComponent;
