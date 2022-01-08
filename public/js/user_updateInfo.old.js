
if(window.location.href.indexOf("update-info") > -1){
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
            // Get selected option
            const selected_option = $(sectionSelect).attr("data-selected") 
            // sections
            sections.map((item)=>{
                $(sectionSelect).append(`
                <option value=${item._id} ${selected_option == item._id && "selected"}>${item.name}</option>
            `)
            })
        })
        .then(()=>{console.log("mapSection COMPLETE")})
    }

    // Get user avatar
    $(".avatar-upload-button").on("click", (e) => {
        $(".avatar_upload").click();
    })



    // Student form submit handler


    $("#updateUserInfo").on("submit", (e) =>{
        e.preventDefault()

        $("#updateUserInfo button[type*='submit']").addClass("disabled")

        const userId = $("#updateUserInfo").attr("data-id")
        const role = $("#updateUserInfo").attr("data-role")

        const msgDisplay = $(".msg-display")
        $(msgDisplay).removeClass().addClass("msg-display").html("")

        // Faculty form submit handler
        if(role == "faculty"){
            const password = $(".user-password").val()
            const passwordConfirm = $(".user-password-confirm").val()
        
            console.log(password)
            console.log(passwordConfirm)
        
        
            let errorFlag = true;
            // reset

            // if(password != passwordConfirm){
            //     errorFlag = false
            //     msgMap("Mật khẩu không trùng khớp")
            //     $(msgDisplay).addClass("msg-display--error").show()
            // }
        
            console.log(errorFlag)
            if(errorFlag){
                fetch(`/profile/faculty/${userId}`,{
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
                .finally(()=>{
                    $("#updateUserInfo button[type*='submit']").removeClass("disabled")
                })
            }
        } else if(role == "student"){
            const userFullName = $(".user-fullName").val()
            const userClass = $(".user-class").val()
            const section = $(".section-select").val()

            const image = $(".avatar_upload")[0].files[0]

            console.log(userFullName, userClass, section,image)

            const formData = new FormData();
            formData.append("fullname",userFullName)
            formData.append("class",userClass)
            formData.append("unit",section)
            formData.append("image",image)

            console.log("formData",formData)
            fetch(`/profile/student/${userId}`,{
                method: "POST",
                body: formData,
            })
            .then(res => res.json())
            .then(json => {
                msgMap(json.msg)
                if(!json.ok){
                    $(msgDisplay).addClass("msg-display--error").show()
                    return;
                } else{
                    $(msgDisplay).addClass("msg-display--success").show()
                }
            })
            .finally(()=>{
                $("#updateUserInfo button[type*='submit']").removeClass("disabled")
            })
        }
    })

    function msgMap(msg){
        $(".msg-display").append(`
                <li>${msg}</li>   
        `)
    }

    // Review image after upload
    const image = $(".img_holder > img")
    const image_input = $(".avatar_upload")

    $(image_input).on("change", function(e){
        var reader = new FileReader()
        reader.onload = function(){
            $(image).attr("src",reader.result)
        }
        reader.readAsDataURL(e.target.files[0])
    })
}