import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  let N = 20;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;
  const STOP = 32;
  const emptyBox = () => {
    let array = [];
    for (let i = 0; i < N; i++) {
      let temp = [];
      for (let j = 0; j < N; j++) {
        temp.push(0);
      }
      array.push(temp);
    }
    return array;
  };
  const getRandom = () => {
    return {
      x: Math.floor(Math.random() * N),
      y: Math.floor(Math.random() * N),
    };
  };
  const speed = 100;
  const [boxs, setBoxs] = useState(emptyBox());
  const [snakes, setSnakes] = useState([getRandom()]);
  const [food, setFood] = useState(getRandom());
  const [head, setHead] = useState({});
  const [direction, setDirection] = useState(RIGHT);

  useEffect(() => {
    let interval = setInterval(moveSnake, speed);
    document.addEventListener("keydown", changeDirection);

    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", changeDirection);
    };
  }, [snakes, food, direction]);

  const moveSnake = () => {
    // console.log("moveSnake");
    let snakeCopy = [...snakes];
    let head = { ...snakeCopy[snakeCopy.length - 1] };
    switch (direction) {
      case LEFT:
        head.y += -1;
        break;
      case UP:
        head.x += -1;
        break;
      case RIGHT:
        head.y += 1;
        break;
      case DOWN:
        head.x += 1;
        break;
      default:
        return;
    }
    /* keep the value within range of 0 to N */

    if (head.x == -1) {
      head.x = N - 1;
    } else if (head.x == N) {
      head.x = 0;
    }
    if (head.y == -1) {
      head.y = N - 1;
    } else if (head.y == N) {
      head.y = 0;
    }

    snakeCopy.push(head);
    if (head.x === food.x && head.y === food.y) {
      console.log("food");

      // setSnakes(snakeCopy);
      setFood(getRandom());
    } else {
      snakeCopy.shift();
    }
    setSnakes(snakeCopy);
    setHead(head);

    update();
  };
  const update = () => {
    setBoxs((last) => {
      let array = emptyBox();

      snakes.forEach((element) => (array[element.x][element.y] = 2));
      array[food.x][food.y] = 1;
      // console.log(array);

      return array;
    });
    // isCollapsed
    isCollapsed();
    // console.log( boxs);
  };
  const changeDirection = ({ keyCode }) => {
    let currentDirection = direction;
    switch (keyCode) {
      case LEFT:
        currentDirection = direction === RIGHT ? RIGHT : LEFT;
        break;
      case RIGHT:
        currentDirection = direction === LEFT ? LEFT : RIGHT;
        break;
      case UP:
        currentDirection = direction === DOWN ? DOWN : UP;
        break;
      case DOWN:
        currentDirection = direction === UP ? UP : DOWN;
        break;
      case STOP:
        currentDirection = STOP;
        break;
      default:
        break;
    }
    setDirection(currentDirection);
  };
  const isCollapsed = () => {
    let snake = [...snakes];
    let head = { ...snake[snake.length - 1] };
    for (let i = 0; i < snake.length - 1; i++) {
      let count = 0;
      if (head.x === snake[i].x && head.y === snake[i].y) {
        setBoxs(emptyBox());
        setSnakes([getRandom()]);

        setFood(getRandom());
        // setHead({});

        alert(`game over - length snake: ${snake.length}`);

        break;
      }
    }
  };
  return (
    <div className="main-box">
      {boxs.map((row, indexRow) => {
        return row.map((column, indexCol) => {
          return (
            <div
              key={column + row + indexCol}
              className={column == 1 ? "food" : column == 2 ? "snake" : "box"}
            ></div>
          );
        });
      })}
    </div>
  );
}

export default App;
