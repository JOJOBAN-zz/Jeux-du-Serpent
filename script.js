window.onload = function() {
    let canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30;
    let ctx;
    const delay = 100;
    let snakee;
    let applee;
    const widthInBlocks = canvasWidth / blockSize;
    const heigthInBlocks = canvasHeight / blockSize;
    let score;
    let timeout;

    init();

    function init() {
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd"
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4.4],
            [3, 4],
            [2, 4]
        ], "right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas() {
        snakee.advance();
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            if (snakee.isEatingApple(applee)) {
                score++;
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                }
                while (applee.isOnSnake(snakee))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeout = setTimeout(refreshCanvas, delay);
        }

    }

    function gameOver() {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        const centreX = canvasWidth / 2;
        const centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer ", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer ", centreX, centreY - 120);
        ctx.restore();
    }

    function restart() {
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4.4],
            [3, 4],
            [2, 4]
        ], "right");
        applee = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }

    function drawScore() {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const centreX = canvasWidth / 2;
        const centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY, canvasHeight - 5);
        ctx.restore();
    }

    function drawBlock(ctx, position) {
        const x = position[0] * blockSize;
        const y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (let i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function() {
            const nextposition = this.body[0].slice();
            switch (this.direction) {
                case "left":
                    nextposition[0] -= 1;
                    break;
                case "right":
                    nextposition[0] += 1;
                    break;
                case "down":
                    nextposition[1] += 1;
                    break;
                case "up":
                    nextposition[1] -= 1;
                    break;
                default:
                    throw ("Invalid Direction");
            }
            this.body.unshift(nextposition);
            if (!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };
        this.setDirection = function(newDirection) {
            let allowedDirections;
            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw ("Invalid Direction");
            }
            if (allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function() {
            let wallCollision = false;
            let snakeCollision = false;
            const head = this.body[0];
            const rest = this.body.slice(1);
            const snakeX = head[0];
            const snakeY = head[1];
            const minX = 0;
            const minY = 0;
            const maxX = widthInBlocks - 1;
            const maxY = heigthInBlocks - 1;
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            let isNotBetweenVertialWalls = snakeY < minY || snakeY > maxY;
            if (isNotBetweenHorizontalWalls || isNotBetweenVertialWalls) {
                wallCollision = true;
            }
            for (let i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleToEat) {
            let head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        };
    }

    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            const radius = blockSize / 2;
            const x = this.position[0] * blockSize + radius;
            const y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function() {
            let newX = Math.round(Math.random() * (widthInBlocks - 1));
            let newY = Math.round(Math.random() * (heigthInBlocks - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck) {
            let isOnSnake = false;
            for (let i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }

    this.document.onkeydown = function handleKeyDown(e) {
        const key = e.keyCode;
        let newDirection;
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}