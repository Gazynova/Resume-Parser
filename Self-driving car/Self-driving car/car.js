class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 4){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;


        this.controls = new Controls(controlType);

        //giving car speed and acceleration for realistic momentum physics
        this.speed = 0;
        this.acceleration = 0.2;

        // Giving the car a max speed so that it doesn't accelerate infinitely
        this.maxSpeed = maxSpeed;

        //Giving the car some friction so that it decelerates eventually and stops
        this.friction = 0.05;

        // To replicate turning the car:
        this.angle = 0;

        // damage
        this.damaged = false;

        this.useBrian = controlType == "AI";

        
        // Load sensor into the car:
        if(controlType != "DUMMY"){
            this.sensor = new Sensor(this);
            //connecting the car to the neural network
            this.brain=new NeuralNetwork(
                [this.sensor.rayCount,6,4]
            );
        }
    }

    update(roadBorders, traffic){
        /* To clean the code moving all the code into a private method called #move */
        //stops the car when it gets damaged
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            //Check collison
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }

        // update the sensor
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
            // value closer to 1 if object nearer
            const offsets = this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
           const outputs = NeuralNetwork.feedForward(offsets, this.brain);
           //console.log(outputs);
           if(this.useBrian){
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
           }
        }
    }

    #assessDamage(roadBorders, traffic){
        for (let i = 0; i < roadBorders.length; i++) {
            if(polysIntersect(this.polygon, roadBorders[i])){
                return true;
            } 
        }
        for (let i = 0; i < traffic.length; i++) {
            if(polysIntersect(this.polygon, traffic[i].polygon)){
                return true;
            } 
        }
        return false;
    }


    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x:this.x - Math.sin(this.angle-alpha) * rad,
            y:this.y - Math.cos(this.angle-alpha) * rad
        });
        points.push({
            x:this.x - Math.sin(this.angle+alpha) * rad,
            y:this.y - Math.cos(this.angle+alpha) * rad
        });
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle-alpha) * rad,
            y:this.y - Math.cos(Math.PI + this.angle-alpha) * rad
        });
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle+alpha) * rad,
            y:this.y - Math.cos(Math.PI + this.angle+alpha) * rad
        });
        return points;
    }

    #move() {
        if(this.controls.forward){
            //this.y -= 2; Car stops immediately when key is released
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            //this.y += 2; Car stops immediately when key is released
            this.speed -= this.acceleration;
        }

        // The speed should not exceed max Speed 
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }

        // Reverse max speed is lower than forward max speed
        if(this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2
        }

        // Handling friction 
        if(this.speed > 0){
            this.speed -= this.friction;
        }

        if(this.speed < 0){
            this.speed += this.friction;
        }

        // if the speed is not 0 then there remains some net speed which moves it tiny bit, to handle that:
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        } 

        //to flip the controls in reverse:
        if(this.speed != 0){
            const flip = this.speed > 0? 1: -1;
            // Left and Right Movements:
            if(this.controls.left){
                //this.x -= 2; moves the car horizontally left
                this.angle += 0.03 * flip;
            }
            if(this.controls.right){
                //this.x += 2;
                this.angle -= 0.03 * flip;
            }
        }

        // to move the car in the direction it is pointing
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
        //this.y -= this.speed;
    }

    draw(ctx, color, drawSensor = false){
        if(this.damaged){
            ctx.fillStyle = "gray";
        }else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
            
        }
        ctx.fill();


       ` using the polygon to draw the car instead 
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
/*this.x*/ -this.width/2,
/*this.y*/ -this.height/2,
            this.width,
            this.height
        )  // (x-pos, y-pos, width, height)
        ctx.fill();

        ctx.restore(); `
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
    }
}