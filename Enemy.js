function normalEnemy(x, y, type)
{
    var STATES = {
        SHOOTING: "SHOOTING",
        STANDING: "STANDING",
        WALKING: "STANDING",
        SEEING: "SEEING"
    }
    this.x = x;
    this.y = y;
    this.type = type;
    this.dir = {x: -1, y: 0};
    this.dead = false;
    this.frame = 0;
    this.sx = 0;
    this.sy = 0;
    this.state = STATES.STANDING;
    this.walkTarget = null;
    this.walkSpeed = .1;
    this.update = function()
    {
        if(this.dead && this.frame == 0)return;
        if(this.walkTarget != null)
        {
            if(this.state == STATES.STANDING)
            {
                this.state = STATES.WALKING;
            }
            this.x += this.dir.x * this.walkSpeed * deltaTime;
            this.y += this.dir.y * this.walkSpeed * deltaTime;
            if(this.walkTarget.x + 1 > this.x && this.walkTarget.x - 1 < this.x
            && this.walkTarget.y + 1 > this.y && this.walkTarget.y - 1 < this.y)
            {
                this.walkTarget = null;
            }
        }
        switch(this.state)
        {
            case STATES.SHOOTING:
                break;
            case STATES.SEEING:
                sx = 0;
                sy = 6;
                break;
            case STATES.STANDING:
                sy = 0;
                //if(this.walkTarget == null)this.generateNewTarget();
                break;
        }
        if(this.state != STATES.SEEING && this.state != STATES.SHOOTING)
        {
            //get corrected orientation of Players direction
            var Pdir = {x: this.x - Player.pos.x, y: this.y - Player.pos.y};
            //convert both players and enemies direction into radians
            var difRad = this.dirToRadians(Pdir);
            var eRad = this.dirToRadians(this.dir);
            var aRad = difRad + eRad;
            if(aRad < 0)aRad += 2 * Math.PI;
            if(aRad > 2 * Math.PI)aRad -= Math.PI;
            //find the right sprite to display
            this.sx = Math.round(aRad / (2 * Math.PI) * 8);
            this.sx = this.sx%8;
        }
    }
    this.generateNewTarget = function()
    {
        var floorPos = {x:Math.round(this.x), y:Math.round(this.y)};
        var newPos = {};
        do
        {
            newPos.x = floorPos.x + Math.round(Math.random() * 4 - 2);
            newPos.y = floorPos.y + Math.round(Math.random() * 4 - 2);
        }
        while(worldMap[newPos.x][newPos.y] != 0);
        console.log(worldMap[newPos.x][newPos.y]);
        newPos.x += .5;
        newPos.y += .5;
        this.walkTarget = newPos;
        this.dir = {x: this.x - newPos.x, y: this.y - newPos.y};
        //normalize dir
        var magnitude = Math.sqrt((this.dir.x * this.dir.x) + (this.dir.y * this.dir.y));
        this.dir.x = this.dir.x / magnitude;
        this.dir.y = this.dir.y / magnitude;
        //DEBUG
    }
    this.drawEnemy = function(texX, stripe, drawStartY, spriteSize)
    {
        if(this.dead && this.frame == 0)
            context.drawImage(Images[this.type], 4*TexSize+texX, 5*TexSize, 1, TexSize, stripe, drawStartY, 1, spriteSize);
        else
        {
            context.drawImage(Images[this.type], this.sx*TexSize+texX, this.sy*TexSize, 1, TexSize, stripe, drawStartY, 1, spriteSize);
        }
    }
    this.toRadians = function(deg)
    {
        return deg * (Math.PI / 180);
    }
    this.dirToRadians = function(dir)
    {
        return Math.atan2(dir.y, dir.x);
    }
    this.radiansToDir = function(rad)
    {
        return {x: Math.cos(rad), y: Math.sin(rad)};
    }
}