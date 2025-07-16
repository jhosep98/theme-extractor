import type * as React from 'react'

const Popup: React.FC = () => (
  <div className='p-2.5 h-[400px] w-[400px] flex flex-col justify-between relative bg-gray-800'>
    <h1 className='text-lg m-0 color-white pb-2 border-b border-gray-200 flex items-center gap-3 text-center justify-center text-white'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='1.2em'
        height='1.2em'
        viewBox='0 0 64 64'
        role='img'
        aria-label='Theme Icon'
      >
        <path
          fill='#f6c799'
          d='M49.6 23.6C58.4 8.5 40.3-1.3 17.3 9.2C3.2 15.7-6.6 35.7 13 52.9c13.9 12.2 49 5.3 49-8.7c0-15.5-21.7-4.8-12.4-20.6m4.9 24.6c-2.8 2.4-7.2 2.4-10 0s-2.8-4.5 0-6.9s7.2-2.4 10 0s2.7 4.5 0 6.9'
        />
        <path
          fill='#2caece'
          d='M33.2 45.1c-3.1-2.4-8-2.4-11.1 0s-3.1 6.2 0 8.6s8 2.4 11.1 0c3-2.4 3-6.3 0-8.6'
        />
        <path
          fill='#fdf516'
          d='M19.6 33.6c-3.4-1.6-8-.6-10.4 2.3S7.6 42.4 11 44s8 .6 10.4-2.3s1.6-6.5-1.8-8.1'
        />
        <path
          fill='#f55'
          d='M17 20.6c-2.9-1.6-7.2-.9-9.4 1.6c-2.3 2.5-1.7 5.8 1.2 7.3c2.9 1.6 7.2.9 9.4-1.6s1.7-5.7-1.2-7.3'
        />
        <path
          fill='#83bf4f'
          d='M28.4 10.8c-2.8-1.6-6.9-1-9.1 1.4s-1.8 5.5 1.1 7.1c2.8 1.6 6.9 1 9.1-1.4s1.7-5.6-1.1-7.1'
        />
        <path
          fill='#9156b7'
          d='M44.7 9.7c-2.2-1.8-5.9-2.2-8.5-1c-2.5 1.2-2.8 3.7-.6 5.5s5.9 2.2 8.5 1c2.5-1.3 2.7-3.7.6-5.5'
        />
        <path
          fill='#947151'
          d='M40 42.1c-1.9 2.1-11.5 4-11.5 4s3.8-3.5 5.5-9.2c.8-2.7 4.7-2.7 6.4-1.2c1.7 1.4 1.5 4.3-.4 6.4'
        />
        <path
          fill='#666'
          d='M58.7 12.3c1-.1 2.9 1.6 3 2.5C62 19.1 44 34.5 44 34.5L41 32s13.3-19.4 17.7-19.7'
        />
        <path fill='#ccc' d='m38.4 34.9l3 2.5l2.6-2.9l-3-2.5z' />
      </svg>
      Theme Extractor
    </h1>

    <div className='flex-1 flex flex-col justify-between overflow-auto h-full'>
      <div className='border border-gray-200 rounded-md p-2 relative h-full overflow-auto flex-1 my-3 bg-gray-800'>
        <code
          id='result'
          className='text-white overflow-auto text-sm p-2.5 whitespace-pre-wrap font-mono'
        />
      </div>

      <div className='flex justify-end items-center'>
        <button
          type='button'
          onClick={() => {
            console.log('Copy clicked from popup')
          }}
          id='copy'
          className='bg-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-300 transition-colors inline-flex gap-2 items-center text-base'
          aria-label='Copy to clipboard'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1.2em'
            height='1.2em'
            viewBox='0 0 16 16'
            role='img'
            aria-label='Copy to clipboard'
          >
            <path
              fill='currentColor'
              d='M4 4.085V10.5a2.5 2.5 0 0 0 2.336 2.495L6.5 13h4.414A1.5 1.5 0 0 1 9.5 14H6a3 3 0 0 1-3-3V5.5a1.5 1.5 0 0 1 1-1.415M11.5 2A1.5 1.5 0 0 1 13 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 5 10.5v-7A1.5 1.5 0 0 1 6.5 2zm0 1h-5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5'
            />
          </svg>
          Copy to clipboard
        </button>
      </div>
    </div>
  </div>
)

export default Popup
