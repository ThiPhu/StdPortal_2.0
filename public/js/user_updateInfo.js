
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

const userId = $("#updateUserInfo").attr("data-id")

// Student form submit handler


// Faculty form submit handler
$("#updateUserInfo").on("submit", (e) =>{
    e.preventDefault()

    const password = $(".user-password").val()
    const passwordConfirm = $(".user-password-confirm").val()

    const msgDisplay = $(".msg-display")

    const msgArray = [];
    msgDisplay.html("")

    if(password === passwordConfirm){
        fetch(`/api/profile/${userId}`,{
            method: "POST",
            body: new URLSearchParams({
                password
            })
            .then((res)=>{
                res.json()
            })
            .then((json)=>{
                if(!json.ok){
                    msgArray.push(json.msg)
                    msgMap(msgArray)
                    $(msgDisplay).addClass("msg-display--error").show()
                    return;
                }
                msgArray.push(json.msg)
                msgMap(msgArray)
                $(msgDisplay).addClass("msg-display--error").show()
            })
        })
    } else {
        msgArray.push("Mật khẩu không trùng khớp")
        msgMap(msgArray)
        $(msgDisplay).addClass("msg-display--error").show()
    }
})

function msgMap(msgArray){
    msgArray.map((msg)=>{
        $(".msg-display").append(`
                <li>${msg}</li>   
        `)
    })
}




