
if(window.location.href.indexOf("management") > - 1){
    // Window ready get sutdent list
    $(window).ready(()=>{
        $(".btn-sw--student").addClass("btn--active")
        getUserList("student")
    })
    // Get faculty list on button click
    // one: only execute function once
    $(".btn-sw--faculty").one("click", (event) => {
        // $(".btn-sw--faculty").toggleClass("btn--active").prop("disabled",true)
        // $(".btn-userType-switch")
        getUserList("faculty")
    })

    $(".btn-sw--student").on("click", (event) => {
        if($(".btn-sw--faculty").hasClass("btn--active"))
            $(".btn-sw--faculty").removeClass("btn--active")
        $(event.target).addClass("btn--active")
    })

    $(".btn-sw--faculty").on("click", (event) => {
        if($(".btn-sw--student").hasClass("btn--active"))
            $(".btn-sw--student").removeClass("btn--active")
        $(event.target).addClass("btn--active")
    })

    $(".btn-create-faculty-account").on("click", (event) => {

    })

    // $(".btn-sw--faculty").on("click", (event) =>{
    //     $(".btn-sw--faculty").toggleClass("btn--active")
    // })
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
                                <td class="admin_td_studentId">
                                    <div>
                                        ${user.email.split("@")[0]}
                                    </div>
                                </td>
                                <td class="admin_td_class">
                                    <div>
                                        ${user.class ? user.class : "-" }
                                    </div>
                                </td>
                                <td class="admin_td_faculty">
                                    <div>
                                        ${user.unit ? user.unit.name : "-"}
                                    </div>
                                </td>
                                <td>
                                    <div class="row container">
                                        <div class="col-12 mngt-act-btn mngt-profile-user"
                                            data-bs-toggle="tooltip" title="Xem trang người dùng">
                                            <a class="m-3 d-flex justify-content-center"
                                                href="/profile/${user._id}">
                                                <span class="material-icons-outlined">
                                                    account_circle
                                                </span>
                                                <p class="m-0 ms-2">Profile</p>
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
                            <tr class="admin_tr_mgmt" style="font-size: 18px;" data-id="${user._id}">
                                <td>
                                    <div>
                                        <img src="${user.avatar ? user.avatar : "../../image/tdt.jpg"}" alt="Avatar" class="admin_avatar_mgmt">
                                    </div>  
                                </td>
                                <td>
                                    <div>${user.username}</div>
                                </td>
                                <td>
                                    <div>${user.unit.unit == "central" ? "Phòng" : "Khoa" }</div>
                                </td>
                                <td class="admin_td_faculty">
                                    <div>${user.unit.name}</div>
                                </td>
                                <td class="tools">
                                    <a class="me-3 btn-profile" href="/profile/${user._id}"
                                        style="cursor:pointer; color: green;">
                                        <span class="material-icons-outlined" data-bs-toggle="tooltip"
                                            title="Profile">
                                            account_circle
                                        </span>
                                    </a>
                                    <a class="me-3 btn-delete" style="cursor:pointer; color: red">
                                        <span class="material-icons-outlined" data-bs-toggle="tooltip"
                                            title="Xoá người dùng" style="pointer-events: none">
                                            delete
                                        </span>
                                    </a>
                                    <a class="me-3 btn-update" style="cursor:pointer; color: coral"
                                        data-bs-toggle="modal" data-bs-target="#updateFacultyAccountModal">
                                        <span class="material-icons-outlined" data-bs-toggle="tooltip"
                                            title="Cập nhật thông tin người dùng" style="pointer-events: none">
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
    setModal("#createFacultyAccountModal")
    setModal("#updateFacultyAccountModal")

    function setModal(element){
        $(element).find("select.unit-select").on("change",(event) =>{
            const unitSelect = $(element).find("select.unit-select")
            const sectionSelect= $(element).find("select.section-select")
            const topicSelect= $(element).find(".topic-select")
            let unitSelectVal = $(unitSelect).val()
            console.log(unitSelectVal)
            // reset
            $(sectionSelect).html("")
            $(topicSelect).html("").append("<span class='topic-select__title'>Chọn chủ đề quản lí</span>")

            mapSection(unitSelectVal,sectionSelect,topicSelect)
        });
    }

    // Create user
    $("#createFacultyAccount").on("submit", (event) => {
        event.preventDefault()

        const inputEmail = $(".inputEmail").val()
        const inputPassword = $(".inputPassword").val()
        const sectionSelect = $(".section-select").val()
        const topicSelect= $("#createFacultyAccountModal").find(".topic-select")

        console.log(sectionSelect)

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
            createToast(ok,msg)
            if(ok){
                getUserList("faculty")
            }
        })
        .finally(()=>{
            $("#createFacultyAccountModal").modal("hide")
            // Reset form
            document.getElementById("createFacultyAccount").reset()
            // Reset section select and topic select
            $(sectionSelect).html("")
            $(topicSelect).html("").append("<span class='topic-select__title'>Chọn chủ đề quản lí</span>")
        })
    })

    // Render update user modal
    $(document).on("click", ".btn-update", (event) =>{
        const userId = $(event.target).closest(".admin_tr_mgmt").attr("data-id")

        fetch(`/api/user/${userId}`)
        .then(res => res.json())
        .then((json) =>{
            console.log("json",json)
            if(!json.ok)
                alert(json.msg)
            json.user.map(async (usr)=>{
                $("#updateFacultyAccountModal").attr("data-id", usr._id)
                $("#updateFacultyAccountModal").find(".inputEmail").val(usr.email)
                console.log(usr.unit.unit)
                $("#updateFacultyAccountModal").find(".unit-select").val(usr.unit.unit)

                const sectionSelect= $("#updateFacultyAccountModal").find("select.section-select")
                const topicSelect= $("#updateFacultyAccountModal").find(".topic-select")
                
                // reset
                $(topicSelect).html("").append("<span class='topic-select__title'>Chọn chủ đề quản lí</span>")

                await mapSection(usr.unit.unit,sectionSelect,topicSelect)

                $(sectionSelect).val(usr.unit._id)
                console.log("sectionSelect COMPELTE!")

                console.log("TOPIC", usr.topics)

                if(usr.topics){
                    $(topicSelect).find(".form-check .form-check-input").each((index,item)=>{
                        usr.topics.forEach((topic)=>{
                            if($(item).val() === topic._id){
                                $(item).prop("checked",true)
                            }
                        })
                    })
                }
            })
        })
    })




    //  Update user
    $(document).on("click", "#updateFacultyAccountModal .btn-submit", (event) =>{
        event.preventDefault();
        const updateModal = $(event.target).closest("#updateFacultyAccountModal")
        const userId = $(updateModal).attr("data-id")

        const inputEmail = $(updateModal).find(".inputEmail").val()
        const inputPassword = $(updateModal).find(".inputPassword").val()
        const sectionSelect = $(updateModal).find(".section-select").val()
        const topicSelect= $(updateModal).find(".topic-select")

        let selectedTopic = []
        $(topicSelect).find("input[type=checkbox]:checked").each((index,item)=>{
            selectedTopic.push($(item).val())
        })

        console.log("ITEMS",inputEmail)
        console.log((inputPassword).length)
        console.log(sectionSelect)
        console.log(topicSelect)
        console.log(selectedTopic)

        fetch(`/api/user/${userId}`,{
            method: "PUT",
            body: new URLSearchParams({
                email: inputEmail,
                password: inputPassword.length == 0 ? null : inputPassword,
                unit: sectionSelect,
                topics: selectedTopic
            })
        })
        .then(res => res.json())
        .then(({ok,msg})=>{
                createToast(ok,msg)
            if(ok){
                getUserList("faculty")
            }
        })
        .finally(()=>{
            $("#updateFacultyAccountModal").modal("hide")
        })
    })

    // Delete user
    $(document).on("click", ".btn-delete", async (event) =>{

        event.preventDefault();

        // prompt user confirm
        const isConfirmed = await createConfirmModal()
        console.log("outter",isConfirmed)
        if(isConfirmed){
            const userId = $(event.target).closest(".admin_tr_mgmt").attr("data-id")
            console.log(userId)
            fetch(`/api/user/${userId}`,{
                method: "DELETE",
            })
            .then(res => res.json())
            .then(({ok,msg})=>{
                createToast(ok,msg)
                if(ok){
                    getUserList("faculty")
                }
            })
        } else {
            return;
        }
    })

    // Map section function
    async function mapSection(unit,sectionSelect,topicSelect){ 
        //  return a promise
        return fetch(`/api/section?unit=${unit}`)
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
        .then(()=>{console.log("mapSection COMPLETE")})
    }



    // Button click sẽ chèn class active
    let mngt_btn_student = $('.mngt_btn_student');
    let mngt_btn_faculty = $('.mngt_btn_faculty');
    $('.mngt_btn_student').on('click', e => {
    mngt_btn_faculty.removeClass('active');
    mngt_btn_student.addClass('active');
    });

    $('.mngt_btn_faculty').on('click', e => {
    mngt_btn_student.removeClass('active');
    mngt_btn_faculty.addClass('active');
    });


    // Toast message
    function createToast(result,msg){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        })
        
        Toast.fire({
            icon: result ? "success" : "error",
            title: msg
        })
    }


    // modalConfirm
    async function createConfirmModal(){
        const result = await Swal.fire({
            title: 'Bạn có chắc muốn xóa người dùng',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DC3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            reverseButtons: true
        })

        return result.isConfirmed
    }
}