const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article')
    fetch(`/admin/delete-product/${prodId}` , {
        method: 'DELETE',
        headers : {
            'csrf-token' : csrf
        }
    }).then(result => {
        // console.log(result.status);
        return result.json(); //this to return message send via request from backend 'success!'
    }).then(resultSuccess => {
        console.log(resultSuccess); 
        productElement.parentNode.removeChild(productElement);
    })
    .catch(err => console.log(err));
};