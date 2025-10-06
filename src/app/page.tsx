onKeyDown={(e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault(); // always prevent
    handleGenerate();
  }
}}
