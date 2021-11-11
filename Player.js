function player(pos, dir, plane)
{
    this.pos = pos;
    this.dir = dir;
    this.plane = plane;
    this.health = 100;
    this.score = 0;
    this.lives = 8;
    this.health = 100;

    this.animSpeed = 3;
    this.timeout = 3;
    this.curTimeout = 0;
    this.curFrameX = 1;
    this.isWatching = false;
    this.isMoved = false;
    this.Weapon = new weapon(Images.Weapons);
    //CALCULATE SIN AND COS FROM 90 CONVERTED IN RADIANS
    const Deg90 = 90 * (Math.PI / 180);
    this.Cos90 = Math.cos(Deg90);
    this.Sin90 = Math.sin(Deg90);

    this.getInputs = function()
    {
        var moveS = deltaTime * 5;
        if(moveS > 100)return;
        //forward
        if(Input.GetControls("Fwrd"))
        {
            this.moveFwrd(moveS * Math.abs(Input.GetControlsValue("Fwrd")));
        }
        //else if()
        //backward
        if (Input.GetControls("Bkwrd"))
        {
            this.moveBwrd(moveS * Math.abs(Input.GetControlsValue("Bkwrd")));
        }
        //left
        if (Input.GetControls("Lwrd"))
        {
            this.moveLeft(moveS * Math.abs(Input.GetControlsValue("Lwrd")));
            
        }
        //right
        if (Input.GetControls("Rwrd"))
        {
            this.moveRght(moveS * Math.abs(Input.GetControlsValue("Rwrd")));
        }
        var rotS = deltaTime * 3;
        //right rotate
        if (Input.GetControls("Right"))
        {
            this.lookRght(rotS * Math.abs(Input.GetControlsValue("Right")));
            if(this.curTimeout == 0)this.isMoved = true;
        }
        //left rotate
        if (Input.GetControls("Left"))
        {
            this.lookLeft(rotS * Math.abs(Input.GetControlsValue("Left")));
            if(this.curTimeout == 0)this.isMoved = true;
        }
        this.Weapon.getInputs();
    };
    this.moveFwrd = function(speed)
    {
        var mapPoint = worldMap[Math.floor(this.pos.x + this.dir.x * deltaTime*20)][Math.floor(this.pos.y)];
        if(mapPoint > 49 || mapPoint == 0) this.pos.x += this.dir.x * speed;

        mapPoint = worldMap[Math.floor(this.pos.x)][Math.floor(this.pos.y + this.dir.y * deltaTime*20)];
        if(mapPoint > 49 || mapPoint == 0) this.pos.y += this.dir.y * speed;
    };
    this.moveBwrd = function(speed)
    {
        var mapPoint = worldMap[Math.floor(this.pos.x - this.dir.x * deltaTime*20)][Math.floor(this.pos.y)]
        if(mapPoint > 49 || mapPoint == 0) this.pos.x -= this.dir.x * speed;

        mapPoint = worldMap[Math.floor(this.pos.x)][Math.floor(this.pos.y - this.dir.y * deltaTime*20)];
        if(mapPoint > 49 || mapPoint == 0) this.pos.y -= this.dir.y * speed;
    };
    this.moveLeft = function(speed)
    {
        var RotDirX = this.dir.x * this.Cos90 - this.dir.y * this.Sin90;
        var RotDirY = this.dir.x * this.Sin90 + this.dir.y * this.Cos90;

        var mapPoint = worldMap[Math.floor(this.pos.x + RotDirX * deltaTime*20)][Math.floor(this.pos.y)];
        if(mapPoint > 49 || mapPoint == 0) this.pos.x += RotDirX * speed;

        mapPoint = worldMap[Math.floor(this.pos.x)][Math.floor(this.pos.y + RotDirY * deltaTime*20)];
        if(mapPoint > 49 || mapPoint == 0) this.pos.y += RotDirY * speed;
    };
    this.moveRght = function(speed)
    {
        var RotDirX = this.dir.x * this.Cos90 - this.dir.y * this.Sin90;
        var RotDirY = this.dir.x * this.Sin90 + this.dir.y * this.Cos90;

        var mapPoint = worldMap[Math.floor(this.pos.x - RotDirX * deltaTime*20)][Math.floor(this.pos.y)];
        if(mapPoint > 49 || mapPoint == 0) this.pos.x -= RotDirX * speed;

        mapPoint = worldMap[Math.floor(this.pos.x)][Math.floor(this.pos.y - RotDirY * deltaTime*20)];
        if(mapPoint > 49 || mapPoint == 0) this.pos.y -= RotDirY * speed;
    };
    this.lookLeft = function(speed)
    {
        //both camera direction and camera plane must be rotated
        var oldDirX = this.dir.x;
        this.dir.x = this.dir.x * Math.cos(speed) - this.dir.y * Math.sin(speed);
        this.dir.y = oldDirX * Math.sin(speed) + this.dir.y * Math.cos(speed);
        var oldPlaneX = this.plane.x;
        this.plane.x = this.plane.x * Math.cos(speed) - this.plane.y * Math.sin(speed);
        this.plane.y = oldPlaneX * Math.sin(speed) + this.plane.y * Math.cos(speed);
    };
    this.lookRght = function(speed)
    {
        //both camera direction and camera plane must be rotated
        var oldDirX = this.dir.x;
        this.dir.x = this.dir.x * Math.cos(-speed) - this.dir.y * Math.sin(-speed);
        this.dir.y = oldDirX * Math.sin(-speed) + this.dir.y * Math.cos(-speed);
        var oldPlaneX = this.plane.x;
        this.plane.x = this.plane.x * Math.cos(-speed) - this.plane.y * Math.sin(-speed);
        this.plane.y = oldPlaneX * Math.sin(-speed) + this.plane.y * Math.cos(-speed);
    };
    this.update = function()
    {
        this.Weapon.update();
        if(this.isMoved && !this.isWatching && this.curTimeout == 0)
        {
            this.isWatching = true;
            this.curFrameX = 0;
        }
        if(this.isWatching && this.isMoved)
        {
            this.curTimeout += deltaTime;
            this.curFrameX += deltaTime * this.animSpeed;
            
            if(Math.floor(Player.curFrameX) > 2)
            {
                this.curFrameX = 1;
                this.isMoved = false;
            }
        }
        else if(this.isWatching)
        {
            this.curTimeout += deltaTime;
            if(this.curTimeout > this.timeout)
            {
                this.curTimeout = 0;
                this.isWatching = false;
            }
        }
        
    };

    this.draw = function()
    {
        this.Weapon.drawWeapon();
    };
}