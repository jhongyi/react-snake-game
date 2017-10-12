import React, { Component } from 'react';
import classNames from 'classnames';
import './Content.less';

const gameStageArea = {
  width: 50,
  height: 20,
};

// e.keyCode
const direction = {
  left: 37,
  top: 38,
  right: 39,
  bottom: 40,
};

const gameSpeed = 50;

const defaultState = {
  direction: direction.right,
  snake: [457, 456, 455],
  point: 232,
  canUpdateDirection: true,
  timeoutId: undefined,
};

export default class Content extends Component {
  constructor() {
    super();
    this.state = {
      stage: this.generateStage(),
      ...defaultState,
    };
  }

  generateStage = () => Array.from(Array(gameStageArea.height))
    .map((colValue, colIndex) => (
      Array.from(Array(gameStageArea.width))
        .map((rowValue, rowIndex) => ({
          id: (colIndex * gameStageArea.width) + rowIndex,
          key: `block${(colIndex * gameStageArea.width) + rowIndex}`
        }))
      )
    );


  gameStart = () => {
    this.setState({ timeoutId: setTimeout(this.updateGame, gameSpeed) });
  }

  resetGame = () => {
    this.setState(defaultState);
  }

  gameOver = () => {
    clearTimeout(this.state.timeoutId);
    this.setState({ timeoutId: undefined });
  }

  shouldUpdatePoint = () => this.state.snake[0] === this.state.point;

  genreateNewPoint = () => {
    let newPoint;
    const hasDuplicatePoint = () => this.state.snake.find(snakeId => snakeId === newPoint);
    do {
      newPoint = Math.floor(Math.random() * gameStageArea.height * gameStageArea.width);
    } while (hasDuplicatePoint());
    this.setState({ point: newPoint });
  }
  /**
   *  左牆              右牆
   * |  0 ............  49|
   * | 50 ............  99|
   * |100 ............ 149|
   * |150 ............ 209|
   * |200 ............ 249|
   * |250 ............ 299|
   * |300 ............ 349|
   * |350 ............ 399|
   * |400 ............ 449|
   * |450 ............ 449|
   * |500 ............ 549|
   * ......................
   */
  isGameEnd = (newSnake, oldSnake) => {
    let isEnd = false;
    const newSnakeHead = newSnake[0];
    const oldSnakeHead = oldSnake[0];
    console.log('-------------snake---------------');
    console.log(newSnakeHead);
    console.log(oldSnakeHead);
    console.log('------------------------------------');
    // 上面牆壁
    if (newSnakeHead < 0) {
      isEnd = true;
    }
    // 下面牆壁
    if (newSnakeHead > ((gameStageArea.height * gameStageArea.width) - 1)) {
      isEnd = true;
    }
    // 左邊牆壁
    if (newSnakeHead + 1 === oldSnakeHead && oldSnakeHead % gameStageArea.width === 0) {
      isEnd = true;
    }
    // 右邊牆壁
    if (newSnakeHead - 1 === oldSnakeHead && newSnakeHead % gameStageArea.width === 0) {
      isEnd = true;
    }
    return isEnd;
  }

  updateGame = () => {
    const newSnake = [...this.state.snake];
    switch (this.state.direction) {
      // 將數值塞入陣列最前面
      case direction.left:
        newSnake.unshift(newSnake[0] - 1);
        break;
      case direction.right:
        newSnake.unshift(newSnake[0] + 1);
        break;
      case direction.top:
        newSnake.unshift(newSnake[0] - gameStageArea.width);
        break;
      case direction.bottom:
        newSnake.unshift(newSnake[0] + gameStageArea.width);
        break;
      default:
    }
    console.log('------------------------------------');
    console.log(newSnake);
    console.log('------------------------------------');
    if (this.isGameEnd(newSnake, this.state.snake)) {
      this.gameOver();
      alert('遊戲結束');
      this.resetGame();
      return;
    }
    if (this.shouldUpdatePoint()) {
      this.genreateNewPoint();
    } else {
      // 拿掉陣列最後一個數值
      newSnake.pop();
    }

    this.setState({ snake: newSnake, canUpdateDirection: true });
    setTimeout(this.updateGame, gameSpeed);

  }

  onKeyDown = (e) => {
    let shouldUpdateDirection = false;
    switch (e.keyCode) {
      case direction.left:
        // 防止往反相向回走 (正在往右走點擊左邊方向)
        if (this.state.direction !== direction.right) {
          shouldUpdateDirection = true;
        }
        break;
      case direction.top:
        if (this.state.direction !== direction.bottom) {
          shouldUpdateDirection = true;
        }
        break;
      case direction.right:
        if (this.state.direction !== direction.left) {
          shouldUpdateDirection = true;
        }
        break;
      case direction.bottom:
        if (this.state.direction !== direction.top) {
          shouldUpdateDirection = true;
        }
        break;
      default:
        break;
    }
    if (shouldUpdateDirection && this.state.canUpdateDirection) {
      this.setState({ direction: e.keyCode, canUpdateDirection: false });
    }
    if (!this.state.timeoutId) {
      this.gameStart();
    }
  }

  render() {
    return (
      <div className="content">
        <div id="stage" tabIndex="0" onKeyDown={this.onKeyDown}>
          {
            this.state.stage.map((stageRow, rowIndex) =>
              <div className="stageRow" key={`stageRow${rowIndex}`}>
                {
                  stageRow.map(stageCol =>
                    <div
                      className={classNames('stageCol',
                        {
                          snake: this.state.snake.find(snakeId => stageCol.id === snakeId),
                          point: this.state.point === stageCol.id
                        }
                      )}
                      key={stageCol.key}
                    />
                  )
                }
              </div>
            )
          }
        </div>
        {/* <div>點一下黑色區域以後就可以用上下左右操控</div> */}
      </div>
    );
  }
}
