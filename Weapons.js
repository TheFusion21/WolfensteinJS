function weapon(im)
{
    this.cur = 1;
    this.ammo = [
        15,
        5,
        5
    ];
    this.usable = [
        true,
        true,
        false,
        false
    ];
    this.frame = 0;
    this.inUse = false;
    this.shot = false;
    this.image = im;
    this.speed = 
    [
        10,
        10,
        10,
        10
    ];
    this.drawWeapon = function()
    {
        context.drawImage(this.image, 64*Math.floor(this.frame), this.cur*64, 64, 64, w/2-64, sh-124, 128, 128);
    }
    this.getInputs = function()
    {
        if(Input.GetControls("Fire"))
        {
            this.use();
        }
        if(!this.inUse)
        {
            for(var i = 0;i<4;i++)
            {
                if(keys[49+i] && this.usable[i])
                {
                    this.cur = i;
                }
            }
            if(Input.GetControls("Wpn1") && this.usable[0])
                this.cur = 0;
            else if(Input.GetControls("Wpn2") && this.usable[1])
                this.cur = 1;
            else if(Input.GetControls("Wpn3") && this.usable[2])
                this.cur = 2;
            else if(Input.GetControls("Wpn4") && this.usable[3])
                this.cur = 3;
            if(Input.GetControlsDown("NxtWpn"))
            {
                if(this.cur < 4)
                {
                    if(this.usable[this.cur+1])
                        this.cur++;
                }
            }
            if(Input.GetControlsDown("PrevWpn"))
            {
                if(this.cur > 0)
                {
                    if(this.usable[this.cur-1])
                        this.cur--;
                }
            }
        }
    }
    this.update = function()
    {
        if(this.inUse)
        {
            this.frame += deltaTime*this.speed[this.cur];
            if(Math.floor(this.frame) == 2 && this.shot == false && this.cur != 0)
            {
                this.ammo[this.cur-1]--;
                this.shot = true;
            }
            if(this.frame >= 5)
            {
                this.inUse = false;
                this.frame = 0;
                this.shot = false;
            }
        }
        else
        {
            if(this.cur > 0)
            {
                if(this.ammo[this.cur-1] <= 0 || this.usable[this.cur] == false)
                {
                    this.usable[this.cur] = false;
                    this.cur--;
                }
            }
        }
    }
    this.use = function()
    {
        if(this.inUse || this.ammo[this.cur-1] <= 0)return;
        this.inUse = true;
    }
}