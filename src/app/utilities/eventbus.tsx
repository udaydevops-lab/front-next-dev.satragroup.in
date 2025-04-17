const eventBus = {
    on(event: string, callback: (data: any) => void) {

      document.addEventListener(event, (e) => {
        if(e instanceof CustomEvent) {
            callback(e.detail);
        }
      });

    },
    dispatch(event: string, data: any) {
      console.log(event, data);
      document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
    remove(event: string, callback: (data: any) => void) {
      document.removeEventListener(event, callback);
    },
};
  
export default eventBus;