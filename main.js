function toArray(list)
{
	return Array.prototype.slice.call(list);
}

// Display input text
let display_text_input = document.getElementById("display-text-input");
let display_text = document.getElementById("text-display");
let font_search_input = document.getElementById("font-search-input");
let font_list = document.getElementById("font-list");
let font_list_items = document.querySelectorAll(".font-item");

display_text_input.addEventListener("keyup", () =>
{
	if(display_text_input.value)
		display_text.innerHTML = display_text_input.value;
	else
		display_text.innerHTML = display_text.dataset.defaultValue;
});

// Get fonts from
// https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyD8N0E2u6yoKu_54wu2_Tb8r7u_-wehXfE

const font_api_request = new XMLHttpRequest();
let font_api_response = null;

font_api_request.onreadystatechange = () =>
{
	if(font_api_request.status == 200 && font_api_request.readyState == 4)
	{
		font_api_response = JSON.parse(font_api_request.responseText);
		
		for(let i = 0;
			i < font_api_response.items.length;
			i++)
		{
			let current_font = font_api_response.items[i];
			let new_font_item = document.createElement("div");
			new_font_item.classList.add("font-item");
			new_font_item.classList.add("visible");
			new_font_item.innerText = current_font.family;
			new_font_item.dataset.fontUrl = current_font.files.regular;
			font_list.appendChild(new_font_item);
		}

		font_list_items = document.querySelectorAll(".font-item");
			
		font_list_items.forEach(item => {
			item.addEventListener("click", () =>
			{
				const new_font = new FontFace(item.innerHTML, `url(${item.dataset.fontUrl})`);
				new_font.load().then(loaded_face =>
				{
					document.fonts.add(loaded_face);
					display_text.style.fontFamily = `${item.innerHTML}, Arial`;
				}).catch(error =>
				{
					console.log("An error occurred");
				});
			});
		});
	}
};

const part1 = `AIzaSyD8N0E2u6yoKu_`;
const part2 = `54wu2_Tb8r7u_-`;
const part3 = `wehXfE`;

font_api_request.open("GET", `https://www.googleapis.com/webfonts/v1/webfonts?key=${part1}${part2}${part3}`, true);
font_api_request.send();

// Font filter
font_search_input.addEventListener("keyup", () =>
{
	// let font_names = toArray(font_list_items).map(item => item.innerHTML);
	let input_value = font_search_input.value.toLowerCase();
	font_list_items.forEach(item =>
	{
		if(item.innerHTML.toLowerCase().includes(input_value))
		{
			item.classList.add("visible");
		}
		else
		{
			item.classList.remove("visible");
		}
	});
	
	// toArray(font_list_items).filter(item =>
	// 	item.innerHTML.toLowerCase().includes(font_search_input.value.toLowerCase())
	// ).forEach(item =>
	// {
	// 	item.classList.remove("hidden");
	// });
});