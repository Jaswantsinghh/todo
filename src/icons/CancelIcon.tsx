import * as React from 'react';

function SvgComponent(props: any) {
  return (
    <svg
      width={8}
      height={8}
      viewBox="0 0 8 8"
      fill="none"
      {...props}
    >
      <path
        d="M7.905 7.446L4.459 4 7.905.554a.324.324 0 00-.459-.459L4 3.541.554.095a.324.324 0 10-.459.459L3.541 4 .095 7.446a.324.324 0 00.459.459L4 4.459l3.446 3.446a.324.324 0 00.459-.459z"
        fill="#666"
      />
    </svg>
  );
}

export default SvgComponent;
