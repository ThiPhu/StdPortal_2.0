

// Window ready get sutdent list
$(window).ready(()=>{
    getUserList("student")
})
// Get faculty list on button click
$(".btn-sw--faculty").on("click",(event) =>{
    // $(".btn-sw--faculty").toggleClass("btn--active").attr("disabled",true)
    // $(".btn-userType-switch")
    getUserList("faculty")

})
// Get user list
function getUserList(role){
    fetch(`/api/user?role=${role}`)
        .then((res)=> res.json())
        .then((json)=>{
            if (!json.ok){
                console.log(json.msg)
                return;
            }
            console.log(json.user)
            if(role === "student"){
                // Reset 
                $(".table-student").find("tbody").html("")
                json.user.map((user)=>{
                    // Get student list
                    $(".table-student").find("tbody").append(`
                        <tr class="admin_tr_mgmt" style="font-size: 18px;">
                            <td>
                                <div>
                                    <img src="${user.avatar}" alt="Avatar" class="admin_avatar_mgmt">
                                </div>
                            </td>
                            <td>
                                <div>${user.fullname}</div>
                            </td>
                            <td>
                                <div>Học viên</div>
                            </td>
                            <td class="admin_td_faculty">
                                <div>${user.faculty}</div>
                            </td>
                            <td class="admin_td_topic">
                                <div>
                                    ${user.class}
                                </div>
                            </td>
                            <td>
                                <div class="row container">
                                    <div class="col-6 mngt-act-btn mngt-profile-user"
                                        data-bs-toggle="tooltip" title="Xem trang người dùng">
                                        <a class="m-3 d-flex justify-content-center"
                                            href="/profile/${user.fullname}">
                                            <span class="material-icons-outlined">
                                                account_circle
                                            </span>
                                            <p class="m-0 ms-2">Profile</p>
                                        </a>
                                    </div>
                                    <div class="col-6 mngt-act-btn mngt-del-user"
                                        data-bs-toggle="tooltip" title="Xoá người dùng">
                                        <a class="m-3 d-flex justify-content-center" href="#">
                                            <span class="material-icons-outlined">
                                                delete
                                            </span>
                                            <p class="m-0 ms-2">Delete</p>
                                        </a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `)
                })
            }else if(role === "faculty"){
                // Reset 
                $(".table-faculty").find("tbody").html("")
                json.user.map((user)=>{
                    // Get faculty list
                    $(".table-faculty").find("tbody").append(`
                        <tr class="admin_tr_mgmt" style="font-size: 18px;">
                            <td>
                                <div>
                                    <img src="${user.avatar}" alt="Avatar" class="admin_avatar_mgmt">
                                </div>  
                            </td>
                            <td>
                                <div>${user.username}</div>
                            </td>
                            <td>
                                <div>Phòng/Khoa</div>
                            </td>
                            <td class="admin_td_faculty">
                                <div>${user.faculty}</div>
                            </td>
                            <td class="admin_td_topic">
                                <div>
                                    ${user.class}
                                </div>
                            </td>
                            <td>
                                <a class="me-3" href="/profile/${user.username}"
                                    style="cursor:pointer; color: green;">
                                    <span class="material-icons-outlined" data-bs-toggle="tooltip"
                                        title="Profile">
                                        account_circle
                                    </span>
                                </a>
                                <a class="me-3" href="#" style="cursor:pointer; color: red">
                                    <span class="material-icons-outlined" data-bs-toggle="tooltip"
                                        title="Xoá người dùng">
                                        delete
                                    </span>
                                </a>
                                <a class="me-3" href="#" style="cursor:pointer; color: coral">
                                    <span class="material-icons-outlined" data-bs-toggle="tooltip"
                                        title="Cấp quyền chủ đề">
                                        topic
                                    </span>
                                </a>
                            </td>
                        </tr>
                    `)
                })
            }
        })
}


// createFacultyAccountModal select
$("#createFacultyAccountModal").find("select#unit-select").on("change",(event) =>{
    const unitSelect = $("#createFacultyAccountModal").find("select#unit-select")
    const sectionSelect= $("#createFacultyAccountModal").find("select#section-select")
    let unitSelectVal = $(unitSelect).val()
    console.log(unitSelectVal)

    // reset
    $(sectionSelect).html("")
    fetch(`/api/section?unit=${unitSelectVal}`)
        .then((res) => res.json())
        .then(({ok,sections})=>{
            console.log(sections)
            sections.map((item)=>{
                $(sectionSelect).append(`
                <option value=${item._id}>${item.name}</option>
            `)
            })
        })

})

// Form submit handler
$("#createFacultyAccount").on("submit", (event) => {
    const inputEmail = $(".inputEmail").val()
    const inputPassword = $(".inputPassword").val()
    const sectionSelect = $("#section-select").val()
    console.log(sectionSelect)

    fetch("/api/user",{
        method: "POST",
        body: new URLSearchParams({
            email: inputEmail,
            password: inputPassword,
            role: "faculty",
            unit: sectionSelect,
            topics: [sectionSelect]
        })
    })
    .then((res) => res.json())
    .then(({ok,msg,data}) => {
        if(!ok){
            console.log("error",msg)
        }
    })
})



