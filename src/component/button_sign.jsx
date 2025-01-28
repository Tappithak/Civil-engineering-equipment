'use client';
import * as React from 'react';


export default function Button({ children }) {

    return (
        <button className='bg-[#4d9fb6] w-full py-2 text-white rounded-md h-[70px] text-[32px] hover:bg-[#3497b3]'>
            {children}
        </button>
    );
}
