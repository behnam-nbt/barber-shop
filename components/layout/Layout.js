'use client'
import React, { useState } from 'react'
import Header from './Header'
import Footer from './Footer'

function Layout({ children }) {
    const [cartCount, setCartCount] = useState(0);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const childProps = { cartCount, setCartCount, favoriteCount ,setFavoriteCount  };
    return (
        <>
            <Header cartCount={cartCount} setCartCount={setCartCount} favoriteCount={favoriteCount} setFavoriteCount={setFavoriteCount} />
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