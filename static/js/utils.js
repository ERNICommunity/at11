function writeCookie(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();
    if (!nDays) { nDays = 1; }
    expire.setTime(today.getTime() + 3600 * 1000 * 24 * nDays);
    document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString() + ";path=/";
}

function readCookie(name) {
    var cookies = document.cookie.split(";");
    for(var i = 0; i < cookies.length; i++)
    {
        var nameValue = cookies[i].split("=");
        if (nameValue[0].trim() === name)
            return unescape(nameValue[1].trim());
    }
}
