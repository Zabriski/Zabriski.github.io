var Dispo = [
{"name": "Monorpale",
"version":"1",
"tier": "ou",
"id": "679",
"price": "500",
"EM": ["- Garde Large","- Ombre Portée","- Lame Sainte","- Tête de Fer"],
"Nature": ["Rigide","Jovial"],
"Talent": ["Annule Garde"],
"Ball": ["Masse Ball"]},
{"name": "Mysdibule",
"version":"1",
"tier": "uu",
"id": "303",
"price": "500",
"EM": ["- Croc Eclair","- Croc Feu","- Fulmifer","- Câlinerie"],
"Nature": ["Rigide"],
"Talent": ["Intimidation"],
"Ball": ["Love Ball"]},
];

for(i=0;i<Dispo.length;i++) {
	var $this = Dispo[i], item = Dispo[i].name+Dispo[i].version;
	$('.cd-gallery ul').append(`<li class="mix ${item} ${$this.tier}"/>`);
	var card = $(`.${item}`);
	card.append(`<img src="https://www.pkparaiso.com/imagenes/shuffle/sprites/${$this.id}.png"/>`)
		.append('<div class="p-desc"><span/></div><div class="p-name"/><div class="p-price"/><a href="#0" class="cd-add-to-cart">Ajouter au Panier</a>');
	card.find(".p-desc").html('<div class="options"/>' + $this.EM.join('<br/>'));
	card.find(".p-name").html($this.name);
	card.find(".p-price").html($this.price);
	
	card.find('.options').html(`<select id="${item}" class="Nature"/><select id="${item}" class="Talent"/><select id="${item}" class="Ball"/>`);
	var sel = card.find('.options select');
	console.log(sel);
	for(n=0;n<sel.length;n++) {
		var type = sel[n].className, arr = $this[type];
		var child = `<option selected disabled hidden>${type}</option>`;
		$(sel[n]).wrap('<span class="select"/>');
		$(sel[n]).append(child);
		
		for(x=0;x<arr.length;x++) {
			$(sel[n]).append(`<option value="${arr[x]}">${arr[x]}</option>`);
		}
	}
	
}