import React from 'react'
import { PuffLoader } from 'react-spinners'

const MainSpinner = () => {
  return (
    <div className='w-full h-[80vh] flex justify-center items-center overflow-hidden'>
      <PuffLoader color='#498fcd' size={80}/>
    </div>
  )
}

export default MainSpinner