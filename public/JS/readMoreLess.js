var x = document.getElementsByClassName("product__description");
var isContentToggled = [];

for (var length = 0; length < x.length; length++ ){
   const id = x[length].getAttribute('id');
   const desciptionNonEdit = x[length].getAttribute('value');

    isContentToggled.push([id , false, desciptionNonEdit]);    
    
    const limit = desciptionNonEdit.substr(0, 100).lastIndexOf(' ');

   if(limit < 0 || desciptionNonEdit.length < 100){
       document.getElementById(`M${id}`).remove();
   }else{
    x[length].innerHTML = x[length].getAttribute('value').substr(0, limit);
   }
    };

   function toggleContent(id){
      var elementText = document.getElementById(id);
      const desciptionNonEdit = isContentToggled[matrixIndexed(isContentToggled,id)][2];

    isContentToggled[matrixIndexed(isContentToggled,id)][1] = !isContentToggled[matrixIndexed(isContentToggled,id)][1];
    limit = desciptionNonEdit.substr(0, 100).lastIndexOf(' ');

    if(isContentToggled[matrixIndexed(isContentToggled,id)][1]){
      anchorChange = document.getElementById(`M${id}`).innerHTML = 'Read Less';
      elementText.innerHTML = desciptionNonEdit;
    }else{
      anchorChange = document.getElementById(`M${id}`).innerHTML = '...Read More';
      elementText.innerHTML = desciptionNonEdit.substr(0, limit);
    }
}


function matrixIndexed(details, name) {
    var r;
    var c;
    for (r = 0; r < details.length; ++r) {
       const nsDetails = details[r];
       for (c = 0; c < nsDetails.length; ++c) {
          const tempObject = nsDetails[c];
          if (tempObject === name) {
             return r;
          }
       }
    }
    return {};
 }