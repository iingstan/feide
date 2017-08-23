/**
 * code view
 */

if(highlight_extname == "Markdown"){
  $('#preview').html(markdown.toHTML($('#preview').html()))    
}
else{
  hljs.initHighlightingOnLoad();
}

