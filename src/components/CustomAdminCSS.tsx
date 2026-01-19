const CustomAdminCSS = () => (
  <style>{`
    /* Replace Payload logo with custom Amua Apps logo */
    nav a[href="/admin"] img,
    nav a[href="/admin"] svg {
      content: url('/logo.svg');
      max-height: 40px;
      width: auto;
    }
    
    /* Collapsed nav icon */
    nav.nav--collapsed a[href="/admin"] img,
    nav.nav--collapsed a[href="/admin"] svg {
      content: url('/icon.svg');
      max-height: 32px;
      max-width: 32px;
    }
  `}</style>
);

export default CustomAdminCSS;
