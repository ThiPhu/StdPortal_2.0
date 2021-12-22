

// Window ready get sutdent list
$(window).ready(()=>{
    getUserList("student")
})
// Get faculty list on button click
// one: only execute function once
$(".btn-sw--faculty").one("click", (event) =>{
    // $(".btn-sw--faculty").toggleClass("btn--active").prop("disabled",true)
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
                                <div>${user.unit.name}</div>
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

// createFacultyAccountModal map section-select based on unit-select value
$("#createFacultyAccountModal").find("select#unit-select").on("change",(event) =>{
    const unitSelect = $("#createFacultyAccountModal").find("select#unit-select")
    const sectionSelect= $("#createFacultyAccountModal").find("select#section-select")
    const topicSelect= $("#createFacultyAccountModal").find(".topic-select")
    let unitSelectVal = $(unitSelect).val()
    console.log(unitSelectVal)

    // reset
    $(sectionSelect).html("")
    $(topicSelect).html("").append("<legend>Chọn chủ đề quản lí</legend>")
    fetch(`/api/section?unit=${unitSelectVal}`)
        .then((res) => res.json())
        .then(({ok,sections})=>{
            console.log(sections)
            // sections
            sections.map((item)=>{
                $(sectionSelect).append(`
                <option value=${item._id}>${item.name}</option>
            `)
            })
            // topics
            sections.map((item,index)=>{
                $(topicSelect).append(`
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${item._id}" id="cb${index}">
                        <label class="form-check-label" for="cb${index}">
                        ${item.name}
                        </label>
                    </div>
                `)
            })
    })

    // Form submit handler
    $("#createFacultyAccount").on("submit", (event) => {
        event.preventDefault()

        const inputEmail = $(".inputEmail").val()
        const inputPassword = $(".inputPassword").val()
        const sectionSelect = $("#section-select").val()
        const topicSelect= $("#createFacultyAccountModal").find(".topic-select")

        // get checked checkbox
        let selectedTopic = []
        $(topicSelect).find("input[type=checkbox]:checked").each((index,item)=>{
            selectedTopic.push($(item).val())
        })
        console.log(selectedTopic)

        fetch("/api/user",{
            method: "POST",
            body: new URLSearchParams({
                email: inputEmail,
                password: inputPassword,
                role: "faculty",
                unit: sectionSelect,
                topics: selectedTopic
            })
        })
        .then((res) => res.json())
        .then(({ok,msg,data}) => {
            if(!ok){
                console.log("error",msg)
                return;
            }
            getUserList("faculty")
        })
        .finally(()=>{
            // Reset form
            document.getElementById("createFacultyAccount").reset()
        })
    })

});

// $(document).ready(function() {
//     // Select2
//     $('#topic-select').select2({
//         // attach dropdown to modal rather than body
//         dropdownParent: $("#createFacultyAccountModal"),
//         ajax: {
//             url: "/api/section?section?unit='central'",
//             dataType: "json",
//             type: "GET",
//         },
//         placeholder: "Chọn chủ đề"
//     });
// })


