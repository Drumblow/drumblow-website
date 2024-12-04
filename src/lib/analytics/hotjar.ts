export const initHotjar = () => {
    const hjid = process.env.NEXT_PUBLIC_HOTJAR_ID
    const hjsv = process.env.NEXT_PUBLIC_HOTJAR_SNIPPET_VERSION
  
    if (!hjid || !hjsv) return
  
    ;(function(h: any,o: any,t: any,j: any,a?: any,r?: any){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid,hjsv};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')
  }