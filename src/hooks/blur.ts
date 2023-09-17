const blur = {
    add: (id: string = '.home', pointer: boolean = false) => {
      const ele = document.querySelector<HTMLElement>(id);
      if (ele) {
        ele.style.transition = '0.1s filter linear';
        ele.style.filter = 'blur(2.5px)';
        ele.style.webkitFilter = 'blur(2.5px)';
        if (pointer) {
          ele.style.pointerEvents = 'none';
        }
      }
    },
    remove: (id: string = '.home', pointer: boolean = false) => {
      const ele = document.querySelector<HTMLElement>(id);
      if (ele) {
        ele.style.filter = 'unset';
        ele.style.webkitFilter = 'unset';
        if (pointer) {
          ele.style.pointerEvents = 'unset';
        }
      }
    },
  };
  
  export { blur };
  