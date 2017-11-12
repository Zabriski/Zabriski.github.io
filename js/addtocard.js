jQuery(document).ready(function($){

	var	input = $('#form input.message');
	var	submit = $('#form input.submit');
	
	$('.cd-gallery li.mix').each(function() {
		var atc = $(this).find('.cd-add-to-cart'),
			productName = $(this).find('.p-name').html(),
			productName = productName.replace(/ /g, ""),
			productImg = $(this).find('img').attr("src"),
			productPrice = $(this).find('.p-price').html();
		atc.attr("data-name",productName).attr("data-img",productImg).attr("data-price",productPrice);
	});

	var cartWrapper = $('.cd-cart-container');
	//product id - you don't need a counter in your real project but you can use your real product id
	var productId = 0;

	if( cartWrapper.length > 0 ) {
		//store jQuery objects
		var cartBody = cartWrapper.find('.body')
		var cartList = cartBody.find('ul').eq(0);
		var cartTotal = cartWrapper.find('.checkout').find('span');
		var cartTrigger = cartWrapper.children('.cd-cart-trigger');
		var cartCount = cartTrigger.children('.count')
		var addToCartBtn = $('.cd-add-to-cart');
		var undo = cartWrapper.find('.undo');
		var undoTimeoutId;

		//add product to cart
		addToCartBtn.each(function(){
			$(this).on('click', function(event){
				event.preventDefault();
				addToCart($(this));
			});
		});

		//open/close cart
		cartTrigger.on('click', function(event){
			event.preventDefault();
			toggleCart();
		});

		//close cart when clicking on the .cd-cart-container::before (bg layer)
		cartWrapper.on('click', function(event){
			if( $(event.target).is($(this)) ) toggleCart(true);
		});

		//delete an item from the cart
		cartList.on('click', '.delete-item', function(event){
			event.preventDefault();
			removeProduct($(event.target).parents('.product'));
		});

		//update item quantity
		cartList.on('change', 'select', function(event){
			quickUpdateCart();
		});

		//reinsert item deleted from the cart
		undo.on('click', 'a', function(event){
			clearInterval(undoTimeoutId);
			event.preventDefault();
			cartList.find('.deleted').addClass('undo-deleted').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				$(this).off('webkitAnimationEnd oanimationend msAnimationEnd animationend').removeClass('deleted undo-deleted').removeAttr('style');
				quickUpdateCart();
			});
			undo.removeClass('visible');
		});
	}

	function toggleCart(bool) {
		var cartIsOpen = ( typeof bool === 'undefined' ) ? cartWrapper.hasClass('cart-open') : bool;
		
		if( cartIsOpen ) {
			cartWrapper.removeClass('cart-open');
			//reset undo
			clearInterval(undoTimeoutId);
			undo.removeClass('visible');
			cartList.find('.deleted').remove();

			setTimeout(function(){
				cartBody.scrollTop(0);
				//check if cart empty to hide it
				if( Number(cartCount.find('li').eq(0).text()) == 0) cartWrapper.addClass('empty');
			}, 500);
		} else {
			cartWrapper.addClass('cart-open');
		}
	}

	function addToCart(trigger) {
		var price = trigger.data('price'),
			name = trigger.data('name'),
			img = trigger.data('img'),
			s = trigger.parent().find("select"),
			opt = [];
		for(i=0;i<s.length;i++) {
			var v = $(s[i]).val();
			if(v != null) {
				opt.push(v);
			}
		}
		trigger.data('option',opt);
					if( opt.length < 3 )
					{
						alert("Veuillez sélectionner la Nature, le Talent et la Ball désiré !");
						return false;
					}
		var choix = trigger.data('option');
		var cartIsEmpty = cartWrapper.hasClass('empty');
		//update cart product list
		productId = productId + 1;
		var productAdded = $('<li class="product '+name+'"><div class="product-image"><img src="'+img+'" alt="placeholder"></div><div class="product-details"><h3><a href="#0">'+name+'</a></h3><span class="price">'+price+'</span><div class="actions recap">'+choix.join(' - ')+'</div><div class="actions"><a href="#0" class="delete-item">Supprimer</a><div class="quantity"><label for="cd-product-'+ productId +'">Quantité :</label><span class="select"><select id="cd-product-'+ productId +'" name="quantity"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></span></div></div></div></li>');
		if($("li."+name).length){
			var qty = $("li."+name).find('.quantity').find('select');
			if(qty.val() == 1) {alert("Pas plus d'un exemplaire de chaque pokémon !");} // val max exemplaire possible
			else{
				qty.val((Number(qty.val()) + 1));
				updateCartCount(cartIsEmpty);
				updateCartTotal(price, true);
			}
		}
		else {
			cartList.prepend(productAdded);
			//update number of items 
			updateCartCount(cartIsEmpty);
			//update total price
			updateCartTotal(price, true);
		};
		//show cart
		cartWrapper.removeClass('empty');
	}



	function removeProduct(product) {
		clearInterval(undoTimeoutId);
		cartList.find('.deleted').remove();
		
		var topPosition = product.offset().top - cartBody.children('ul').offset().top ,
			productQuantity = Number(product.find('.quantity').find('select').val()),
			productTotPrice = Number(product.find('.price').text().replace('$', '')) * productQuantity;
		
		product.css('top', topPosition+'px').addClass('deleted');

		//update items count + total price
		updateCartTotal(productTotPrice, false);
		updateCartCount(true, -productQuantity);
		undo.addClass('visible');

		//wait 8sec before completely remove the item
		undoTimeoutId = setTimeout(function(){
			undo.removeClass('visible');
			cartList.find('.deleted').remove();
		}, 8000);
	}

	function quickUpdateCart() {
		var quantity = 0;
		var price = 0;
		
		cartList.children('li:not(.deleted)').each(function(){
			var singleQuantity = Number($(this).find('select').val());
			quantity = quantity + singleQuantity;
			price = price + singleQuantity*Number($(this).find('.price').text().replace('$', ''));
			if( Number($('.u_money').text()) < price) {$('.checkout.btn').addClass("blocked");}
			else {if($('.checkout.btn').hasClass("blocked")){$('.checkout.btn').removeClass("blocked");}}
		});

		cartTotal.text(price);
		cartCount.find('li').eq(0).text(quantity);
		cartCount.find('li').eq(1).text(quantity+1);
	}

	function updateCartCount(emptyCart, quantity) {
		if( typeof quantity === 'undefined' ) {
			var actual = Number(cartCount.find('li').eq(0).text()) + 1;
			var next = actual + 1;
			
			if( emptyCart ) {
				cartCount.find('li').eq(0).text(actual);
				cartCount.find('li').eq(1).text(next);
			} else {
				cartCount.addClass('update-count');

				setTimeout(function() {
					cartCount.find('li').eq(0).text(actual);
				}, 150);

				setTimeout(function() {
					cartCount.removeClass('update-count');
				}, 200);

				setTimeout(function() {
					cartCount.find('li').eq(1).text(next);
				}, 230);
			}
		} else {
			var actual = Number(cartCount.find('li').eq(0).text()) + quantity;
			var next = actual + 1;
			
			cartCount.find('li').eq(0).text(actual);
			cartCount.find('li').eq(1).text(next);
		}
	}

	function updateCartTotal(price, bool) {
		bool ? cartTotal.text( (Number(cartTotal.text()) + Number(price)) )  : cartTotal.text( (Number(cartTotal.text()) - Number(price)) );
		if( Number($('.u_money').text()) < Number(cartTotal.text())) {$('.checkout.btn').addClass("blocked");}
		else {if($('.checkout.btn').hasClass("blocked")){$('.checkout.btn').removeClass("blocked");}}
	}
	$('.checkout.btn').on('click', function() {
	if($(this).hasClass("blocked")) {
		alert("Vous n'avez pas assez d'argent !");
	} 
	else {
	if(cartTotal.text() == 0) {
		alert("Votre panier est vide !");
	} else{
	var a=[];
		$('.product:not(.deleted)').each(function(){
			var dre = "<li><b>"+$(this).find('h3 > a').html()+"</b> "+$(this).find('.recap').html()+" <span>"+$(this).find('.price').text() * $(this).find('.quantity').find('select').val()+"</span></li>";
			a.push(dre);
		});
	// quantité affichées dans msg : <span>x"+$(this).find('.quantity').find('select').val()+"</span>
	a=a.join('\n');
	var solde = Number($('.u_money').text()-cartTotal.text());
	var msg = "<div class='mart-receipt'><h1>Pokémart</h1><h2>Certificat d'achat</h2><div class='client-info'>"+$('.cd-client-info').text()+"</div><ul>"+a+"</ul><div class='client-total'>Total payé : <span>"+cartTotal.text()+"</span></div><div class='client-solde'>Compte après paiement : <span>"+solde+"</span></div></div> #pokemart";
	input.val(msg);
	console.log(input.val());
	submit.trigger('click');
	}}
	});
});