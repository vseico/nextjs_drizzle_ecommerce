import React from 'react'
import Navbar from '../navbar/Navbar'
import Footer from '../ui/Footer'

const FrontedLayouts = ({children}:{children:React.ReactNode}) => {
  return (
    <>
        <Navbar/>
        <div className='mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8'>
            {children}
        </div>
        <Footer/>
    </>
  )
}

export default FrontedLayouts