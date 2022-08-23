import React from 'react';

export default function MessageBox(props) {
  return (
    <div className={props.variant || 'bg3 text-dark py-3 rounded-3'}>
      <span className="ms-3">{props.children}</span>
    </div>
  );
}
