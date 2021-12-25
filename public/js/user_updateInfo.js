
// Render section-select
$(window).ready(() =>{
    if($(".section-select")){
        mapSection($(".section-select"))
    } 
})

// Map section function
async function mapSection(sectionSelect){ 
    //  return a promise
    return fetch(`/api/section?unit=faculty`)
    .then((res) => res.json())
    .then(({ok,sections})=>{
        console.log(sections)
        // sections
        sections.map((item)=>{
            $(sectionSelect).append(`
            <option value=${item._id}>${item.name}</option>
        `)
        })
    })
    .then(()=>{console.log("mapSection COMPLETE")})
}

// Get user avatar
$(".avatar-upload-button").on("click", (e) => {
    $(".avatar_upload").click();
})

// 



