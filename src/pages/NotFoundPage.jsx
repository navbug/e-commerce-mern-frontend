import React from 'react'
import { TbError404 } from "react-icons/tb";

const NotFoundPage = () => {
  return (
    <div className='w-full h-[80vh] bg-green-50'>
      <div className='flex flex-col justify-center items-center pt-16'>
        <TbError404 size={150} className='text-green-800' />
        <h1 className="text-green-800 font-bold text-2xl pb-6">
          Page Not Found
        </h1>
      </div>
    </div>
  )
}

export default NotFoundPage