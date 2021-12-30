
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
    console.log(password)
    console.log(passwordConfirm)

 
    let errorFlag = true;
    // reset
    $(msgDisplay).removeClass().addClass("msg-display").html("")

    if(password != passwordConfirm){
        errorFlag = false
        msgMap("Mật khẩu không trùng khớp")
        $(msgDisplay).addClass("msg-display--error").show()
    }

    console.log(errorFlag)
    if(errorFlag){
        fetch(`/profile/${userId}`,{
            method: "POST",
            body: new URLSearchParams({
                password,
                passwordConfirm
            })
        })
        .then(res=> res.json())
        .then(json=>{
            console.log(json)
            if(!json.ok){
                msgMap(json.msg)
                $(msgDisplay).addClass("msg-display--error").show()
                return;
            }
            msgMap(json.msg)
            $(msgDisplay).addClass("msg-display--success").show()
        })
    }
})

function msgMap(msg){
    $(".msg-display").append(`
            <li>${msg}</li>   
    `)
}
