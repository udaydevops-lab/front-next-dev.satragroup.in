import React, { useState, useEffect } from 'react';

function Toast(props:any) {
  const [visible, setVisible] = useState(props.show);

  useEffect(() => {
    setVisible(props.show);
  }, [props.show]);

  const closeToast = () => {
    setVisible(false);
    props.onClose();
  };

  return (
    visible && (
      <div style={{backgroundColor:`${props.color}`}}>
      <div className="fixed top-0 right-0 m-4 p-2 text-white rounded shadow-md">
        <div className="flex justify-between">
          <p>{props.message}</p>
          <button onClick={closeToast} className="ml-2">
            X
          </button>
        </div>
      </div>
      </div>
    )
  );
};

export default Toast;
