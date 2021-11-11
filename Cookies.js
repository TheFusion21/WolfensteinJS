var Cookies = {
    cookie: {},
    exsistCookie: function(name)
    {
        return this.cookie[name] != null && this.cookie[name] != undefined;
    },
    getCookie: function(name)
    {
        return this.cookie[name];
    },
    setCookie: function(name, data)
    {
        this.cookie[name] = data;
        this.saveCookies();
    },
    saveCookies: function()
    {
        var d = new Date();
        d.setTime(d.getTime() + 15768000000);
        var expires = "expires="+ d.toUTCString();

        document.cookie = "data=" + JSON.stringify(this.cookie) + ";" + expires + ";path=/";
        
    },
    loadCookies: function()
    {
        if(document.cookie != "")
            this.cookie = JSON.parse(document.cookie.substr(5));
    }
}