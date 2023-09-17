import * as React from 'react';

function SvgComponent(props: any) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g>
        <path
          d="M23.271 9.42a15.867 15.867 0 00-3.37-3.91l2.8-2.8a1 1 0 00-1.415-1.414l-3.045 3.05a12.054 12.054 0 00-6.24-1.69c-6.192 0-9.72 4.237-11.272 6.763a4.908 4.908 0 000 5.162 15.866 15.866 0 003.371 3.91l-2.8 2.8a1 1 0 101.414 1.413l3.052-3.052A12.055 12.055 0 0012 21.345c6.191 0 9.72-4.238 11.271-6.764a4.908 4.908 0 000-5.162zM2.433 13.533a2.918 2.918 0 010-3.068C3.767 8.3 6.783 4.656 12 4.656a10.1 10.1 0 014.766 1.164l-2.013 2.013a4.992 4.992 0 00-6.92 6.92l-2.31 2.31a13.724 13.724 0 01-3.09-3.529zM15 12a3 3 0 01-3 3 2.95 2.95 0 01-1.285-.3l3.985-3.985c.196.4.298.84.3 1.285zm-6 0a3 3 0 013-3c.445.002.885.104 1.285.3L9.3 13.285c-.196-.4-.298-.84-.3-1.285zm12.567 1.534C20.233 15.7 17.218 19.345 12 19.345a10.1 10.1 0 01-4.766-1.165l2.013-2.013a4.992 4.992 0 006.92-6.92l2.31-2.31c1.225.99 2.27 2.184 3.09 3.53a2.918 2.918 0 010 3.067z"
          fill="#999"
        />
      </g>
    </svg>
  );
}

export default SvgComponent;
