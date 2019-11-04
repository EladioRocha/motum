function collapsible() {
  var coll = document.getElementsByClassName("collapsible-date");
  // document.querySelector('.controlbox-container').style.height = 300+'px'

  coll[0].addEventListener("click", function(e) {
    this.classList.toggle("active");
    let content = document.querySelectorAll('.controlbox-content')
    for (let i = 0; i < content.length; i++) {
      document.querySelector('.controlbox-container').style.height = 350+'px'
      if (content[i].style.display === "block") {
        document.querySelector('.controlbox-container').style.height = 173+'px'
        content[i].style.display = "none";
      } else {
        content[i].style.display = "block";
      }
    }

  });
}

let inputs = document.querySelectorAll(".input")

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


inputs.forEach(input => {
    input.addEventListener("focus", addClass)
    input.addEventListener("blur", removeClass)
});