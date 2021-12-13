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



