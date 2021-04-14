function openNav() {
    document.getElementById('mySidenav').style.width = '250px';
}

function closeNav() {
    document.getElementById('mySidenav').style.width = '0';
}

$('#updateForm').hide();
$('#updateBtn').on('click', function () {
    $('#updateForm').toggle();
});

