

let data = {}

  document.getElementById('button').addEventListener('click', async (req, res) => {
    console.log('working')
    const response = await fetch("https://api.quotable.io/random");
    data = await response.json();
    
   

    document.getElementById("quote").innerHTML = `<div>
      <h3 class="pt-3">${data.content}</h3>
      <hr>
      <h3 class="pt-2 pb-2"><i>${data.author}</i></h3>
    </div>`

    
    
  })
   





