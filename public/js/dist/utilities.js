function collapsible() {
  var coll = document.getElementsByClassName("collapsible-date");
  console.log(coll)
  coll[0].addEventListener("click", function(e) {
    this.classList.toggle("active");
    let content = document.querySelectorAll('.controlbox-content')
    for (let i = 0; i < content.length; i++) {
      if (content[i].style.display === "block") {
        document.querySelector('.controlbox-container').style.height = 173+'px'
        content[i].style.display = "none";
        if(document.querySelector('#item-6')) {
          document.querySelector('#item-6').style.top = '170px'
        }
      } else {
        document.querySelector('.controlbox-container').style.height = 350+'px'
        content[i].style.display = "block";
        if(document.querySelector('#item-6')) {
          document.querySelector('#item-6').style.top = '350px'
        }
      }
    }
  });

}

function addClass(){
    let parent = this.parentNode.parentNode
    parent.classList.add("focus")
}

function removeClass(){
    let parent = this.parentNode.parentNode
    if(this.value == ""){
        parent.classList.remove("focus")
    }
}

document.addEventListener('DOMContetnLoaded', () => {
  let inputs = document.querySelectorAll(".input")

  inputs.forEach(input => {
      input.addEventListener("focus", addClass)
      input.addEventListener("blur", removeClass)
  });
})
