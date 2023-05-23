class Road {
    constructor(/*Center x*/x, width, laneCount = 3){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width/2;
        this.right = x + width/2;

        // to stretch to road infinitely vertically:
        const infinity = 10000000;
        this.top = -infinity;
        this.bottom = infinity;

        // borders for collison detection:
        const topLeft = {x:this.left, y:this.top};
        const topRight = {x:this.right, y:this.top};
        const bottomLeft = {x:this.left, y:this.bottom};
        const bottomRight = {x:this.right, y:this.bottom};
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    // Get the center of the lane to place the car at the center of the lane:
    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.laneCount;
        return this.left + laneWidth/2 + 
        Math.min(laneIndex, this.laneCount - 1) * laneWidth
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        // to draw lanes we use a for loop and linear interpolation:
        for (let i = 1; i <= this.laneCount - 1; i++) {
            // x is the coord at which we draw the lane
            // lerp is the linear interpolation function
            const x = lerp(
                this.right,
                this.left,
                i/this.laneCount // a fraction (percentage) of the whole road
            )
             
            /* Drawing the borders and Dashed line seperately
                
                // Set dashes for middle lanes
                if(i > 0 && i < this.laneCount){
                    ctx.setLineDash([20, 20]);
                }else{
                    ctx.setLineDash([]);
                }
            */

            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });

        /*  Moving this inside the loop:

            //draw a line from top-left to bottom-left
            ctx.beginPath();
            ctx.moveTo(this.left, this.top);
            ctx.lineTo(this.left, this.bottom);
            ctx.stroke();

            //draw a line from top-right to bottom-right
            ctx.beginPath();
            ctx.moveTo(this.right, this.top);
            ctx.lineTo(this.right, this.bottom);
            ctx.stroke();
        */


    }
}

