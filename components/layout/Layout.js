'use client'
import React, { useState } from 'react'
import Header from './Header'
import Footer from './Footer'

function Layout({ children }) {
    const [cartCount, setCartCount] = useState(0);
    const childProps = { cartCount, setCartCount };
    return (
        <>
            <Header cartCount={cartCount} setCartCount={setCartCount} />
            <div className='min-h-screen'>
                {React.Children.map(children, (child) =>
                    React.isValidElement(child)
                        ? React.cloneElement(child, childProps)
                        : child
                )}
            </div>
            <Footer />
        </>
    )
}

export default Layout