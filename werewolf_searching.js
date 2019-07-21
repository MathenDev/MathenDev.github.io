onmessage = function(event) {
    console.log('Searching...');
    let data = event.data;
        setTimeout(function(){
            postMessage(data);
        }, 2000);
    
}

