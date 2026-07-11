import type React from 'react';
import type { ReactElement } from 'react';

export default function Logo(props: React.ComponentProps<'div'>): ReactElement {
  return (
    <div {...props}>
      <svg
        width="56"
        height="56"
        viewBox="-100 -100 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#E8650A">
          <polygon points="0,-72 -22,-30 0,-18 22,-30" transform="rotate(0)" />
          <polygon points="0,-72 -22,-30 0,-18 22,-30" transform="rotate(45)" />
          <polygon points="0,-72 -22,-30 0,-18 22,-30" transform="rotate(90)" />
          <polygon
            points="0,-72 -22,-30 0,-18 22,-30"
            transform="rotate(135)"
          />
          <polygon
            points="0,-72 -22,-30 0,-18 22,-30"
            transform="rotate(180)"
          />
          <polygon
            points="0,-72 -22,-30 0,-18 22,-30"
            transform="rotate(225)"
          />
          <polygon
            points="0,-72 -22,-30 0,-18 22,-30"
            transform="rotate(270)"
          />
          <polygon
            points="0,-72 -22,-30 0,-18 22,-30"
            transform="rotate(315)"
          />
        </g>
      </svg>
    </div>
  );
}
