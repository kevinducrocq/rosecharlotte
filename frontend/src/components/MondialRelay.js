import React, { useEffect } from 'react';
import $ from 'jquery';
import { Button, Image } from 'react-bootstrap';

export default function MondialRelay() {
  useEffect(() => {
    const scriptMr = document.createElement('script');
    scriptMr.src =
      'https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js';
    scriptMr.async = 'true';

    document.body.appendChild(scriptMr);

    return () => {
      document.body.removeChild(scriptMr);
    };
  });

  const call = () => {
    try {
      $('#Zone_Widget').MR_ParcelShopPicker({
        Target: '#ParcelShopCode',
        Brand: 'BDTEST  ',
        Country: 'FR',
      });
    } catch (err) {
      console.log(`err`, err);
    }
  };

  (function () {
    try {
      call();
    } catch (err) {
      console.log(`err`, err);
    }
  })();

  return (
    <div>
      <Button
        className="bg2 text-light w-100 p-4 mb-2"
        variant="outline-secondary"
        onClick={call}
      >
        <h6>À domicile</h6>
        <Image src="../mondialrelay.png" width="79" />
      </Button>
    </div>
  );
}
